import {Component, OnInit, ViewChild} from "@angular/core";

import {LoginService} from "../core/services/login.service";
import {TeamService} from "app/core/services/meute/team.service";
import {ViewComponent} from "../core/components/view/view.component";
import {ViewService} from "../core/services/view/view.service";
import {ViewTyping} from "../core/typings/view.typings";
import {GobsTypings} from "../core/typings/gobs.typings";
import {combineLatest} from "rxjs/observable/combineLatest";
import {PastateEnum} from "../core/enums/pastate.enum";
import {DlastateEnum} from "../core/enums/dlastate.enum";
import {DatePipe} from "@angular/common";

@Component({
	selector: "team-component",
	templateUrl: "./team.component.html"
})
export class TeamComponent implements OnInit {

	processed = false;
	busy = false;
	text = "Refresh";
	gobs: GobsTypings[] = [];
	lastId: number = null;

	@ViewChild("viewComponent", {static: true}) viewComponent: ViewComponent;

	constructor(private loginService: LoginService,
				private meuteService: TeamService,
				private datePipe: DatePipe,
				private viewService: ViewService) {
		this.getData(false);
	}

	ngOnInit(): void {
		this.update();
	}

	refresh() {
		this.getData(true);
	}

	view(id: number, force = false) {
		this.viewService.get(id, force).subscribe((res) => {
			const viewable = this.viewService.getViewable(res);

			let viewerLevel = 0;
			const viewerSearches = ["Bulette"];
			const viewerAllies: number[] = [];
			this.gobs.forEach(gob => {
				viewerAllies.push(gob.Id);
				viewerLevel += gob.Niveau;
			});
			viewerLevel = Math.round(viewerLevel / this.gobs.length) + Math.floor(this.gobs.length / 2);

			viewable.viewerLevel = viewerLevel;
			viewable.viewerAllies = viewerAllies;
			viewable.viewerSearches = viewerSearches;

			this.viewComponent.renderView(viewable);

			this.processed = true;
			this.lastId = id;
		});
	}

	// could not do it in service...
	viewAll(force = false) {
		const meuteView: ViewTyping[] = [];
		this.meuteService.get()
			.subscribe((meuteMembres) => {
				const test = [];
				meuteMembres.forEach((meuteMembre) => {
					test.push(this.viewService.get(meuteMembre.Id, force));
				});
				combineLatest(test)
					.subscribe((results: ViewTyping[][]) => {
						results.forEach((result: ViewTyping[]) => {
							meuteView.push(...result);
						});
					});
			});
		const viewable = this.viewService.getViewable(meuteView);

		let viewerLevel = 0;
		const viewerSearches = ["Bulette"];
		const viewerAllies: number[] = [];
		this.gobs.forEach(teamMember => {
			viewerAllies.push(teamMember.Id);
			viewerLevel += teamMember.Niveau;
		});
		viewerLevel = Math.round(viewerLevel / this.gobs.length) + Math.floor(this.gobs.length / 2);

		viewable.viewerLevel = viewerLevel;
		viewable.viewerAllies = viewerAllies;
		viewable.viewerSearches = viewerSearches;

		this.viewComponent.renderView(viewable);

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
				return "green";
			case PastateEnum.Urgent:
			case PastateEnum.CumulableUrgent:
				return "darkorange";
			case PastateEnum.VeryUrgent:
			case PastateEnum.CumulableVeryUrgent:
				return "darkred";
			case PastateEnum.Cumulable:
				return "darkkhaki";
			case PastateEnum.Unusable:
				return "black";
			default:
				return "none";
		}
	}

	getDLAColor(state: DlastateEnum): string {
		switch (state) {
			case DlastateEnum.Shortened:
				return "yellow";
			case DlastateEnum.ShouldDelayAtMidnight:
				return "magenta";
			case DlastateEnum.WaitForMidnight:
				return "lightblue";
			case DlastateEnum.ShouldActivateBeforeMidnight:
				return "green";
			default:
				return "none";
		}
	}

	getPVColor(pv: number, pvMax: number): string {
		const pourcent = pv / pvMax * 100;
		if (pourcent >= 95) {
			return "lawngreen";
		} else if (pourcent >= 70) {
			return "yellow";
		} else if (pourcent >= 40) {
			return "orange";
		} else {
			return "red";
		}
	}

	getHungerColor(hunger: number): string {
		if (hunger === 0) {
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

	showDetails(gob: GobsTypings): void {
		gob.showDetails = !gob.showDetails;
	}

	getDateFromSeconds(seconds: number): string {
		let moreThanADay = false;
		if (seconds >= 86400) {
			seconds -= 86400;
			moreThanADay = true;
		}
		let sign = true;
		if (seconds < 0) {
			seconds = -seconds;
			sign = false;
		}
		const date = new Date(1970, 0, 1);
		date.setSeconds(seconds);

		return (!sign ? "-" : "") + (moreThanADay ? this.datePipe.transform(date, "HH:mm:ss") + "j " : "") + this.datePipe.transform(date, "HH:mm:ss");
	}

	getTotalDateFromSeconds(dla: number, matos: number, bonus: number): string {
		let moreThanADay = false;

		let seconds = dla + Math.max(0, matos + bonus);
		if (seconds >= 86400) {
			seconds -= 86400;
			moreThanADay = true;
		}
		let sign = true;
		if (seconds < 0) {
			seconds = -seconds;
			sign = false;
		}
		const date = new Date(1970, 0, 1);
		date.setSeconds(seconds);

		return (!sign ? "-" : "") + (moreThanADay ? this.datePipe.transform(date, "HH:mm:ss") + "j " : "") + this.datePipe.transform(date, "HH:mm:ss");
	}

	private update() {
		if (this.gobs) {
			this.gobs = TeamService.update(this.gobs);
		}
		setTimeout(() => {
			this.update();
		}, 30000);
	}

	private getData(force: boolean): void {
		if (LoginService.isConnected()) {
			this.meuteService.get(force).subscribe((res) => {
				this.gobs = res;
			});
		}
	}
}
