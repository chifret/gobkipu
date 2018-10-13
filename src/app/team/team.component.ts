import {Component, OnInit, ViewChild} from '@angular/core';

import {LoginService} from '../core/services/login.service';
import {MeuteService} from '../core/services/meute/meute.service';
import {ViewComponent} from '../view/view.component';
import {ViewService} from '../core/services/view/view.service';
import {ViewTyping} from '../core/typings/view.typings';
import {Creature} from '../core/classes/creature';
import {Tresor} from '../core/classes/tresor';
import {Lieux} from '../core/classes/lieux';
import {Plante} from '../core/classes/plante';
import {MeutemembresTyping} from "../core/typings/meutemembres.typings";
import {DlastateEnum} from "../core/enums/dlastate.enums";

@Component({
	selector: 'team-component',
	templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {

	races = ["Nodef", "Musculeux", "Vis Yonnair", "Zozo Giste", "Trad Scion", "Mentalo"];
	processed = false;

	teamMembers: MeutemembresTyping[] = [];
	viewItems: ViewTyping[];

	position: { posX: number, posY: number, posN: number, horiz: number, verti: number } = {posX: null, posY: null, posN: null, horiz: null, verti: null};
	creatures: Creature[] = [];
	gobelins: Creature[] = [];
	tresors: Tresor[] = [];
	lieux: Lieux[] = [];
	plantes: Plante[] = [];

	lastId: number = null;

	@ViewChild("viewComponent") viewComponent: ViewComponent;

	constructor(private loginService: LoginService,
	            private meuteService: MeuteService,
	            private viewService: ViewService) {
		this.getData(false);
	};

	ngOnInit(): void {
		this.update();
	}

	refresh() {
		this.getData(true);
	}

	view(id: number, force = false) {
		this.viewService.get(id, force).subscribe((res) => {
			this.viewItems = res;
			console.log(res);

			this.position = {posX: null, posY: null, posN: null, horiz: null, verti: null};
			this.creatures = [];
			this.gobelins = [];
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
							if (this.creatureIsGob(line.Type, line.Id)) {
								this.gobelins.push({
									dist: line.Dist, level: line.Niveau, name: line.Nom, num: line.Id, type: 1, race: line.Type, clan: line.Clan,
									posX: line.X, posY: line.Y, posN: line.N
								});
							}
							else {
								this.creatures.push({
									dist: line.Dist, level: line.Niveau, name: line.Nom, num: line.Id, type: 1, race: line.Type, clan: line.Clan,
									posX: line.X, posY: line.Y, posN: line.N
								});
							}
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

			this.viewComponent.renderView(this.position, this.creatures, this.gobelins, this.tresors, this.lieux, this.plantes);
			this.processed = true;

			this.lastId = id;
		});
	}

	refreshView() {
		this.view(this.lastId, true);
	}

	getDLAColor(dlaState: DlastateEnum): string {
		switch (dlaState) {
			case DlastateEnum.Usable:
				return 'green';
			case DlastateEnum.Urgent:
				return 'darkorange';
			case DlastateEnum.VeryUrgent:
				return 'darkred';
			case DlastateEnum.WaitForMidnight:
				return 'darblue';
			case DlastateEnum.ShouldDelayAtMidnight:
				return 'violet';
			default:
				return 'none';
		}
	}

	getPVColor(pv: number, pvMax: number): string {
		const pourcent = pv / pvMax * 100;
		if (pourcent >= 95) {
			return 'lawngreen';
		}
		if (pourcent >= 70) {
			return 'yellow';
		}
		if (pourcent >= 40) {
			return 'orange';
		} else {
			return 'red';
		}
	}

	private update() {
		if (this.teamMembers) {
			this.teamMembers = MeuteService.update(this.teamMembers);
		}
		setTimeout(() => {
			this.update()
		}, 30000);
	}

	private creatureIsGob(race: string, id: number): boolean {
		return id <= 14 || this.races.indexOf(race) >= 0;

	}

	private getData(force: boolean): void {
		if (LoginService.isConnected()) {
			this.meuteService.get(force).subscribe((res) => {
				this.teamMembers = res;
			})
		}
	}
}
