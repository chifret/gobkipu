import {Injectable, Injector} from "@angular/core";
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import {Service} from "../service";
import {CsvUtils} from "../../utils/csv.utils";
import {ViewTyping} from "../../typings/view.typings";
import {LoginService} from "../login.service";
import {ViewableClass} from "../../classes/viewable.class";
import {CreaturetypesUtils} from "../../utils/business/creaturetypes.utils";
import {CreatureClass} from "../../classes/creature.class";
import {TresorClass} from "../../classes/tresor.class";
import {LieuxClass} from "../../classes/lieux.class";
import {PlanteClass} from "../../classes/plante.class";

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
				return this.http.get("https://www.chifret.be/gobkipu/services/view.php?key=" + token.clan + "&id=" + token.id + "&id_view=" + id, {responseType: 'text'})
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


	// public getAll(force: boolean = false): Observable<ViewTyping[]> {
	// 	const token = LoginService.getToken();
	// 	if (token) {
	//
	//
	// 		// return this.meuteService.get()
	// 		// 	.pipe(map((meuteMembres) => {
	// 		// 		let viewTypingsMeute: ViewTyping[] = [];
	// 		// 		let test = [];
	// 		// 		meuteMembres.forEach((meuteMembre) => {
	// 		// 			if (localStorage.getItem("view-" + meuteMembre.Id) && !force) {
	// 		// 				console.log("get local");
	// 		// 				viewTypingsMeute = [...viewTypingsMeute, ...JSON.parse(localStorage.getItem("view-" + meuteMembre.Id))];
	// 		// 				test.push()
	// 		//
	// 		// 				} else {
	// 		// 					console.log("get distant");
	// 		// 					this.http.get("https://www.chifret.be/gobkipu/services/view.php?key=" + token.clan + "&id=" + token.id + "&id_view=" + meuteMembre.Id, {responseType: 'text'})
	// 		// 						.pipe(map((res: any) => {
	// 		// 							const json = CsvUtils.getJson<ViewTyping>(res, this.numerics, this.floats, this.dates, []);
	// 		// 							localStorage.setItem("view-" + meuteMembre.Id, JSON.stringify(json));
	// 		// 							viewTypingsMeute = [...viewTypingsMeute, ...json];
	// 		// 						}));
	// 		//
	// 		//
	// 		// 			}
	// 		// 		});
	// 		// 		return viewTypingsMeute;
	// 		// 	}));
	//
	//
	// 		// return this.meuteService.get()
	// 		// 	.pipe(map(meuteMembres => {
	// 		// 		return meuteMembres;
	// 		// 	}))
	// 		// 	.mergeMap(meuteMembre => {
	// 		// 		if (localStorage.getItem("view-" + meuteMembre.Id) && !force) {
	// 		// 			console.log("get local");
	// 		// 			return JSON.parse(localStorage.getItem("view-" + meuteMembre.Id));
	// 		// 		} else {
	// 		// 			console.log("get distant");
	// 		// 			return this.http.get("https://www.chifret.be/gobkipu/services/view.php?key=" + token.clan + "&id=" + token.id + "&id_view=" + meuteMembre.Id, {responseType: 'text'})
	// 		// 				.pipe(map((res: any) => {
	// 		// 					const json = CsvUtils.getJson<ViewTyping>(res, this.numerics, this.floats, this.dates, []);
	// 		// 					localStorage.setItem("view-" + meuteMembre.Id, JSON.stringify(json));
	// 		// 					return json;
	// 		// 				}));
	// 		//
	// 		//
	// 		// 		}
	// 		// 	});
	//
	//
	// 		// this.homeworld = this.http.get('/api/people/1')
	// 		// 	.map(res => res.json())
	// 		// 	.mergeMap(character => this.http.get(character.homeworld))
	//
	//
	// 		// const takeEveryNth = (n: number) => <T>(source: Observable<T>) =>
	// 		// 	new Observable<T>(observer => {
	// 		// 		let count = 0;
	// 		// 		return source.subscribe({
	// 		// 			next(x) {
	// 		// 				if (count++ % n === 0) observer.next(x);
	// 		// 			},
	// 		// 			error(err) { observer.error(err); },
	// 		// 			complete() { observer.complete(); }
	// 		// 		})
	// 		// 	});
	//
	//
	// 	} else {
	// 		return Observable.empty();
	// 	}
	// }

	getViewable(viewItems: ViewTyping[]): ViewableClass {
		let position = {
			avgPosN: null,
			minX: null,
			maxX: null,
			minY: null,
			maxY: null
		};
		let creatures: Map<number, CreatureClass> = new Map();
		let gobelins: Map<number, CreatureClass> = new Map();
		let tresors: Map<number, TresorClass> = new Map();
		let lieux: Map<number, LieuxClass> = new Map();
		let plantes: Map<number, PlanteClass> = new Map();

		let maxDist = 0;
		let posNs: number[] = [];
		viewItems.forEach(line => {
			if (line.Dist > maxDist) {
				maxDist = line.Dist;
			}
			if (!position.minX || line.X < position.minX) {
				position.minX = line.X;
			}
			if (!position.maxX || line.X > position.maxX) {
				position.maxX = line.X;
			}
			if (!position.minY || line.Y < position.minY) {
				position.minY = line.Y;
			}
			if (!position.maxY || line.Y > position.maxY) {
				position.maxY = line.Y;
			}
			switch (line.Categorie) {
				case "C":
					if (line.Dist == -1) {
						posNs.push(line.N);
						gobelins.set(line.Id, {
							dist: line.Dist, level: line.Niveau, name: line.Nom, num: line.Id, type: 1, race: line.Type, clan: line.Clan,
							posX: line.X, posY: line.Y, posN: line.N
						});
					} else {
						if (CreaturetypesUtils.creatureIsGob(line.Type, line.Id)) {
							gobelins.set(line.Id, {
								dist: line.Dist, level: line.Niveau, name: line.Nom, num: line.Id, type: 1, race: line.Type, clan: line.Clan,
								posX: line.X, posY: line.Y, posN: line.N
							});
						}
						else {
							creatures.set(line.Id, {
								dist: line.Dist, level: line.Niveau, name: line.Nom, num: line.Id, type: 1, race: line.Type, clan: line.Clan,
								posX: line.X, posY: line.Y, posN: line.N
							});
						}
					}
					break;
				case "T":
					tresors.set(line.Id, {
						dist: line.Dist, name: line.Nom, num: line.Id, posX: line.X, posY: line.Y, posN: line.N
					});
					break;
				case "L":
					lieux.set(line.Id, {
						dist: line.Dist, name: line.Nom, num: line.Id, type: line.Type, posX: line.X, posY: line.Y, posN: line.N
					});
					break;
				case "P":
					plantes.set(line.Id, {
						dist: line.Dist, name: line.Nom, num: line.Id, posX: line.X, posY: line.Y, posN: line.N
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
