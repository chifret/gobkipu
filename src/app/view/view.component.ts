import { Component, Injector, ViewChild, ElementRef } from '@angular/core';

import { Position } from './../core/classes/position';
import { DistanceUtils } from '../core/utils/business/distance-utils';

@Component({
    selector: 'app-root',
    templateUrl: './view.component.html'
})
export class ViewComponent {

    position: { posX: number, posY: number, posN: number, horiz: number, verti: number } = { posX: null, posY: null, posN: null, horiz: null, verti: null };

    processed = false;

    creatures: { dist: number, level: number, name: string, num: number, race: string, clan: string, posX: number, posY: number, posN: number }[] = [];
    tresors: { dist: number, name: string, num: number, posX: number, posY: number, posN: number }[] = [];
    lieux: { dist: number, name: string, num: number, type: string, posX: number, posY: number, posN: number }[] = [];
    plantes: { dist: number, name: string, num: number, posX: number, posY: number, posN: number }[] = [];

    @ViewChild("textarea") textarea: ElementRef ;
    @ViewChild("table") table: ElementRef ;
    @ViewChild("tooltip") tooltip: ElementRef ;

    view(): void {
        const lines = (this.textarea.nativeElement as HTMLTextAreaElement).value
            // todo dev
            .replace(/Ã©/g, "é")
            .replace(/Ã/g, "à")
            .split('\n');

        let current: string = null;
        lines.forEach(line => {
            // todo dev
            line = line.trim();
            let goOn = true;
            if (line.indexOf("Créatures | Trésors | Lieux/Décors | Plantes") > 5) {
                current = line.substr(0, line.indexOf("\t")).trim();
                goOn = false;
            }
            if (goOn) {
                switch (current) {
                    case null:
                        if (line.indexOf("Ma position actuelle est ") > -1) {
                            line = line.substr(31, line.length);
                            this.position.posX = parseInt(line.substr(0, line.indexOf(",")));
                            line = line.substr(line.indexOf(",") + 6, line.length);
                            this.position.posY = parseInt(line.substr(0, line.indexOf(",")));
                            line = line.substr(line.indexOf(",") + 6, line.length);
                            this.position.posN = parseInt(line.substr(0, line.length));
                        } else if (line.indexOf("L'affichage est limité à ") > -1) {
                            line = line.substr(25, line.length);
                            this.position.horiz = parseInt(line.substr(0, line.indexOf("cases horizontalement") - 1));
                            this.position.verti = parseInt(line.substr(line.indexOf("cases horizontalement") + 24, line.indexOf("verticalement") - 28));
                        }
                        break;
                    case "Créatures":
                        this.parseCreature(line);
                        break;
                    case "Trésors":
                        this.parseTresor(line);
                        break;
                    case "Lieux/Décors":
                        this.parseLieux(line);
                        break;
                    case "Plantes":
                        this.parsePlantes(line);
                        break;
                }
            }

        });
        this.processed = true;

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
                cell.style.position = "relative";
                cell.style.height = "50px";
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
                        if (this.creatureIsGob(this.creatures[k])) {
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
    }

    showGobInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.creatures.length; k++) {
            if (this.creatures[k].posX == x && this.creatures[k].posY == y && this.creatureIsGob(this.creatures[k])) {
                txt += "(" + this.creatures[k].num + ") " + this.creatures[k].name + " " + this.creatures[k].posX + "/" + this.creatures[k].posY + "/" + this.creatures[k].posN + "<br/>";
            }
        }
        (this.tooltip.nativeElement as HTMLDivElement).innerHTML = txt;
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "";
        (this.tooltip.nativeElement as HTMLDivElement).style.top = (e.y + 25) + "px";
        (this.tooltip.nativeElement as HTMLDivElement).style.left = (e.x + 25) + "px";
    }

    showMonsterInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.creatures.length; k++) {
            if (this.creatures[k].posX == x && this.creatures[k].posY == y && !this.creatureIsGob(this.creatures[k])) {
                txt += "(" + this.creatures[k].num + ") " + this.creatures[k].name + " " + this.creatures[k].posX + "/" + this.creatures[k].posY + "/" + this.creatures[k].posN + "<br/>";
            }
        }
        (this.tooltip.nativeElement as HTMLDivElement).innerHTML = txt;
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "";
        (this.tooltip.nativeElement as HTMLDivElement).style.top = (e.y + 25) + "px";
        (this.tooltip.nativeElement as HTMLDivElement).style.left = (e.x + 25) + "px";
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
        (this.tooltip.nativeElement as HTMLDivElement).style.top = (e.y + 25) + "px";
        (this.tooltip.nativeElement as HTMLDivElement).style.left = (e.x + 25) + "px";
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
        (this.tooltip.nativeElement as HTMLDivElement).style.top = (e.y + 25) + "px";
        (this.tooltip.nativeElement as HTMLDivElement).style.left = (e.x + 25) + "px";
    }

    hideInfo(e: MouseEvent): void {
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "none";
    }

    private parseCreature(line: string): void {
        try {
            const cols = line.split("\t");
            const id = this.getNameAndNum(cols[2]);
            if (!id.num) {
                return;
            }
            this.creatures.push({
                dist: parseInt(cols[0]), level: parseInt(cols[3]), name: id.name, num: id.num, race: cols[4], clan: cols[5],
                posX: parseInt(cols[6]), posY: parseInt(cols[7]), posN: parseInt(cols[8])
            });
        } catch (e) {
            return null;
        }
    }

    private creatureIsGob(creature: { dist: number, level: number, name: string, num: number, race: string, clan: string, posX: number, posY: number, posN: number }): boolean {
        if (creature.race === "Nodef"
        ) {
            return true;
        }
        return false;
    }

    private parseTresor(line: string): void {
        try {
            const cols = line.split("\t");
            if (!parseInt(cols[1])) {
                return;
            }
            this.tresors.push({
                dist: parseInt(cols[0]), name: cols[2], num: parseInt(cols[1]),
                posX: parseInt(cols[3]), posY: parseInt(cols[4]), posN: parseInt(cols[5])
            });
        } catch (e) {
            return null;
        }
    }

    private parseLieux(line: string): void {
        try {
            const cols = line.split("\t");
            if (!parseInt(cols[1])) {
                return;
            }
            this.lieux.push({
                dist: parseInt(cols[0]), name: cols[2], num: parseInt(cols[1]), type: cols[3],
                posX: parseInt(cols[4]), posY: parseInt(cols[5]), posN: parseInt(cols[6])
            });
        } catch (e) {
            return null;
        }
    }

    private parsePlantes(line: string): void {
        try {
            const cols = line.split("\t");
            if (!parseInt(cols[1])) {
                return;
            }
            this.plantes.push({
                dist: parseInt(cols[0]), name: cols[2], num: parseInt(cols[1]),
                posX: parseInt(cols[3]), posY: parseInt(cols[4]), posN: parseInt(cols[5])
            });
        } catch (e) {
            return null;
        }
    }

    private getNameAndNum(str: string): { name: string, num: number } {
        try {
            const line = str.lastIndexOf("(") + 1;
            return { name: str.substr(0, line - 2), num: parseInt(str.substr(line, str.lastIndexOf(")") - line)) };
        } catch (e) {
            return null;
        }
    }
}
