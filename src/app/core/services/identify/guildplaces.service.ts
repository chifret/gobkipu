import {Injectable, Injector, OnDestroy} from "@angular/core";
import {Observable} from 'rxjs/Rx';

import {Service} from "../service";
import {CsvUtils} from "../../utils/csv.utils";
import {GuildPlaceItemsTypings} from "../../typings/guildplaceitems.typings";
import {LoginService} from "../login.service";
import {RecyclageService} from "./recyclage.service";
import {AssetssService} from "app/core/services/assets/assets.service";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "app/core/utils/subscription.utils";

@Injectable()
export class GuildplacesService extends Service implements OnDestroy {

	recyclage: { niveau: number, atelier: boolean, crochetGriffe: boolean };
	numerics = ["Id", "Poids", "Prix", "Qualite", "Taille"];
	floats = [];
	dates = [];
	booleans = ["Identifie"];
	carats: Map<number, number> = new Map([
		[1, 2],
		[2, 2.75],
		[3, 3.5],
		[4, 4.25],
		[5, 5],
		[-1, 1]
	]);
	weightToExpected: Map<string, Map<number, { name: string, stars: number, material: string }>> = new Map([
		["Outil", new Map([
			[1, {name: "Aiguille", stars: 0, material: null}],
			[2, {name: "Poinçon", stars: 0, material: null}],
			[3, {name: "Marteau de joaillier", stars: 0, material: null}],
			[5, {name: "Ciseau à bois", stars: 0, material: null}],
			[10, {name: "Alambic", stars: 0, material: null}],
			[20, {name: "Marteau de forgeron / de tailleur", stars: 0, material: "Fer, Pierre"}],
			[40, {name: "Hache de bucheron", stars: 1, material: null}],
			[60, {name: "Creuset", stars: 0, material: null}]
		])],
		["Anneau", new Map([
			[2, {name: "Anneau inconnu", stars: 4, material: "Argent, Cuivre, Etain, Fer, ???"}]
		])],
		["Arme à 1 main", new Map([
			[5, {name: "Coutelas (os, pierre) / Corchet / Dague / Griffes / Racine / Torche", stars: 1, material: "Bois, Fer, Pierre, Composant"}],
			[7.5, {name: "Epée de bois / Fouet", stars: 0, material: "Bois, Cuir"}],
			[10, {name: "Epée courte / Hachette / Gourdin", stars: 0, material: "Bois, Fer"}],
			[15, {name: "Gourdin clouté / Lame d'os / Machette / Pic", stars: 1, material: "Bois, Fer, Pierre, Composant"}],
			[20, {name: "Épée longue / Hache d'armes / Masse d'armes", stars: 0, material: "Bois, Fer"}],
			[25, {name: "Fléau d'armes", stars: 2, material: null}],
			[30, {name: "Épée bâtarde / Marteau de guerre / Morgenstern", stars: 0, material: "Bois, Fer"}]
		])],
		["Arme à 2 mains", new Map([
			[7.5, {name: "Bâtons de parade", stars: 0, material: null}],
			[8, {name: "Bâton lesté", stars: 0, material: null}],
			[10, {name: "Arc court", stars: 2, material: null}],
			[15, {name: "Hachoir en bois", stars: 0, material: null}],
			[20, {name: "Bâton de feu", stars: 3, material: null}],
			[30, {name: "Épée à deux mains / Grande hache / Hache de bataille / de guerre en os / en pierre", stars: 0, material: "Fer, Pierre, Composant"}],
			[35, {name: "Arbalète composite / Chaîne cloutée", stars: 2, material: "Bois, Fer"}],
			[40, {name: "Massue trolle, Pioche, Vouge", stars: 1, material: "Bois, Fer"}],
			[45, {name: "Arbalète lourde, Faux", stars: 2, material: "Bois, Fer"}],
			[50, {name: "Vorpale", stars: 2, material: null}],
			[60, {name: "Lance-feu", stars: 3, material: null}]
		])],
		["Armure", new Map([
			[3, {name: "Vêtement léger inconnu", stars: 0, material: "Cuir, Tissus"}],
			[5, {name: "Pagne en cuir", stars: 0, material: null}],
			[7, {name: "Vêtement lourd inconnu", stars: 0, material: "Cuir, Fer, Tissus, Composant"}],
			[12, {name: "Armure légère inconnue", stars: 0, material: "Cuir, Fer, Composant"}],
			[20, {name: "Armure intermédiaire inconnue", stars: 0, material: "Cuir, Fer, Composant"}],
			[40, {name: "Armure lourde inconnue", stars: 0, material: "Bois, Fer, Pierre, Composant"}],
			[60, {name: "Armure très lourde inconnue", stars: 0, material: "Fer, Composant"}]
		])],
		["Baguette", new Map([
			[3, {name: "Baguette inconnue", stars: 1, material: "Bois"}]
		])],
		["Bijou", new Map([
			[5, {name: "Bijou inconnu", stars: 4, material: "Adamantium, Argent, Cuivre, Etain, Fer, Mithril, Or, Diamant, Opale, Rubis, Saphir"}]
		])],
		["Bottes", new Map([
			[3, {name: "Jambières en fourrure / Sandales", stars: 0, material: "Cuir, Composant"}],
			[5, {name: "Bottes", stars: 0, material: "Cuir"}],
			[15, {name: "Jambières lourdes inconnues", stars: 0, material: "Bois, Cuir, Fer, Pierre, Composant"}]
		])],
		["Bouclier", new Map([
			[5, {name: "Targe", stars: 0, material: null}],
			[10, {name: "Bouclier léger inconnu", stars: 0, material: "Bois, Cuir, Fer, Pierre, Composant"}],
			[20, {name: "Bouclier lourd inconnu", stars: 0, material: "Bois, Fer, Pierre, Composant"}],
			[35, {name: "Bouclier à pointes", stars: 3, material: null}]
		])],
		["Casque", new Map([
			[3, {name: "Casque léger inconnu", stars: 0, material: "Cuir, Fer, Tissus, Composant"}],
			[7, {name: "Casque à cornes", stars: 0, material: null}],
			[10, {name: "Casque à pointes", stars: 2, material: null}],
			[15, {name: "Heaume", stars: 2, material: null}]
		])],
		["Talisman", new Map([
			[3, {name: "Talisman inconnu", stars: 0, material: "Bois, Fer, Pierre, Composant, Plante"}],
			[5, {name: "Gorgeron en métal", stars: 0, material: null}],
			[6, {name: "Collier de dents", stars: 0, material: null}]
		])],
		["Corps", new Map([
			[23.8, {name: "Cadavre de Fourmi Ouvrière ???", stars: 1, material: null}],
			[30.6, {name: "Cadavre de Fourmi Guerrière ???", stars: 1, material: null}],
			[40, {name: "Cadavre de Zombi invoqué ???", stars: 0, material: null}],
			[90, {name: "Cadavre de Djinn / Ours hibou ???", stars: 1, material: null}],
			[100, {name: "Cadavre d'Ent ???", stars: 1, material: null}],
			[105, {name: "Cadavre d'Abishaii ???", stars: 0, material: null}],
			[110, {name: "Cadavre d'Hellrot ???", stars: 0, material: null}],
			[190, {name: "Cadavre de Ver Géant Carnivore ???", stars: 1, material: null}],
			[232, {name: "Cadavre de Titan ???", stars: 1, material: null}],
		])],
		["Parchemin", new Map([
			[9, {name: "Parchemin inconnu", stars: 5, material: null}]
		])]
	]);
	protected readonly namePartToMaterialSubscription: Subscription = null;
	protected namePartToMaterial: { name: string, material: string, value: number }[] = null;
	protected readonly nameToMaterialSubscription: Subscription = null;
	protected nameToMaterial: Map<string, { material: string, value: number }> = null;

