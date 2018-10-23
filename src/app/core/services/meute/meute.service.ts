import {Injectable, Injector} from "@angular/core";
import {Observable} from 'rxjs/Rx';

import {Service} from "../service";
import {LoginService} from "../login.service";
import {CsvUtils} from "../../utils/csv.utils";
import {MeutemembresTyping} from "../../typings/meutemembres.typings";
import {Meutemembres1Typing} from "../../typings/meutemembres1.typing";
import {MeuteMembres2Typing} from "../../typings/meutemembres2.typings";
import {combineLatest} from 'rxjs/observable/combineLatest';
import {map} from 'rxjs/operators/map';
import {JsonUtils} from "../../utils/json.utils";
import {DlaUtils} from "../../utils/business/dla.utils";


@Injectable()
export class MeuteService extends Service {

	numerics = ["CT", "Id", "IdMeute", "N", "Niveau", "PA", "PI", "PV", "PX", "PXPerso", "X", "Y", "Z"];
	floats = [];
	dates = ["DLA"];

	numerics2 = ["ATT", "BMATT", "BMArm", "BMC", "BMDEG", "BMDLA", "BMESQ", "BMM", "BMMC", "BMMM", "BMMP", "BMMR", "BMMS", "BMMT", "BMP", "BMPER", "BMPVMax", "BMR", "BMRC", "BMREG", "BMRM", "BMRP", "BMRR", "BMRS", "BMRT", "BMS", "BMT", "BPATT", "BPArm", "BPDEG", "BPDLA", "BPESQ", "BPMC", "BPMM", "BPMP", "BPMR", "BPMS", "BPMT", "BPPER", "BPPVMax", "BPRC", "BPREG", "BPRM", "BPRP", "BPRR", "BPRS", "BPRT", "BRC", "BRM", "BRP", "BRR", "BRS", "BRT", "DEG", "DLA", "ESQ", "Faim", "Id", "IdMeute", "MC", "MM", "MP", "MR", "MS", "MT", "PER", "PITotal", "PVMax", "RC", "REG", "RM", "RP", "RR", "RS", "RT"];
	floats2 = [];
	dates2 = [];

	constructor(injector: Injector) {
		super(injector);
	}

	static concat(mm1: Meutemembres1Typing[], mm2: MeuteMembres2Typing[]): MeutemembresTyping[] {
		const meutemembres: MeutemembresTyping[] = [];
		for (let i = 0; i < mm1.length; i++) {
			let meutemember = new MeutemembresTyping();
			for (let key in mm1[i]) {
				meutemember[key] = mm1[i][key];
			}
			for (let j = 0; j < mm2.length; j++) {
				if (mm1[i].Id === mm2[j].Id) {
					for (let key in mm2[j]) {
						if (key !== "DLA") {
							meutemember[key] = mm2[j][key];
						} else {
							meutemember.DLADuration = mm2[j].DLA;
						}
					}
				}
			}
			meutemembres.push(MeuteService.enrichment(meutemember));
		}
		return meutemembres;
	}

	static enrichment(item: MeutemembresTyping): MeutemembresTyping {
		// item.DLA = new Date("2018-10-21 10:01");
		// item.DLADuration = 36000;

		const nextDLAs = DlaUtils.getNextDlas(item.DLA, item.DLADuration, item.PA);
		item.nextDLA = nextDLAs.nextDla.date;
		item.dlaState = nextDLAs.dlaState;
		item.paState = nextDLAs.paState;

		return item;
		// item.DLAState = null;
		// item.nextDLA = new Date(item.DLA.getTime() + (1000 * item.DLADuration));
		// const now = new Date();
		// if (item.DLA.getDay() === 5) {
		// 	// optimisation !
		// 	if (item.nextDLA.getDay() === 6) {
		// 		if (now.getDay() != 6) {
		// 			item.DLAState = DlastateEnum.WaitForMidnight;
		// 			item.nextDLA = new Date(item.DLA.getTime() + (500 * item.DLADuration));
		// 		}
		// 	} else if (
		// 		new Date(item.nextDLA.getTime() + (500 * item.DLADuration)).getDay() === 6
		// 		|| (
		// 		new Date(item.nextDLA.getTime() + (1500 * item.DLADuration)).getDay() === 6
		// 		&& new Date(item.nextDLA.getTime() + (1000 * item.DLADuration)).getDay() != 6)
		// 	) {
		// 		item.DLAState = DlastateEnum.ShouldDelayAtMidnight;
		// 	}
		// } else if (item.DLA.getDay() === 6 || item.DLA.getDay() === 7) {
		// 	item.nextDLA = new Date(item.DLA.getTime() + (500 * item.DLADuration));
		// }
		// if (!item.DLAState) {
		// 	if (now.getTime() > item.DLA.getTime()) {
		// 		const diffMin = (item.nextDLA.getTime() - now.getTime()) / 60000;
		// 		if (diffMin <= 30) {
		// 			item.DLAState = DlastateEnum.VeryUrgent;
		// 		} else if (diffMin <= 90) {
		// 			item.DLAState = DlastateEnum.Urgent;
		// 		} else {
		// 			item.DLAState = DlastateEnum.Usable;
		// 		}
		// 	} else if (item.PA > 0) {
		// 		item.DLAState = DlastateEnum.Usable;
		// 	}
		// }
		// return item;
	}

	static update(items: MeutemembresTyping[]): MeutemembresTyping[] {
		if (items) {
			for (let i = 0; i < items.length; i++) {
				items[i] = MeuteService.enrichment(items[i]);
			}
			localStorage.setItem("meutemembres", JSON.stringify(items));
		}
		return items;
	}

	get(force: boolean = false): Observable<MeutemembresTyping[]> {
		if (localStorage.getItem("meutemembres") && !force) {
			console.log("get local");
			return Observable.of(JsonUtils.parse<MeutemembresTyping>(localStorage.getItem("meutemembres"), this.dates));
		} else {
			console.log("get distant");
			return combineLatest(this.get1(), this.get2())
				.pipe(map(([one, two]) => {
					const json = MeuteService.concat(one, two);
					localStorage.setItem("meutemembres", JSON.stringify(json));
					return json;
				}));
		}
	}

	private get1(): Observable<Meutemembres1Typing[]> {
		const token = LoginService.getToken();
		if (token) {
			return this.http.get("https://www.chifret.be/gobkipu/services/teamprofile.php?key=" + token.meute + "&id=" + token.id, {responseType: 'text'})
				.map((res: any) => {
					return CsvUtils.getJson<Meutemembres1Typing>(res, this.numerics, this.floats, this.dates, []);
				});
		}
		else {
			return Observable.empty();
		}
	}

	private get2(): Observable<MeuteMembres2Typing[]> {
		const token = LoginService.getToken();
		if (token) {
			return this.http.get("https://www.chifret.be/gobkipu/services/teamprofile2.php?key=" + token.meute + "&id=" + token.id, {responseType: 'text'})
				.map((res: any) => {
					return CsvUtils.getJson<MeuteMembres2Typing>(res, this.numerics2, this.floats2, this.dates2, []);
				});
		} else {
			return Observable.empty();
		}
	}
}
