import {Injectable, Injector} from "@angular/core";
import {Observable} from 'rxjs/Rx';

import {Service} from "../service";
import {LoginService} from "../login.service";
import {CsvUtils} from "../../utils/csv.utils";
import {GobsTypings} from "../../typings/gobs.typings";
import {Gobs1Typings} from "../../typings/gobs1.typings";
import {Gobs2Typings} from "../../typings/gobs2.typings";
import {combineLatest} from 'rxjs/observable/combineLatest';
import {map} from 'rxjs/operators/map';
import {JsonUtils} from "../../utils/json.utils";
import {DlaUtils} from "../../utils/business/dla.utils";


@Injectable()
export class ClanService extends Service {

	numerics = ["CT", "Id", "IdClan", "N", "Niveau", "PA", "PI", "PV", "PX", "PXPerso", "X", "Y", "Z"];
	floats = [];
	dates = ["DLA"];

	numerics2 = ["ATT", "BMATT", "BMArm", "BMC", "BMDEG", "BMDLA", "BMESQ", "BMM", "BMMC", "BMMM", "BMMP", "BMMR", "BMMS", "BMMT", "BMP", "BMPER", "BMPVMax", "BMR", "BMRC", "BMREG", "BMRM", "BMRP", "BMRR", "BMRS", "BMRT", "BMS", "BMT", "BPATT", "BPArm", "BPDEG", "BPDLA", "BPESQ", "BPMC", "BPMM", "BPMP", "BPMR", "BPMS", "BPMT", "BPPER", "BPPVMax", "BPRC", "BPREG", "BPRM", "BPRP", "BPRR", "BPRS", "BPRT", "BRC", "BRM", "BRP", "BRR", "BRS", "BRT", "DEG", "DLA", "ESQ", "Faim", "Id", "IdMeute", "MC", "MM", "MP", "MR", "MS", "MT", "PER", "PITotal", "PVMax", "RC", "REG", "RM", "RP", "RR", "RS", "RT"];
	floats2 = [];
	dates2 = [];

	constructor(injector: Injector) {
		super(injector);
	}

	static concat(mm1: Gobs1Typings[], mm2: Gobs2Typings[]): GobsTypings[] {
		const gobs: GobsTypings[] = [];
		for (let i = 0; i < mm1.length; i++) {
			let gob = new GobsTypings();
			for (let key in mm1[i]) {
				gob[key] = mm1[i][key];
			}
			for (let j = 0; j < mm2.length; j++) {
				if (mm1[i].Id === mm2[j].Id) {
					for (let key in mm2[j]) {
						if (key !== "DLA") {
							gob[key] = mm2[j][key];
						} else {
							gob.DLADuration = mm2[j].DLA;
						}
					}
				}
			}
			gobs.push(ClanService.enrichment(gob));
		}
		return gobs;
	}

	static enrichment(item: GobsTypings): GobsTypings {
		const nextDLAs = DlaUtils.getNextDlas(item.DLA, item.DLADuration, item.PA);
		item.nextDLA = nextDLAs.nextDla.date;
		item.dlaState = nextDLAs.dlaState;
		item.paState = nextDLAs.paState;
		return item;
	}

	static update(items: GobsTypings[]): GobsTypings[] {
		if (items) {
			for (let i = 0; i < items.length; i++) {
				items[i] = ClanService.enrichment(items[i]);
			}
			localStorage.setItem("clanmembres", JSON.stringify(items));
		}
		return items;
	}

	get(force: boolean = false): Observable<GobsTypings[]> {
		if (localStorage.getItem("clanmembres") && !force) {
			console.log("get local");
			return Observable.of(JsonUtils.parse<GobsTypings>(localStorage.getItem("clanmembres"), this.dates));
		} else {
			console.log("get distant");
			return combineLatest(this.get1(), this.get2())
				.pipe(map(([one, two]) => {
					const json = ClanService.concat(one, two);
					localStorage.setItem("clanmembres", JSON.stringify(json));
					return json;
				}));
		}
	}

	private get1(): Observable<Gobs1Typings[]> {
		const token = LoginService.getToken();
		if (token) {
			return this.http.get("https://www.chifret.be/gobkipu/services/guildprofile.php?key=" + token.clan + "&id=" + token.id, {responseType: 'text'})
				.map((res: any) => {
					return CsvUtils.getJson<Gobs1Typings>(res, this.numerics, this.floats, this.dates, []);
				});
		}
		else {
			return Observable.empty();
		}
	}

	private get2(): Observable<Gobs2Typings[]> {
		const token = LoginService.getToken();
		if (token) {
			return this.http.get("https://www.chifret.be/gobkipu/services/guildprofile2.php?key=" + token.clan + "&id=" + token.id, {responseType: 'text'})
				.map((res: any) => {
					return CsvUtils.getJson<Gobs2Typings>(res, this.numerics2, this.floats2, this.dates2, []);
				});
		} else {
			return Observable.empty();
		}
	}
}
