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
    gobelins: Creature[] = [];
    tresors: Tresor[] = [];
    lieux: Lieux[] = [];
    plantes: Plante[] = [];

    values: { type: string, value: number }[] = [
        { type: "Parchemin", value: 5 },
        { type: "Outil", value: 4 },
        { type: "Nourriture", value: 4 },
        { type: "Anneau", value: 4 },
        { type: "Bijou", value: 4 },
        { type: "CT", value: 1 },
        { type: "Potion", value: 1 },
        { type: "Talisman", value: 1 },
        { type: "Casque", value: 1 },
        { type: "Armure", value: 3 },
        { type: "Bottes", value: 3 },
        { type: "Baguette", value: 3 },
        { type: "Bouclier", value: 3 },
        { type: "Arme 1 Main", value: 3 },
        { type: "Arme 2 mains", value: 3 },
    ];

    followers: string[] = ["Créature mécanique", "CrÃ©ature mÃ©canique", "Arme dansante", "Pixie"];

    @ViewChild("table") table: ElementRef ;
    @ViewChild("tooltip") tooltip: ElementRef ;

    renderView(
        position: { posX: number, posY: number, posN: number, horiz: number, verti: number } = { posX: null, posY: null, posN: null, horiz: null, verti: null },
        creatures: Creature[],
        gobelins: Creature[],
        tresors: Tresor[],
        lieux: Lieux[],
        plantes: Plante[]) {

        this.position = position;
        this.creatures = creatures;
        this.gobelins = gobelins;
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
                cell.style.border = "1px solid #aaa";
                cell.style.width = "50px";
                cell.style.height = "50px";
                cell.style.position = "relative";
                cell.style.boxSizing = "border-box";
                if (x === this.position.posX && y === this.position.posY) {
                    cell.style.border = "1px solid white";
                    cell.style.boxShadow = "0px 0px 15px white";
                }
                row.appendChild(cell);

                // ------------------------------------------- créatures -------------------------------------------
                let infoC: HTMLDivElement = null;
                let minDist: number = null;
                let hasFollower = false;
                let hasMonster = false;
                if (x == 34 && y == 86) {
                    console.log("ICI");
                }
                for (let k = 0; k < this.creatures.length; k++) {
                    if (this.creatures[k].posX == x && this.creatures[k].posY == y) {
                        const diffLevel = Math.abs(this.position.posN - this.creatures[k].posN);
                        if (this.followers.indexOf(creatures[k].race) > -1) {
                            hasFollower = true;
                        } else {
                            hasMonster = true;
                        }
                        if (minDist === null || minDist > diffLevel) {
                            minDist = diffLevel;
                        }
                        if (!infoC) {
                            infoC = document.createElement("div") as HTMLDivElement;
                            infoC.style.position = "absolute";
                            infoC.style.top = "0";
                            infoC.style.right = "0";
                            infoC.addEventListener("mouseenter", (e: MouseEvent) => {
                                this.showMonsterInfo(e, x, y);
                            });
                            infoC.addEventListener("mouseleave", (e: MouseEvent) => {
                                this.hideInfo(e);
                            });
                        }
                    }
                }
                if (infoC) {
                    let lang: number = this.setCellDist(infoC, minDist);
                    if (hasMonster) {
                        if (hasFollower) {
                            lang = Math.sqrt(2 * (lang * lang)) / 2;
                            infoC.style.background = "repeating-linear-gradient(45deg, red, red " + lang + "px, aquamarine " + lang + "px, aquamarine " + 2 * lang + "px)";
                        } else {
                            infoC.style.backgroundColor = "red";
                        }
                    } else {
                        infoC.style.backgroundColor = "aquamarine";
                    }
                    cell.appendChild(infoC);
                }

                // ------------------------------------------- gobelins -------------------------------------------
                infoC = null;
                minDist = null;
                for (let k = 0; k < this.gobelins.length; k++) {
                    if (this.gobelins[k].posX == x && this.gobelins[k].posY == y) {
                        const diffLevel = Math.abs(this.position.posN - this.gobelins[k].posN);
                        if (minDist === null || minDist > diffLevel) {
                            minDist = diffLevel;
                        }
                        if (!infoC) {
                            infoC = document.createElement("div") as HTMLDivElement;
                            infoC.style.position = "absolute";
                            infoC.style.top = "0";
                            infoC.style.backgroundColor = "greenyellow";
                            infoC.style.left = "0";
                            infoC.addEventListener("mouseenter", (e: MouseEvent) => {
                                this.showGobInfo(e, x, y);
                            });
                            infoC.addEventListener("mouseleave", (e: MouseEvent) => {
                                this.hideInfo(e);
                            });
                        }
                    }
                }
                if (infoC) {
                    this.setCellDist(infoC, minDist);
                    cell.appendChild(infoC);
                }

                // ------------------------------------------- trésors -------------------------------------------
                infoC = null;
                minDist = null;
                let maxValue: number = 0;
                for (let k = 0; k < this.tresors.length; k++) {
                    if (this.tresors[k].posX == x && this.tresors[k].posY == y) {
                        const diffLevel = Math.abs(this.position.posN - this.tresors[k].posN);
                        if (minDist === null || minDist > diffLevel) {
                            minDist = diffLevel;
                        }
                        let itemValue = 2;
                        for (let v = 0; v < this.values.length; v++) {
                            if (tresors[k].name === this.values[v].type) {
                                itemValue = this.values[v].value;
                                break;
                            }
                        }
                        if (itemValue === 2) {
                            console.log(tresors[k].name);
                        }
                        if (!maxValue || maxValue < itemValue) {
                            maxValue = itemValue;
                        }
                        if (!infoC) {
                            infoC = document.createElement("div") as HTMLDivElement;
                            infoC.style.position = "absolute";
                            infoC.style.bottom = "0";
                            infoC.style.left = "0";
                            infoC.addEventListener("mouseenter", (e: MouseEvent) => {
                                this.showTreasorsInfo(e, x, y);
                            });
                            infoC.addEventListener("mouseleave", (e: MouseEvent) => {
                                this.hideInfo(e);
                            });
                        }
                    }
                }
                if (infoC) {
                    this.setCellDist(infoC, minDist);
                    switch (maxValue) {
                        case 1:
                            infoC.style.backgroundColor = "#a98600";
                            break;
                        case 2:
                            infoC.style.backgroundColor = "#dab600";
                            break;
                        case 3:
                            infoC.style.backgroundColor = "#e9d700";
                            break;
                        case 4:
                            infoC.style.backgroundColor = "#f8ed62";
                            infoC.style.boxShadow = "0px 0px 15px #fff9ae";
                            break;
                        case 5:
                            infoC.style.backgroundColor = "#fff9ae";
                            infoC.style.boxShadow = "0px 0px 40px white";
                            break;
                    }
                    cell.appendChild(infoC);
                }

                // ------------------------------------------- plantes -------------------------------------------
                infoC = null;
                minDist = null;
                for (let k = 0; k < this.plantes.length; k++) {
                    if (this.plantes[k].posX == x && this.plantes[k].posY == y) {
                        const diffLevel = Math.abs(this.position.posN - this.plantes[k].posN);
                        if (minDist === null || minDist > diffLevel) {
                            minDist = diffLevel;
                        }
                        if (!infoC) {
                            infoC = document.createElement("div") as HTMLDivElement;
                            infoC.style.position = "absolute";
                            infoC.style.bottom = "0";
                            infoC.style.backgroundColor = "green";
                            infoC.style.right = "0";
                            infoC.addEventListener("mouseenter", (e: MouseEvent) => {
                                this.showGobInfo(e, x, y);
                            });
                            infoC.addEventListener("mouseleave", (e: MouseEvent) => {
                                this.hideInfo(e);
                            });
                        }
                    }
                }
                if (infoC) {
                    this.setCellDist(infoC, minDist);
                    cell.appendChild(infoC);
                }

                // ------------------------------------------- lieux -------------------------------------------
                let color: string = null;
                for (let k = 0; k < this.lieux.length; k++) {
                    if (this.lieux[k].posX == x && this.lieux[k].posY == y) {
                        if (this.lieux[k].name === "Arbre" && !color) {
                            color = "green";
                        } else {
                            color = "purple";
                        }
                    }
                }
                if (color) {
                    cell.style.backgroundColor = color;
                    cell.addEventListener("mouseenter", (e: MouseEvent) => {
                        this.showLieuxInfo(e, x, y);
                    });
                    cell.addEventListener("mouseleave", (e: MouseEvent) => {
                        this.hideInfo(e);
                    });
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

    private setCellDist(cell: HTMLDivElement, minDist: number): number {
        minDist = 20 - (Math.min(4, Math.max(0, minDist - 3)) * 2);
        cell.style.width = minDist + "px";
        cell.style.height = minDist + "px";
        return minDist;
    }

    showGobInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.gobelins.length; k++) {
            if (this.gobelins[k].posX == x && this.gobelins[k].posY == y) {
                txt += "(" + this.gobelins[k].num + ") " + this.gobelins[k].name + " [" + this.gobelins[k].level + "] " + this.gobelins[k].posX + "/" + this.gobelins[k].posY + "/" + this.gobelins[k].posN + "<br/>";
            }
        }
        this.setTooltip(e, txt);
    }

    showMonsterInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.creatures.length; k++) {
            if (this.creatures[k].posX == x && this.creatures[k].posY == y) {
                txt += "(" + this.creatures[k].num + ") " + this.creatures[k].name + " [" + this.creatures[k].level + "] " + this.creatures[k].posX + "/" + this.creatures[k].posY + "/" + this.creatures[k].posN + "<br/>";
            }
        }
        this.setTooltip(e, txt);
    }

    showTreasorsInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.tresors.length; k++) {
            if (this.tresors[k].posX == x && this.tresors[k].posY == y) {
                txt += "(" + this.tresors[k].num + ") " + this.tresors[k].name + " " + this.tresors[k].posX + "/" + this.tresors[k].posY + "/" + this.tresors[k].posN + "<br/>";
            }
        }
        this.setTooltip(e, txt);
    }

    showPlantsInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.plantes.length; k++) {
            if (this.plantes[k].posX == x && this.plantes[k].posY == y) {
                txt += "(" + this.plantes[k].num + ") " + this.plantes[k].name + " " + this.plantes[k].posX + "/" + this.plantes[k].posY + "/" + this.plantes[k].posN + "<br/>";
            }
        }
        this.setTooltip(e, txt);
    }

    showLieuxInfo(e: MouseEvent, x: number, y: number): void {
        let txt = "";
        for (let k = 0; k < this.lieux.length; k++) {
            if (this.lieux[k].posX == x && this.lieux[k].posY == y) {
                txt += "(" + this.lieux[k].num + ") " + this.lieux[k].name + " " + this.lieux[k].posX + "/" + this.lieux[k].posY + "/" + this.lieux[k].posN + "<br/>";
            }
        }
        this.setTooltip(e, txt);
    }

    hideInfo(e: MouseEvent): void {
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "none";
    }

    private setTooltip(e: MouseEvent, txt: string): void {
        (this.tooltip.nativeElement as HTMLDivElement).innerHTML = txt;
        (this.tooltip.nativeElement as HTMLDivElement).style.display = "";
        (this.tooltip.nativeElement as HTMLDivElement).style.top = (e.pageY + 25) + "px";
        (this.tooltip.nativeElement as HTMLDivElement).style.left = (e.pageX + 25) + "px";
    }
}
