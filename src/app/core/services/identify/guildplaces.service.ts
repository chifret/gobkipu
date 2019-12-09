import {Injectable, Injector} from "@angular/core";
import {Observable} from "rxjs/Observable";

import {Service} from "../service";
import {CsvUtils} from "../../utils/csv.utils";
import {GuildPlaceItemsTypings} from "../../typings/guildplaceitems.typings";
import {LoginService} from "../login.service";
import {RecyclageService} from "./recyclage.service";
import {AssetssService} from "app/core/services/assets/assets.service";
import {combineLatest} from "rxjs";
import {CaratsUtils} from "app/core/utils/business/carats.utils";
import {map} from "rxjs/operators";

@Injectable()
export class GuildplacesService extends Service {

	recyclage: { niveau: number, atelier: boolean, crochetGriffe: boolean };
	numerics = ["Id", "Poids", "Prix", "Qualite", "Taille"];
	floats = [];
	dates = [];
	booleans = ["Identifie"];

	protected namepartToItemObs: Observable<any>;
	protected namepartToItem: { name: string, material: string, value: number }[] = null;
	protected nameToItemObs: Observable<any>;
	protected nameToItem: Map<string, { material: string, value: number }> = null;
	protected weightToItemObs: Observable<any>;
	protected weightToItem: Map<string, Map<number, { name: string, value: number, material: string }>> = null;
	protected materialpartToItemObs: Observable<any>;
	protected materialpartToItem: { name: string, material: string, value: number }[] = null;


	constructor(injector: Injector,
				protected recyclageService: RecyclageService,
				protected assetsService: AssetssService) {
		super(injector);
		this.recyclage = this.recyclageService.get()[0];

		this.namepartToItemObs = this.assetsService.getNamepartToItem();
		this.nameToItemObs = this.assetsService.getNameToItem();
		this.weightToItemObs = this.assetsService.getWeightToItem();
		this.materialpartToItemObs = this.assetsService.getMaterialpartToItem();

		// noinspection JSDeprecatedSymbols
		combineLatest(this.namepartToItemObs, this.nameToItemObs, this.weightToItemObs, this.materialpartToItemObs,
			(namepartToItemResult, nameToItemResult, weightToItemResult, materialpartToItemResult) => ({
				namepartToItemResult,
				nameToItemResult,
				weightToItemResult,
				materialpartToItemResult
			}))
			.subscribe((trio) => {
				this.namepartToItem = trio.namepartToItemResult;
				this.nameToItem = trio.nameToItemResult;
				this.weightToItem = trio.weightToItemResult;
				this.materialpartToItem = trio.materialpartToItemResult;
			});
	}

	public get(force: boolean = false): Observable<GuildPlaceItemsTypings[]> {
		// noinspection JSDeprecatedSymbols
		return combineLatest([this.namepartToItemObs, this.nameToItemObs, this.weightToItemObs],
			(namepartToItemResult, nameToItemResult, weightToItemResult) => ({
				namepartToItemResult,
				nameToItemResult,
				weightToItemResult
			}))
			.switchMap(() => {
				if (localStorage.getItem("guildplaceitems") && !force) {
					const json = JSON.parse(localStorage.getItem("guildplaceitems"));
					// this.enrichment(json);
					return Observable.of(json);
				} else {
					const token = LoginService.getToken();
					if (token) {

						// GRUIK balek
						if ([304, 309, 332, 333, 334, 340, 346, 363, 369, 394].indexOf(token.id) > -1) {
							return combineLatest([this.get1(), this.get2(332)])

								.pipe(map(([one, two]) => {
									let json = one;
									if (two) {
										json = [...json, ...two];
									}
									//const json = [...one, ...two];
									this.enrichment(json);
									localStorage.setItem("guildplaceitems", JSON.stringify(json));
									return json;
								}));
						} else {
							return this.get1()
								.map((res2: any) => {
									const json = res2;
									this.enrichment(json);
									localStorage.setItem("guildplaceitems", JSON.stringify(json));
									return json;
								});
						}
					} else {
						return Observable.empty();
					}
				}
			});
	}

