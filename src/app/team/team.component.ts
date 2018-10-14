import {Component, OnInit, ViewChild} from '@angular/core';

import {LoginService} from '../core/services/login.service';
import {MeuteService} from '../core/services/meute/meute.service';
import {ViewComponent} from '../view/view.component';
import {ViewService} from '../core/services/view/view.service';
import {ViewTyping} from '../core/typings/view.typings';
import {MeutemembresTyping} from "../core/typings/meutemembres.typings";
import {DlastateEnum} from "../core/enums/dlastate.enums";
import {combineLatest} from "rxjs/observable/combineLatest";

@Component({
	selector: 'team-component',
	templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {

	processed = false;
	busy = false;
	text = "Refresh";
	teamMembers: MeutemembresTyping[] = [];

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
		}
		else {
			this.view(this.lastId, true);
		}
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

	private getData(force: boolean): void {
		if (LoginService.isConnected()) {
			this.meuteService.get(force).subscribe((res) => {
				this.teamMembers = res;
			})
		}
	}
}
