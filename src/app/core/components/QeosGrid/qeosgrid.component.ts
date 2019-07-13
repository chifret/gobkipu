"use strict";

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, forwardRef, Input, ViewContainerRef, Injector, HostListener, ElementRef, Inject, SkipSelf, Optional, ChangeDetectorRef, HostBinding, EmbeddedViewRef, ApplicationRef } from "@angular/core";

import { HeadersVisibility, KeyAction, Row, Column } from "wijmo/wijmo.grid";
import { WjFlexGrid, wjFlexGridMeta } from "wijmo/wijmo.angular2.grid";
import { WjFlexGridFilter } from "wijmo/wijmo.angular2.grid.filter";

import { CollectionView } from "wijmo/wijmo";
import { FormatItemEventArgs as InputFormatItemEventArgs } from "wijmo/wijmo.input";
import { FlexGridUtils } from "../../utils/flexgrid.utils";
import { QeosGridPanelsComponent } from "../QeosGridPanels/qeosgridpanels.component";
import { ComponentUtils } from "../../utils/component.utils";

@Component({
    moduleId: module.id,
    selector: "qeos-grid",
    template: `<wj-flex-grid-filter #filter
                                [showSortButtons]="false"></wj-flex-grid-filter>
        <ng-template wjFlexGridCellTemplate
                     [cellType]="'TopLeft'"
                     let-cell="cell">
            <div style="width: 16px;"
                 *ngIf="((!this.hadHeaderSubrow && cell.row.index === 0) || (this.hadHeaderSubrow && cell.row.index === 1)) && this.isEditable"
                 (click)="toggleEditMode()">
                <i [attr.data-hidden]="!isReadOnly" class="fa fa-pencil"></i>
                <i [attr.data-hidden]="isReadOnly" class="fa fa-unlock"></i>
            </div>
        </ng-template>${wjFlexGridMeta.template}`,
    inputs: [...wjFlexGridMeta.inputs],
    outputs: [...wjFlexGridMeta.outputs],
    providers: [
        { provide: "WjComponent", useExisting: forwardRef(() => QeosGridComponent) },
        ...wjFlexGridMeta.providers
    ]
})

// https://www.grapecity.com/en/blogs/using-aggregation-create-custom-component-angular-2/

export class QeosGridComponent extends WjFlexGrid implements OnInit, AfterViewInit, OnDestroy {
    private readonly parentCmp;
    @Input("title") title: string = null;
    @Input("isLockedByDefault") isLockedByDefault: boolean = true;  // I don't really agree with that though
    @Input("headerSubRow") headerSubRow: Array<{ width: number, label: string }> = null;
    @Input("defaultSortDescription") defaultSortDescription: Array<{ field: string, asc: boolean }> = null;
    @Input("sortConverter") sortConverter: Function = null;
    @Input("defaultGroupDescription") defaultGroupDescription: Array<string> = null;
    @Input("hideGroupedDescriptions") hideGroupedDescriptions: boolean = false;
    @Input("defaultFilter") defaultFilter: JSON = null;

    @HostBinding("style.height.px") gridHeight: number = 0;

    gridPanels: QeosGridPanelsComponent = null;

    protected pageSize: number;
    protected minimalDisplayedLines = 20;
    protected isSourceCollectionChanging: boolean = false;
    protected posBeforeTab: { row: number, col: number } = { row: -1, col: -1 };
    protected timer: Map<number, any> = new Map();
    protected search: Map<number, string> = new Map();
    protected searchMayReinit: Map<number, boolean> = new Map();
    protected hadHeaderSubrow: boolean = false;
    protected savedSelectedItem = { item: null, position: null };
    protected loadedRowsDebouncer: any;

    @ViewChild("filter", { static: true }) filter: WjFlexGridFilter;

    @HostListener("window:resize", ["$event"]) onResize(event) {
        this.setFlexGridHeight();
    }

    constructor(protected elRef: ElementRef,
        private readonly vcRef: ViewContainerRef,
        protected injector: Injector,
        @Inject("WjComponent") @SkipSelf() @Optional() parentCmp: any,
        protected cdRef: ChangeDetectorRef,
        protected appRef: ApplicationRef) {
        super(elRef, injector, elRef, cdRef);
        this.parentCmp = parentCmp;
    }


