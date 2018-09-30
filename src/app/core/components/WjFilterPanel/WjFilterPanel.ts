
import * as wjcGridFilter from "wijmo/wijmo.grid.filter";
import { FilterPanel } from "./FilterPanel";

import {Component, Input, Inject, ElementRef } from "@angular/core";

// Represents a panel shows currently active filters and allows users to remove filters by clicking.
@Component({
    selector: "wj-filter-panel",
    template: `<div></div>`
})
export class WjFilterPanelComponent extends FilterPanel {
    // grid filter
    @Input() filter: wjcGridFilter.FlexGridFilter;
    @Input() placeholder: string;

    constructor(@Inject(ElementRef) elRef: ElementRef) {
        super(elRef.nativeElement);
    }
};


