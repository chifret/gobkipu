import { Component, ViewChild, ElementRef } from '@angular/core';

import { Creature } from '../core/classes/creature';
import { Tresor } from '../core/classes/tresor';
import { Lieux } from '../core/classes/lieux';
import { Plante } from '../core/classes/plante';
import { ViewComponent } from './view.component';

@Component({
    selector: 'copypaste-view-component',
    templateUrl: './copypaste-view.component.html'
})
export class CopyPasteViewComponent {

    races = ["Nodef", "Musculeux", "Vis Yonnair", "Zozo Giste", "Trad Scion", "Mentalo"];
    processed = false;

    position: { posX: number, posY: number, posN: number, horiz: number, verti: number } = { posX: null, posY: null, posN: null, horiz: null, verti: null };
    creatures: Creature[] = [];
    tresors: Tresor[] = [];
    lieux: Lieux[] = [];
    plantes: Plante[] = [];

    @ViewChild("textarea") textarea: ElementRef;
    @ViewChild("viewComponent") viewComponent: ViewComponent;

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
        this.viewComponent.renderView(this.position, this.creatures, this.tresors, this.lieux, this.plantes);
        this.processed = true;
    }

    private parseCreature(line: string): void {
        try {
            const cols = line.split("\t").map(item => item.trim());
            const id = this.getNameAndNum(cols[2]);
            if (!id.num) {
                return;
            }
            this.creatures.push({
                dist: parseInt(cols[0]), level: parseInt(cols[3]), name: id.name, num: id.num, type: this.creatureIsGob(cols[4]), race: cols[4], clan: cols[5],
                posX: parseInt(cols[6]), posY: parseInt(cols[7]), posN: parseInt(cols[8])
            });
        } catch (e) {
            return null;
        }
    }

    private creatureIsGob(race: string): number {
        if (this.races.indexOf(race) >= 0) {
            return 1;
        }
        return 0;
    }

    private parseTresor(line: string): void {
        try {
            const cols = line.split("\t").map(item => item.trim());
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
            const cols = line.split("\t").map(item => item.trim());
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
            const cols = line.split("\t").map(item => item.trim());
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
