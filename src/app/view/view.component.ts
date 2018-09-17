import { Component, ViewChild, ElementRef } from '@angular/core';

import { Creature } from '../core/classes/creature';
import { Tresor } from '../core/classes/tresor';
import { Lieux } from '../core/classes/lieux';
import { Plante } from '../core/classes/plante';

@Component({
    selector: 'view-component',
    templateUrl: './view.component.html'
})
export class ViewComponent {

    position: { posX: number, posY: number, posN: number, horiz: number, verti: number } = { posX: null, posY: null, posN: null, horiz: null, verti: null };
    scale = 1;
    processed = false;

    creatures: Creature[] = [];
    tresors: Tresor[] = [];
    lieux: Lieux[] = [];
    plantes: Plante[] = [];

    @ViewChild("table") table: ElementRef ;
    @ViewChild("tooltip") tooltip: ElementRef ;

    renderView(
        position: { posX: number, posY: number, posN: number, horiz: number, verti: number } = { posX: null, posY: null, posN: null, horiz: null, verti: null },
        creatures: Creature[],
        tresors: Tresor[],
        lieux: Lieux[],
        plantes: Plante[]) {

        this.position = position;
        this.creatures = creatures;
        this.tresors = tresors;
        this.lieux = lieux;
        this.plantes = plantes;
        (this.table.nativeElement as HTMLDivElement).innerHTML = "";
        (this.table.nativeElement as HTMLDivElement).style.transform = "scale(1)";
        (this.table.nativeElement as HTMLDivElement).style.width = "auto";
        (this.table.nativeElement as HTMLDivElement).style.height = "auto";

        for (let y = this.position.posY + this.position.horiz; y >= this.position.posY - this.position.horiz; y--) {
            let row = document.createElement("div") as HTMLDivElement;
            row.style.display = "table-row";
            row.style.width = "auto";
            (this.table.nativeElement as HTMLDivElement).appendChild(row);
            for (let x = this.position.posX - this.position.horiz; x <= this.position.posX + this.position.horiz; x++) {
                let cell = document.createElement("div") as HTMLDivElement;
                cell.style.cssFloat = "left";
                cell.style.display = "table-column";
                cell.style.border = "1px solid white";
                cell.style.width = "50px";
                //cell.style.width = (this.table.nativeElement as HTMLDivElement).offsetWidth / (2 * this.position.horiz + 1) + "px";
                //cell.style.width = 100 / (2 * this.position.horiz + 1) + "vw";
                cell.style.height = "50px";
                //cell.style.height = (this.table.nativeElement as HTMLDivElement).offsetWidth / (2 * this.position.horiz + 1) + "px";
                //cell.style.height = 100 / (2 * this.position.horiz + 1) + "vw";
                cell.style.position = "relative";
                cell.style.boxSizing = "border-box";
                if (x === this.position.posX && y === this.position.posY) {
                    cell.style.backgroundColor = "#666";
                }
                row.appendChild(cell);

                for (let k = 0; k < this.creatures.length; k++) {
                    if (this.creatures[k].posX == x && this.creatures[k].posY == y) {
                        let infoC = document.createElement("div") as HTMLDivElement;
                        infoC.style.position = "absolute";
                        infoC.style.top = "0";
                        infoC.style.width = "20px";
                        infoC.style.height = "20px";
                        if (this.creatures[k].type === 1) {
                            infoC.style.backgroundColor = "green";
                            infoC.style.left = "0";
                            infoC.addEventListener("mouseenter", (e: MouseEvent) => {
                                this.showGobInfo(e, x, y);
                            });
                        } else {
                            infoC.style.backgroundColor = "red";
                            infoC.style.right = "0";
                            infoC.addEventListener("mouseenter", (e: MouseEvent) => {
                                this.showMonsterInfo(e, x, y);
                            });
                        }
                        infoC.addEventListener("mouseleave", (e: MouseEvent) => {
                            this.hideInfo(e);
                        });
                        cell.appendChild(infoC);
                    }
                }

                for (let k = 0; k < this.tresors.length; k++) {
                    if (this.tresors[k].posX == x && this.tresors[k].posY == y) {
                        let infoC = document.createElement("div") as HTMLDivElement;
                        infoC.style.position = "absolute";
                        infoC.style.bottom = "0";
                        infoC.style.left = "0";
                        infoC.style.width = "20px";
                        infoC.style.height = "20px";
                        infoC.style.backgroundColor = "yellow";
                        infoC.addEventListener("mouseenter", (e: MouseEvent) => {
                            this.showTreasorsInfo(e, x, y);
                        });
                        infoC.addEventListener("mouseleave", (e: MouseEvent) => {
                            this.hideInfo(e);
                        });
                        cell.appendChild(infoC);
                    }
                }

                for (let k = 0; k < this.lieux.length; k++) {
                    if (this.lieux[k].posX == x && this.lieux[k].posY == y) {
                        cell.style.backgroundColor = "purple";
                        cell.addEventListener("mouseenter", (e: MouseEvent) => {
                            this.showLieuxInfo(e, x, y);
                        });
                        cell.addEventListener("mouseleave", (e: MouseEvent) => {
                            this.hideInfo(e);
                        });
                    }
                }
            }
        }


        const viewWidth = this.position.horiz * 2 + 1;
        if (viewWidth * 50 > (this.table.nativeElement as HTMLDivElement).clientWidth) {
            (this.table.nativeElement as HTMLDivElement).style.transform = "scale(" + (this.table.nativeElement as HTMLDivElement).clientWidth / (viewWidth * 50) + ")";
            (this.table.nativeElement as HTMLDivElement).parentElement.style.height = (viewWidth * 50) * ((this.table.nativeElement as HTMLDivElement).clientWidth / (viewWidth * 50)) + "px";
        } else {
            (this.table.nativeElement as HTMLDivElement).style.transform = "scale(1))";
            (this.table.nativeElement as HTMLDivElement).parentElement.style.height = viewWidth * 50 + "px";
        }
        (this.table.nativeElement as HTMLDivElement).style.width = viewWidth * 50 + "px";
        (this.table.nativeElement as HTMLDivElement).style.height = viewWidth * 50 + "px";

        this.processed = true;
    }

    showGobInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.creatures.length; k++) {
            if (this.creatures[k].posX == x && this.creatures[k].posY == y && this.creatures[k].type === 1) {
                txt += "(" + this.creatures[k].num + ") " + this.creatures[k].name + " " + this.creatures[k].posX + "/" + this.creatures[k].posY + "/" + this.creatures[k].posN + "<br/>";
            }
        }
        (this.tooltip.nativeElement as HTMLDivElement).innerHTML = txt;
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "";
        (this.tooltip.nativeElement as HTMLDivElement).style.top = (e.pageY + 25) + "px";
        (this.tooltip.nativeElement as HTMLDivElement).style.left = (e.pageX + 25) + "px";
        console.log(e);
    }

    showMonsterInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.creatures.length; k++) {
            if (this.creatures[k].posX == x && this.creatures[k].posY == y && this.creatures[k].type === 0) {
                txt += "(" + this.creatures[k].num + ") " + this.creatures[k].name + " " + this.creatures[k].posX + "/" + this.creatures[k].posY + "/" + this.creatures[k].posN + "<br/>";
            }
        }
        (this.tooltip.nativeElement as HTMLDivElement).innerHTML = txt;
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "";
        (this.tooltip.nativeElement as HTMLDivElement).style.top = (e.pageY + 25) + "px";
        (this.tooltip.nativeElement as HTMLDivElement).style.left = (e.pageX + 25) + "px";
    }

    showTreasorsInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.tresors.length; k++) {
            if (this.tresors[k].posX == x && this.tresors[k].posY == y) {
                txt += "(" + this.tresors[k].num + ") " + this.tresors[k].name + " " + this.tresors[k].posX + "/" + this.tresors[k].posY + "/" + this.tresors[k].posN + "<br/>";
            }
        }
        (this.tooltip.nativeElement as HTMLDivElement).innerHTML = txt;
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "";
        (this.tooltip.nativeElement as HTMLDivElement).style.top = (e.pageY + 25) + "px";
        (this.tooltip.nativeElement as HTMLDivElement).style.left = (e.pageX + 25) + "px";
    }

    showLieuxInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.lieux.length; k++) {
            if (this.lieux[k].posX == x && this.lieux[k].posY == y) {
                txt += "(" + this.lieux[k].num + ") " + this.lieux[k].name + " " + this.lieux[k].posX + "/" + this.lieux[k].posY + "/" + this.lieux[k].posN + "<br/>";
            }
        }
        (this.tooltip.nativeElement as HTMLDivElement).innerHTML = txt;
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "";
        (this.tooltip.nativeElement as HTMLDivElement).style.top = (e.pageY + 25) + "px";
        (this.tooltip.nativeElement as HTMLDivElement).style.left = (e.pageX + 25) + "px";
    }

    hideInfo(e: MouseEvent): void {
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "none";
    }
}
