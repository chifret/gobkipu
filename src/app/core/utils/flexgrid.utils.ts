"use strict";

import { WjFlexGrid } from "wijmo/wijmo.angular2.grid";
import { HeadersVisibility, CellRange, CellRangeEventArgs, FormatItemEventArgs, DataMap, Column, Row, FormatItemEventArgs as GridFormatItemEventArgs } from "wijmo/wijmo.grid";
import { SortDescription } from "wijmo/wijmo";

import { WjFlexGridFilter } from "wijmo/wijmo.angular2.grid.filter";

export class FlexGridUtils {

    static init(grid: WjFlexGrid, showHeaderColumn: boolean = true, showHeaderRow: boolean = true): void {
        grid.showMarquee = false;
        grid.showAlternatingRows = true;
        if (showHeaderColumn && showHeaderRow) {
            grid.headersVisibility = HeadersVisibility.All;
        } else if (showHeaderColumn && !showHeaderRow) {
            grid.headersVisibility = HeadersVisibility.Column;
        } else if (!showHeaderColumn && showHeaderRow) {
            grid.headersVisibility = HeadersVisibility.Row;
        } else {
            grid.headersVisibility = HeadersVisibility.None;
        }
    }

    static autoResize(grid: WjFlexGrid): void {
        grid.autoSizeColumns();
    }

    static sort(grid: WjFlexGrid, field: string, asc: boolean = true): void {
        grid.collectionView.sortDescriptions.push(new SortDescription(field, asc));
    }

    static selectLineWithColumn(grid: WjFlexGrid, value: any, column: string): void {
        for (let i = 0; i < grid.collectionView.items.length; i++) {
            if (grid.collectionView.items[i][column] === value) {
                grid.select(new CellRange(i, 0, i, grid.columnHeaders.columns.length), true);
                break;
            }
        }
    }

    static getColumnsLength(grid: WjFlexGrid): number {
        return grid.columnHeaders.columns.length;
    }

    static getIdForValue(grid: WjFlexGrid, value: any, column: string): number {
        for (let i = 0; i < grid.collectionView.items.length; i++) {
            if (grid.collectionView.items[i][column] === value) {
                return i;
            }
        }
        return null;
    }

    static getItemForValue(grid: WjFlexGrid, value: any, column: string): any {
        for (let i = 0; i < grid.collectionView.items.length; i++) {
            if (grid.collectionView.items[i][column] === value) {
                return grid.collectionView.items[i];
            }
        }
        return null;
    }

    static getItemWithEvent(grid: WjFlexGrid, event: CellRangeEventArgs): any {
        return grid.rows[event.row].dataItem;
    }

    static getColumnBindingWithEvent(grid: WjFlexGrid, event: CellRangeEventArgs): string {
        return grid.columns[event.col].binding;
    }

    static getColumnBindingWithColumn(grid: WjFlexGrid, col: number): string {
        return grid.columns[col].binding;
    }

    static getColumnWithColumnBinding(grid: WjFlexGrid, binding: string): number {
        for (let i = 0; i < FlexGridUtils.getColumnsLength(grid); i++) {
            if (grid.columns[i].binding === binding) {
                return i;
            }
        }
        return null;
    }

    static toggleDropDownActiveEditingCell(grid: WjFlexGrid) {
        for (let i = 0; i < grid.activeEditor.parentElement.children.length; i++) {
            if (grid.activeEditor.parentElement.children[i].className === "wj-elem-dropdown") {
                const evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, +1, 0, 0, 0, 0,
                    false, false, false, false, 0, null);
                grid.activeEditor.parentElement.children[i].dispatchEvent(evt);
            }
        }
    }

    // try to center headers - brol // TODO - working badly
    static centerHeadersItemFormatter(grid: WjFlexGrid) {
        // alignement TODO : that sounds like a hack...
        // http://wijmo.com/5/docs/topic/wijmo.grid.GridPanel.Class.html#getCellElement
        // If the cell is not currently in view, this method returns null.

        // seems to be forgotten by the grid when loading appears and other events.  + was not efficient
        /*setTimeout(() => {
            for (let i = 0; i < grid.columns.length; i++) {
                if (grid.columnHeaders.getCellElement(0, i) !== null) {
                    grid.columnHeaders.getCellElement(0, i).style.textAlign = "center";
                }
            }
        }, 1000);*/

        // I don't like that solution because it crawl the table each time, but I can't find any other for now...
        grid.formatItem.addHandler((s, e: FormatItemEventArgs) => {
            if (e.row === 0 && e.cell.classList.contains("wj-header") && e.cell.innerHTML !== "") {
                e.cell.classList.add("overHeader");
            }
        });
    }

    // set datamap on filter in case of no datamap defined on column
    // when does it come that there is no datamap on column when needed ?
    // simple: when no datamap is wished into the fields.
    // for example, when an autocomplete field is defined into the cell edit mode
    static setDataMapOnFilter(grid: WjFlexGrid, filter: WjFlexGridFilter, dm: DataMap, binding: string) {
        const col = FlexGridUtils.getColumnWithColumnBinding(grid, binding);
        if (col) {
            filter.getColumnFilter(col).valueFilter.dataMap = dm;
        }
    }

    static isSortGroupCell(grid:WjFlexGrid, e: GridFormatItemEventArgs): boolean {
        return ((grid.rows[e.row] as Row) && (grid.rows[e.row] as Row).dataItem && (grid.rows[e.row] as Row).dataItem.groupDescription && !e.cell.classList.contains("wj-header") && e.cell.classList.contains("wj-group"));
    }

    static couldCellBeGroupCell(cell: HTMLElement): boolean {
        if (!cell) {
            return false;
        } else if (!cell.classList) {
            return false;
        }
        return (cell.classList.contains("wj-header") && cell.classList.contains("wj-group"));
    }
}
