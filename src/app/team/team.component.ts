import {Component, OnInit, ViewChild} from '@angular/core';

import {LoginService} from '../core/services/login.service';
import {MeuteService} from '../core/services/meute/meute.service';
import {ViewComponent} from '../view/view.component';
import {ViewService} from '../core/services/view/view.service';
import {ViewTyping} from '../core/typings/view.typings';
import {GobsTypings} from "../core/typings/gobs.typings";
import {combineLatest} from "rxjs/observable/combineLatest";
import {PastateEnum} from "../core/enums/pastate.enum";
import {DlastateEnum} from "../core/enums/dlastate.enum";

@Component({
	selector: 'team-component',
	templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {

	processed = false;
	busy = false;
	text = "Refresh";
	teamMembers: GobsTypings[] = [];

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
			this.viewComponent.renderView(this.viewService.getViewable(res));
			this.processed = true;
			this.lastId = id;
		});
	}

	// could not do it in service...
	viewAll(force = false) {
		let meuteView: ViewTyping[] = [];
		this.meuteService.get()
			.subscribe((meuteMembres) => {
				let test = [];
				meuteMembres.forEach((meuteMembre) => {
					test.push(this.viewService.get(meuteMembre.Id, force));
				});
				combineLatest(...test)
					.subscribe((results: ViewTyping[][]) => {
						results.forEach((result: ViewTyping[]) => {
							meuteView.push(...result);
						});
					});
			});
		console.log(meuteView);
		this.viewComponent.renderView(this.viewService.getViewable(meuteView));
		this.processed = true;
		this.lastId = -1;
	}

	refreshView() {
		if (this.lastId === -1) {
			this.viewAll(true);
		} else {
			this.view(this.lastId, true);
		}
	}

	getPAColor(state: PastateEnum): string {
		switch (state) {
			case PastateEnum.Usable:
				return 'green';
			case PastateEnum.Urgent:
			case PastateEnum.CumulableUrgent:
				return 'darkorange';
			case PastateEnum.VeryUrgent:
			case PastateEnum.CumulableVeryUrgent:
				return 'darkred';
			case PastateEnum.Cumulable:
				return 'darkkhaki';
			case PastateEnum.Unusable:
				return 'black';
			default:
				return 'none';
		}
	}

	getDLAColor(state: DlastateEnum): string {
		switch (state) {
			case DlastateEnum.Shortened:
				return 'yellow';
			case DlastateEnum.ShouldDelayAtMidnight:
				return 'magenta';
			case DlastateEnum.WaitForMidnight:
				return 'lightblue';
			case DlastateEnum.ShouldActivateBeforeMidnight:
				return 'green';
			default:
				return 'none';
		}
	}

	getPVColor(pv: number, pvMax: number): string {
		const pourcent = pv / pvMax * 100;
		if (pourcent >= 95) {
			return 'lawngreen';
		} else if (pourcent >= 70) {
			return 'yellow';
		} else if (pourcent >= 40) {
			return 'orange';
		} else {
			return 'red';
		}
	}

	getHungerColor(hunger: number): string {
		if (hunger == 0) {
			return "#333";
		} else if (hunger <= 15) {
			return "rebeccapurple";
		} else if (hunger <= 20) {
			return "purple";
		} else if (hunger <= 25) {
			return "pink";
		} else {
			return "deeppink";
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

	private getData(force: boolean): void {
		if (LoginService.isConnected()) {
			this.meuteService.get(force).subscribe((res) => {
				this.teamMembers = res;
			})
		}
	}
}
