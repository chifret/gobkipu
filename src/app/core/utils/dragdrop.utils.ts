"use strict";

export class DragDropUtils {

    static qeosFormat = "text";

    static setQeosMessage(e: DragEvent, data: any): void {
        e.dataTransfer.setData(DragDropUtils.qeosFormat, `subject:qeosDragDrop,data:application/json;${JSON.stringify(data)}`);
    }

    static getQeosMessage(e: DragEvent): JSON {
        try {
            const message = e.dataTransfer.getData(DragDropUtils.qeosFormat).substr(0, e.dataTransfer.getData(DragDropUtils.qeosFormat).indexOf(";")).split(",");
            if (message[0].split(":")[1] === "qeosDragDrop") {
                return JSON.parse(e.dataTransfer.getData(DragDropUtils.qeosFormat).substr(e.dataTransfer.getData(DragDropUtils.qeosFormat).indexOf(";") + 1));
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    /*static isQeos(e: DragEvent): boolean {
        try {
            if (e.dataTransfer.getData(DragDropUtils.qeosFormat).substr(0, e.dataTransfer.getData(DragDropUtils.qeosFormat).indexOf(";")).split(",")[0].split(":")[1] === "qeosDragDrop") {
                return true;
            }
        } catch (e) {
            return false;
        }
    }*/
}