    ngOnInit(): void {
        super.ngOnInit();
        this.setGridPanels();
        this.showMarquee = true;
        this.alternatingRowStep = 2;
        this.showSelectedHeaders = HeadersVisibility.Column;
        this.isReadOnly = true;

        // ========================================= grid events (previously declared in html) =========================================
        this.initialized.subscribe(() => {
            this.initGrid();
        });

        this.setHandlersOnCurrentCollectionView();
    }

    ngOnDestroy(): void {
        this.initialized.unsubscribe();
        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        setTimeout(() => {
            this.gridPanels.filter = this.filter;
            this.gridPanels.grid = this;
        });
    }

    // ========================================= private stuff - transparent from outside =========================================
    private initGrid() {
        if (this.headerSubRow) {
            if (((this.columnHeaders.rows as any) as Row[]).length === 1) {
                this.columnHeaders.rows.insert(0, new Row());
            }
            const row = this.columnHeaders.rows[0];
            row.allowMerging = true;
            let currentIndex = 0;
            loop1:
            for (let i = 0; i < this.headerSubRow.length; i++) {
                if (this.headerSubRow[i].label) {
                    for (let j = currentIndex; j < currentIndex + this.headerSubRow[i].width; j++) {
                        if (j < ((this.columnHeaders.columns as any) as Column[]).length) {
                            this.columnHeaders.setCellData(0, j, this.headerSubRow[i].label);
                        } else {
                            break loop1;
                        }
                    }
                }
                currentIndex += this.headerSubRow[i].width;
            }
            this.allowMerging = 2;
            FlexGridUtils.centerHeadersItemFormatter(this);
            this.headerSubRow = null;
            this.hadHeaderSubrow = true;
        }

        this.setDefaultGrouping();
        this.setDefaultSorting();
        this.setFlexGridHeight();

        this.keyActionTab = KeyAction.Cycle;
    }

    private setHandlersOnCurrentCollectionView(e: InputFormatItemEventArgs = null): void {
        if (!this.itemsSource) {
            return;
        }

        this.setDefaultGrouping();
        this.setDefaultSorting();
    }

    private setFlexGridHeight(): void {
        let paddingToBottom: number;
        try {
            let paddingToBottomTmp = window.getComputedStyle(this.hostElement.parentElement.parentElement).paddingBottom;
            paddingToBottomTmp = paddingToBottomTmp.substr(0, paddingToBottomTmp.length - 2);
            paddingToBottom = parseInt(paddingToBottomTmp);
        } catch ($e) {
            paddingToBottom = 10;
        }
        this.gridHeight = window.innerHeight - this.hostElement.getBoundingClientRect().top - paddingToBottom - 5;
    }

    private setGridPanels(): void {
        const tmp = ComponentUtils.addComponent(QeosGridPanelsComponent, this.vcRef, this.injector);
        this.gridPanels = tmp.instance;
        this.gridPanels.grid = this;
        this.gridPanels.filter = this.filter;
        this.gridPanels.hasGroup = true;
        this.gridPanels.hasCollapseButtons = true;
        this.gridPanels.hideGroupedColumns = this.hideGroupedDescriptions;
        (this.vcRef.element.nativeElement as HTMLDivElement).parentElement.insertBefore((tmp.hostView as EmbeddedViewRef<any>).rootNodes[0], (this.vcRef.element.nativeElement as HTMLDivElement));
    }

    private setDefaultSorting() {
        if (this.defaultSortDescription && (this.itemsSource as CollectionView)) {
            if (FlexGridUtils.getColumnsLength(this) > 0) {
                for (let i = 0; i < this.defaultSortDescription.length; i++) {
                    if (FlexGridUtils.getColumnWithColumnBinding(this, this.defaultSortDescription[i].field) !== null) {
                        //this.savedSortDesc.push(new SortDescription(this.defaultSortDescription[i].field, this.defaultSortDescription[i].asc));
                    }
                }
                this.defaultSortDescription = null;
            }
        }
    }

    private setDefaultGrouping() {
        if (this.defaultGroupDescription && (this.itemsSource as CollectionView)) {
            if (FlexGridUtils.getColumnsLength(this) > 0) {
                for (let i = 0; i < this.defaultGroupDescription.length; i++) {
                    if (FlexGridUtils.getColumnWithColumnBinding(this, this.defaultGroupDescription[i]) !== null) {
                        //this.savedGroupDesc.push(new PropertyGroupDescription(this.defaultGroupDescription[i]));
                    }
                }
                this.defaultGroupDescription = null;
            }
        }
    }
}
