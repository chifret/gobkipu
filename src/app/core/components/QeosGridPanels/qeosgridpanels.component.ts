"use strict";

import { Component, Input, ViewChild } from "@angular/core";

import { FlexGridFilter } from "wijmo/wijmo.grid.filter";
import { WjFlexGrid } from "wijmo/wijmo.angular2.grid";
import { FilterPanel } from "./../WjFilterPanel/FilterPanel";
import { GroupPanel } from "wijmo/wijmo.grid.grouppanel";

@Component({
    moduleId: module.id,
    selector: "qeos-gridpanels",
    templateUrl: "qeosgridpanels.component.html"
})

export class QeosGridPanelsComponent {
    @Input("grid") grid: WjFlexGrid;
    @Input("filter") filter: FlexGridFilter;
    @Input("hasGroup") hasGroup: boolean = true;
    @Input("hasCollapseButtons") hasCollapseButtons: boolean = false;

    hideGroupedColumns: boolean = false;

    @ViewChild("filterPanel", { static: true }) filterPanel: FilterPanel;
    @ViewChild("groupPanel", { static: false }) groupPanel: GroupPanel;

    collapse(status: boolean): void {
        if (status) {
            // collapse
            this.grid.collapseGroupsToLevel(0);
        } else {
            // uncollapse
            this.grid.collapseGroupsToLevel(this.grid.collectionView.groupDescriptions.slice().length);
        }
    }
}