	private get1(): Observable<GuildPlaceItemsTypings[]> {
		const token = LoginService.getToken();
		if (token) {
			return this.http.get("https://www.chifret.be/gobkipu/services/guildplace.php?key=" + token.clan + "&id=" + token.id, {responseType: "text"})
				.map((res: any) => {
					return CsvUtils.getJson<GuildPlaceItemsTypings>(res, this.numerics, this.floats, this.dates, this.booleans);
				});
		} else {
			return Observable.empty();
		}
	}

	private get2(id: number): Observable<GuildPlaceItemsTypings[]> {
		const token = LoginService.getToken();
		if (token) {
			return this.http.get("https://www.chifret.be/gobkipu/services/place.php?key=" + token.clan + "&id=" + token.id + "&id_place=" + id, {responseType: "text"})
				.map((res: any) => {
					return CsvUtils.getJson<GuildPlaceItemsTypings>(res, this.numerics, this.floats, this.dates, this.booleans);
				});
		} else {
			return Observable.empty();
		}
	}

	private enrichment(json: GuildPlaceItemsTypings[]): GuildPlaceItemsTypings[] {
		for (let i = 0; i < json.length; i++) {

			// fix réservation
			if (json[i].Reservation === "Tout le monde") {
				json[i].Reservation = "";
			}

			// fix rondins
			if (json[i].Type === "Matériau" && json[i].Nom === "Rondin" && !json[i].Qualite) {
				json[i].Qualite = 2;
				json[i].Matiere = "Bois";
			}

			// fix poids
			if (json[i].Poids) {
				json[i].Poids = Math.round((json[i].Poids / 60) * 100) / 100;
			}

			// category, desc, types
			switch (json[i].Type) {
				case "Fleur":
				case "Racine":
				case "Graine":
				case "Mousse":
				case "Champignon":
				case "Plante Grasse":
				case "Baie": {
					json[i].Category = "Plante";
					json[i].Taille = null;
					json[i].Desc = null;
					json[i].Stars = 2;
					json[i].Qualite += 10;
					break;
				}
				case "Potion": {
					json[i].Category = json[i].Type;
					json[i].Taille = null;
					if (json[i].Identifie) {
						const duration = json[i].Desc.substring(json[i].Desc.length - 1, json[i].Desc.length);
						if (duration === "0" && json[i].Desc.indexOf("PV") === 0) {
							// console.log(json[i].Desc);
							// console.log(json[i].Desc.substring(4, json[i].Desc.indexOf("D3")));
							json[i].Stars = Math.min(5, parseInt(json[i].Desc.substring(4, json[i].Desc.indexOf("D3")), 10) / 2);
						} else {
							json[i].Stars = Math.min(5, Math.max(1, parseInt(duration, 10)));
						}
					} else {
						json[i].Stars = 1;
					}
					break;
				}
				case "Spécial": {
					json[i].Category = json[i].Type;
					json[i].Taille = null;
					json[i].Stars = 1;
					break;
				}
				case "Outil":
				case "Composant":
				case "Corps": {
					json[i].Category = json[i].Type;
					json[i].Taille = null;
					json[i].Desc = null;
					json[i].Stars = 1;
					break;
				}
				case "Nourriture": {
					json[i].Category = json[i].Type;
					json[i].Taille = null;
					json[i].Desc = null;
					if (json[i].Id < 650000) {
						json[i].Stars = 0;
					} else {
						json[i].Stars = 3;
						if (["Rations réduites", "Rations de survie"].indexOf(json[i].Nom) > -1) {
							json[i].Stars--;
						}
					}
					break;
				}
				case "Parchemin": {
					json[i].Category = json[i].Type;
					json[i].Taille = null;
					json[i].Desc = null;
					json[i].Stars = 5;
					break;
				}
				default: {
					if (json[i].Qualite) {
						json[i].Category = "Matériaux";
						json[i].Desc = null;
						if (!json[i].Matiere) {
							json[i].Matiere = json[i].Nom;
						}
						json[i].Stars = 5;
						this.materialpartToItem.forEach((materialContained) => {
							if (json[i].Matiere.indexOf(materialContained.name) > -1) {
								json[i].Stars = materialContained.value;
							}
						});
					} else {
						json[i].Category = "Équipement";
						json[i].Taille = null;
						if (json[i].Matiere === "Pierre") {
							json[i].Nom += " en Pierre";
						}
						if (json[i].Type === "Arme 1 Main") {
							json[i].Type = "Arme à 1 main";
						} else if (json[i].Type === "Arme 2 mains") {
							json[i].Type = "Arme à 2 mains";
						}
					}
					break;
				}
			}

			// weight expectation
			if (!json[i].Identifie) {
				if (["Équipement", "Outil"].indexOf(json[i].Category) > -1) {
					if (this.weightToItem.get(json[i].Type)) {
						const tmp = this.weightToItem.get(json[i].Type);
						if (tmp.get(json[i].Poids)) {
							json[i].Nom = tmp.get(json[i].Poids).name;
							json[i].Stars = tmp.get(json[i].Poids).value;
							json[i].Matiere = tmp.get(json[i].Poids).material;
						} else {
							json[i].Nom = "???";
							json[i].Stars = 5;
						}
					}
				} else if (json[i].Category === "Corps") {
					const tmp = this.weightToItem.get(json[i].Type);
					if (tmp.get(json[i].Poids)) {
						json[i].Nom = tmp.get(json[i].Poids).name;
						json[i].Stars = tmp.get(json[i].Poids).value;
					} else {
						json[i].Nom = "Cadavre inconnu";
						json[i].Stars = 2;
					}
				}
			}

			// identified corpses not listed
			if (json[i].Identifie && json[i].Category === "Corps" && this.weightToItem.get(json[i].Type) && !this.weightToItem.get(json[i].Type).get(json[i].Poids)) {
				json[i].Nom += " (non listé)";
				json[i].Stars = 3;
			}

			// material carats
			if (json[i].Taille && json[i].Matiere) {
				if (json[i].Matiere === "Bois") {
					json[i].Carats = json[i].Taille;
				} else {
					json[i].Carats = json[i].Taille * (json[i].Qualite ? CaratsUtils.carats.get(json[i].Qualite) : 3);
				}
			}

			// equipment material expectation
			if (["Équipement", "Outil"].indexOf(json[i].Category) > -1) {
				let mat = json[i].Matiere;
				if (mat) {
					this.namepartToItem.forEach((materialContained) => {
						if (json[i].Matiere.indexOf(materialContained.name) > -1) {
							json[i].Stars = materialContained.value - 1;
						}
					});
				} else {
					const matTmp = this.nameToItem.get(json[i].Nom);
					if (matTmp && matTmp.material) {
						json[i].Matiere = matTmp.material;
						json[i].Stars = matTmp.value;
						mat = matTmp.material;
					} else {
						console.log(json[i].Nom);
						if (json[i].Nom === "Anneau Barbare") {
							if (json[i].Desc.indexOf("ATT:+1") > -1) {
								if (json[i].Desc.indexOf("DEG:+1") > -1) {
									json[i].Matiere = "Fer";
									json[i].Stars = 1;
									mat = "Fer";
								} else {
									json[i].Matiere = "???";
									json[i].Stars = 4;
									mat = "???";
								}
							} else {
								if (json[i].Desc.indexOf("DEG:+1") > -1) {
									json[i].Matiere = "Etain";
									json[i].Stars = 4;
									mat = "Etain";
								} else {
									json[i].Matiere = "Cuivre";
									json[i].Stars = 4;
									mat = "Cuivre";
								}
							}
						}
					}
				}
				if (!mat) {
					this.namepartToItem.forEach((materialContained) => {
						if (json[i].Nom.indexOf(materialContained.name) > -1) {
							mat = materialContained.material;
							json[i].Matiere = mat;
							json[i].Stars = materialContained.value;
						}
					});
				}

				if (mat) {
					let factor = 1;
					factor += (this.recyclage.niveau - 1) * 0.5;
					let mult = 1;
					if (this.recyclage.atelier) {
						mult += 0.25;
					}
					if (this.recyclage.crochetGriffe) {
						mult += 0.25;
					}
					factor *= mult;

					switch (json[i].Matiere) {
						case "Composant":
						case "Plante":
						case null:
							json[i].Carats = null;
							break;
						default:
							json[i].Carats = Math.max(1, Math.floor(json[i].Poids * 0.9 * factor));
							break;

					}
				}
			}

			// template
			if (json[i].Category === "Équipement" && json[i].Magie !== "") {
				console.log("-" + json[i].Magie + "-");
				this.namepartToItem.forEach((materialContained) => {
					if (json[i].Magie.indexOf(materialContained.name) > -1) {
						json[i].Stars = materialContained.value;
					}
				});
			}
		}
		return json;
	}
}
