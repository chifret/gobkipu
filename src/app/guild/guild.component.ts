import {Component, OnInit, ViewChild} from '@angular/core';

import {LoginService} from '../core/services/login.service';
import {ClanService} from '../core/services/clan/clan.service';
import {ViewComponent} from '../view/view.component';
import {ViewService} from '../core/services/view/view.service';
import {GobsTypings} from "../core/typings/gobs.typings";
import {PastateEnum} from "../core/enums/pastate.enum";
import {DlastateEnum} from "../core/enums/dlastate.enum";

@Component({
	selector: 'guild-component',
	templateUrl: './guild.component.html'
})
export class GuildComponent implements OnInit {

	processed = false;
	busy = false;
	text = "Refresh";
	guildMembers: GobsTypings[] = [];

	lastId: number = null;

	@ViewChild("viewComponent", {static: true}) viewComponent: ViewComponent;

	constructor(private loginService: LoginService,
				private clanService: ClanService,
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
			const viewable = this.viewService.getViewable(res);

			const viewerSearches = ["Bulette"];
			const viewerAllies: number[] = [];
			this.guildMembers.forEach(guildMember => {
				viewerAllies.push(guildMember.Id);
				if (guildMember.Id == id) {
					viewable.viewerLevel = guildMember.Niveau;
				}
			});

			viewable.viewerAllies = viewerAllies;
			viewable.viewerSearches = viewerSearches;

			this.viewComponent.renderView(viewable);
			this.processed = true;
			this.lastId = id;
		});
	}

	refreshView() {
		this.view(this.lastId, true);
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
		if (this.guildMembers) {
			this.guildMembers = ClanService.update(this.guildMembers);
		}
		setTimeout(() => {
			this.update()
		}, 30000);
	}

	private getData(force: boolean): void {
		if (LoginService.isConnected()) {
			this.clanService.get(force).subscribe((res) => {
				this.guildMembers = res;
			})
		}
	}
}