	constructor(injector: Injector,
				protected recyclageService: RecyclageService,
				protected assetsService: AssetssService) {
		super(injector);
		this.recyclage = this.recyclageService.get()[0];
		this.namePartToMaterialSubscription = this.assetsService.getNamePartToMatrial().subscribe(data => {
			this.namePartToMaterial = data;
		});
		this.nameToMaterialSubscription = this.assetsService.getNameToMatrial().subscribe(data => {
			this.nameToMaterial = data;
		});
	}

	ngOnDestroy(): void {
		SubscriptionUtils.unsubs(this.namePartToMaterialSubscription);
		SubscriptionUtils.unsubs(this.nameToMaterialSubscription);
	}

	public get(force: boolean = false): Observable<GuildPlaceItemsTypings[]> {
		if (localStorage.getItem("guildplaceitems") && !force) {
			const json = JSON.parse(localStorage.getItem("guildplaceitems"));
			// this.enrichment(json);
			return Observable.of(json);
		} else {
			const token = LoginService.getToken();
			if (token) {
				return this.http.get("https://www.chifret.be/gobkipu/services/guildplace.php?key=" + token.clan + "&id=" + token.id, {responseType: 'text'})
					.map((res: any) => {
						const json = CsvUtils.getJson<GuildPlaceItemsTypings>(res, this.numerics, this.floats, this.dates, this.booleans);
						this.enrichment(json);
						localStorage.setItem("guildplaceitems", JSON.stringify(json));
						// this.enrichment(json);
						return json;
					});
			} else {
				return Observable.empty();
			}
		}
	}

