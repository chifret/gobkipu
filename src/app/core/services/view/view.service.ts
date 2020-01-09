import {Injectable, Injector} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";

import {Service} from "../service";
import {CsvUtils} from "../../utils/csv.utils";
import {ViewTyping} from "../../typings/view.typings";
import {LoginService} from "../login.service";
import {ViewableClass} from "../../classes/viewable.class";
import {CreaturetypesUtils} from "../../utils/business/creaturetypes.utils";
import {CreatureClass} from "../../objects/creature.class";
import {TresorClass} from "../../objects/tresor.class";
import {LieuxClass} from "../../objects/lieux.class";
import {PlanteClass} from "../../objects/plante.class";
import {Observable} from "rxjs";
import {Twodimmap} from "../../classes/twodimmap.class";

@Injectable()
export class ViewService extends Service {

	numerics = ["Dist", "Id", "Niveau", "X", "Y", "N", "Z"];
	floats = [];
	dates = [];

	constructor(injector: Injector) {
		super(injector);
	}

	public get(id: number, force: boolean = false): Observable<ViewTyping[]> {
		if (localStorage.getItem("view-" + id) && !force) {
			// console.log("get local");
			return Observable.of(JSON.parse(localStorage.getItem("view-" + id)));
		} else {
			// console.log("get distant");
			const token = LoginService.getToken();
			if (token) {
				return this.http.get("https://www.chifret.be/gobkipu/services/view.php?key=" + token.clan + "&id=" + token.id + "&id_view=" + id, {responseType: "text"})
					.map((res: any) => {
						const json = CsvUtils.getJson<ViewTyping>(res, this.numerics, this.floats, this.dates, []);
						localStorage.setItem("view-" + id, JSON.stringify(json));
						return json;
					});
			} else {
				return Observable.empty();
			}
		}
	}

	getViewable(viewItems: ViewTyping[]): ViewableClass {
		const position = {
			avgPosN: null,
			minX: null,
			maxX: null,
			minY: null,
			maxY: null,
			minN: null,
			maxN: null
		};
		const creatures = new Twodimmap<CreatureClass>();
		const gobelins = new Twodimmap<CreatureClass>();
		const tresors = new Twodimmap<TresorClass>();
		const lieux = new Twodimmap<LieuxClass>();
		const plantes = new Twodimmap<PlanteClass>();

		let maxDist = 0;
		const posNs: number[] = [];
		viewItems.forEach(line => {
			if (line.Dist > maxDist) {
				maxDist = line.Dist;
			}
			if (position.minX == null || line.X < position.minX) {
				position.minX = line.X;
			}
			if (position.maxX == null || line.X > position.maxX) {
				position.maxX = line.X;
			}
			if (position.minY == null || line.Y < position.minY) {
				position.minY = line.Y;
			}
			if (position.maxY == null || line.Y > position.maxY) {
				position.maxY = line.Y;
			}
			if (position.minN == null || line.N < position.minN) {
				position.minN = line.N;
			}
			if (position.maxN == null || line.N > position.maxN) {
				position.maxN = line.N;
			}
			switch (line.Categorie) {
				case "C":
					if (line.Dist === -1) {
						posNs.push(line.N);
						gobelins.set({
							dist: line.Dist, level: line.Niveau, name: line.Nom, num: line.Id, type: 1, race: line.Type, clan: line.Clan,
							posX: line.X, posY: line.Y, posN: line.N,
							visible: true, basename: line.Nom, template: null, age: null
						});
					} else {
						if (CreaturetypesUtils.creatureIsGob(line.Type, line.Id)) {
							gobelins.set({
								dist: line.Dist, level: line.Niveau, name: line.Nom, num: line.Id, type: 1, race: line.Type, clan: line.Clan,
								posX: line.X, posY: line.Y, posN: line.N,
								visible: true, basename: line.Nom, template: null, age: null
							});
						} else {
							creatures.set({
								dist: line.Dist, level: line.Niveau, name: line.Nom, num: line.Id, type: 1, race: line.Type, clan: line.Clan,
								posX: line.X, posY: line.Y, posN: line.N,
								visible: true, basename: line.Nom, template: null, age: null
							});
						}
					}
					break;
				case "T":
					tresors.set({
						dist: line.Dist, name: line.Nom, num: line.Id, posX: line.X, posY: line.Y, posN: line.N, value: null, visible: true
					});
					break;
				case "L":
					lieux.set({
						dist: line.Dist, name: line.Nom, num: line.Id, type: line.Type, posX: line.X, posY: line.Y, posN: line.N, visible: true
					});
					break;
				case "P":
					plantes.set({
						dist: line.Dist, name: line.Nom, num: line.Id, posX: line.X, posY: line.Y, posN: line.N, visible: true
					});
					break;
			}
		});
		let totPosN = 0;
		posNs.forEach((posN) => {
			totPosN += posN;
		});

		position.avgPosN = Math.round(totPosN / posNs.length);

		return new ViewableClass(position, creatures, gobelins, tresors, lieux, plantes);
	}
}
