import { Component, ViewChild } from '@angular/core';

import { LoginService } from '../core/services/login.service';
import { MeuteService } from '../core/services/meute/meute.service';
import { ViewComponent } from '../view/view.component';
import { ViewService } from '../core/services/view/view.service';
import { ViewTyping } from '../core/typings/view.typings';
import { Creature } from '../core/classes/creature';
import { Tresor } from '../core/classes/tresor';
import { Lieux } from '../core/classes/lieux';
import { Plante } from '../core/classes/plante';

@Component({
    selector: 'team-component',
    templateUrl: './team.component.html'
})
export class TeamComponent {

    races = ["Nodef", "Musculeux", "Vis Yonnair", "Zozo Giste", "Trad Scion", "Mentalo"];
    processed = false;

    token: { id: number, clan: string, meute: string } = null;

    teamMembers = null;
    viewItems: ViewTyping[];

    position: { posX: number, posY: number, posN: number, horiz: number, verti: number } = { posX: null, posY: null, posN: null, horiz: null, verti: null };
    creatures: Creature[] = [];
    tresors: Tresor[] = [];
    lieux: Lieux[] = [];
    plantes: Plante[] = [];

    lastId: number = null;

    @ViewChild("viewComponent") viewComponent: ViewComponent;

    constructor(private loginService: LoginService,
        private meuteService: MeuteService,
        private viewService: ViewService) {
        if (this.loginService.isConnected()) {
            this.meuteService.get().subscribe((res) => {
                this.teamMembers = res;
                console.log(res);
            })
        }
    };

    refresh() {
        this.meuteService.get(true).subscribe((res) => {
            this.teamMembers = res;
            console.log(res);
        })
    }

    view(id: number, force = false) {
        this.viewService.get(id, force).subscribe((res) => {
            this.viewItems = res;
            console.log(res);

            this.position = { posX: null, posY: null, posN: null, horiz: null, verti: null };
            this.creatures = [];
            this.tresors = [];
            this.lieux = [];
            this.plantes = [];

            let maxDist = 0;
            this.viewItems.forEach(line => {
                if (line.Dist > maxDist) {
                    maxDist = line.Dist;
                }
                switch (line.Categorie) {
                    case "C":
                        if (line.Dist == -1) {
                            this.position.posX = line.X;
                            this.position.posY = line.Y;
                            this.position.posN = line.N;
                        } else {
                            this.creatures.push({
                                dist: line.Dist, level: line.Niveau, name: line.Nom, num: line.Id, type: this.creatureIsGob(line.Type), race: line.Type, clan: line.Clan,
                                posX: line.X, posY: line.Y, posN: line.N
                            });
                        }
                        break;
                    case "T":
                        this.tresors.push({
                            dist: line.Dist, name: line.Nom, num: line.Id, posX: line.X, posY: line.Y, posN: line.N
                        });
                        break;
                    case "L":
                        this.lieux.push({
                            dist: line.Dist, name: line.Nom, num: line.Id, type: line.Type, posX: line.X, posY: line.Y, posN: line.N
                        });
                        break;
                    case "P":
                        this.plantes.push({
                            dist: line.Dist, name: line.Nom, num: line.Id, posX: line.X, posY: line.Y, posN: line.N
                        });
                        break;
                }
            });
            this.position.horiz = maxDist;
            this.position.verti = maxDist;

            this.viewComponent.renderView(this.position, this.creatures, this.tresors, this.lieux, this.plantes);
            this.processed = true;

            this.lastId = id;
        });
    }

    refreshView() {
        this.view(this.lastId, true);
    }

    private creatureIsGob(race: string): number {
        if (this.races.indexOf(race) >= 0) {
            return 1;
        }
        return 0;
    }
}