	private enrichment(json: GuildPlaceItemsTypings[]): GuildPlaceItemsTypings[] {
		for (let i = 0; i < json.length; i++) {

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
					break;
				}
				case "Potion":
				case "Spécial": {
					json[i].Category = json[i].Type;
					json[i].Taille = null;
					break;
				}
				case "Outil":
				case "Parchemin":
				case "Composant":
				case "Corps":
				case "Nourriture": {
					json[i].Category = json[i].Type;
					json[i].Taille = null;
					json[i].Desc = null;
					break;
				}
				default: {
					if (json[i].Qualite) {
						json[i].Category = "Matériaux";
						json[i].Desc = null;
						if (!json[i].Matiere) {
							json[i].Matiere = json[i].Nom;
						}
					} else {
						json[i].Category = "Équipement";
						json[i].Taille = null;
						if (json[i].Matiere == "Pierre") {
							json[i].Nom += " en Pierre";
						}
						if (json[i].Type == "Arme 1 Main") {
							json[i].Type = "Arme à 1 main";
						} else if (json[i].Type == "Arme 2 mains") {
							json[i].Type = "Arme à 2 mains";
						}
					}
					break;
				}
			}

			// weight expectation
			if (!json[i].Identifie) {
				if (["Équipement", "Outil"].indexOf(json[i].Category) > -1) {
					if (this.weightToExpected.get(json[i].Type)) {
						const tmp = this.weightToExpected.get(json[i].Type);
						if (tmp.get(json[i].Poids)) {
							json[i].Nom = tmp.get(json[i].Poids).name;
							json[i].Stars = tmp.get(json[i].Poids).stars;
							json[i].Matiere = tmp.get(json[i].Poids).material;
						} else {
							json[i].Nom = "???";
							json[i].Stars = 5;
						}
					}
				} else if (json[i].Category == "Corps") {
					const tmp = this.weightToExpected.get(json[i].Type);
					if (tmp.get(json[i].Poids)) {
						json[i].Nom = tmp.get(json[i].Poids).name;
						json[i].Stars = tmp.get(json[i].Poids).stars;
					} else {
						json[i].Nom = "Cadavre inconnu";
						json[i].Stars = 2;
					}
				}
			}

			// material carats
			if (json[i].Taille && json[i].Matiere) {
				if (json[i].Matiere === "Bois") {
					json[i].Carats = json[i].Taille;
				} else {
					json[i].Carats = json[i].Taille * (json[i].Qualite ? this.carats.get(json[i].Qualite) : 3);
				}
			}

			// equipment material expectation
			if (["Équipement", "Outil"].indexOf(json[i].Category) > -1) {
				let mat = json[i].Matiere;
				if (!mat) {
					mat = this.nameToMaterial.get(json[i].Nom).material;
					if (mat) {
						json[i].Matiere = mat;
					} else {
						if (json[i].Nom == "Anneau Barbare") {
							if (json[i].Desc.indexOf("ATT:+1") > -1) {
								if (json[i].Desc.indexOf("DEG:+1")) {
									json[i].Matiere = "Fer";
									mat = "Fer";
								} else {
									json[i].Matiere = "???";
								}
							} else {
								if (json[i].Desc.indexOf("DEG:+1")) {
									json[i].Matiere = "Etain";
									mat = "Etain";
								} else {
									json[i].Matiere = "Cuivre";
									mat = "Cuivre";
								}
							}
						}
					}
				}
				if (!mat) {
					this.namePartToMaterial.forEach((materialContained) => {
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
		}
		return json;
	}
}
