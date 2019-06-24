import {Injectable, Injector} from "@angular/core";
import {Observable} from 'rxjs/Rx';

import {Service} from "../service";
import {CsvUtils} from "../../utils/csv.utils";
import {GuildPlaceItemsTypings} from "../../typings/guildplaceitems.typings";
import {LoginService} from "../login.service";
import {RecyclageService} from "./recyclage.service";

@Injectable()
export class GuildplacesService extends Service {

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
			[40, {name: "Hache de bucheron", stars: 3, material: null}],
			[60, {name: "Creuset", stars: 0, material: null}]
		])],
		["Anneau", new Map([
			[2, {name: "Anneau inconnu", stars: 3, material: null}]
		])],
		["Arme à 1 main", new Map([
			[5, {name: "Coutelas (os, pierre) / Corchet / Dague / Griffes / Racine / Torche", stars: 1, material: "Bois, Fer, Pierre, autre..."}],
			[7.5, {name: "Epée de bois / Fouet", stars: 4, material: "Bois, Cuir"}],
			[10, {name: "Epée courte / Hachette / Gourdin", stars: 0, material: "Bois, Fer"}],
			[15, {
				name: "Cimeterre en pierre / Épieu / Gourdin clouté / Hache de lancer / Lame / Lame d'os / Machette / Pic", stars: 2, material: "Bois, Fer, Pierre, autre..."
			}],
			[20, {name: "Épée longue / Hache d'armes / Masse d'armes", stars: 0, material: "Bois, Fer"}],
			[25, {name: "Fléau d'armes", stars: 0, material: null}],
			[30, {name: "Épée bâtarde / Marteau de guerre / Morgenstern", stars: 1, material: "Bois, Fer"}]
		])],
		["Arme à 2 mains", new Map([
			[7.5, {name: "Bâtons de parade", stars: 0, material: null}],
			[8, {name: "Bâton lesté", stars: 0, material: null}],
			[10, {name: "Arc court", stars: 3, material: null}],
			[15, {name: "Hachoir en bois", stars: 4, material: null}],
			[20, {name: "Bâton de feu", stars: 5, material: null}],
			[30, {
				name: "Épée à deux mains / Grande hache / Hache de bataille / de guerre / en os / en pierre", stars: 3, material: "Fer, Pierre, autre..."
			}],
			[35, {name: "Arbalète composite / Chaîne cloutée", stars: 4, material: "Bois, Fer"}],
			[40, {name: "Massue trolle, Pioche, Vouge", stars: 2, material: "Bois, Fer"}],
			[45, {name: "Arbalète lourde, Faux", stars: 4, material: "Bois, Fer"}],
			[50, {name: "Vorpale", stars: 5, material: null}],
			[60, {name: "Lance-feu", stars: 5, material: null}]
		])],
		["Armure", new Map([
			[3, {name: "Vêtement léger inconnu", stars: 0, material: "Cuir, Tissus"}],
			[5, {name: "Pagne en cuir", stars: 0, material: null}],
			[7, {name: "Vêtement lourd inconnu", stars: 0, material: "Cuir, Fer, Tissus, autre..."}],
			[12, {name: "Armure légère inconnue", stars: 1, material: "Cuir, Fer, autre..."}],
			[20, {name: "Armure intermédiaire inconnue", stars: 1, material: "Cuir, Fer, autre..."}],
			[40, {name: "Armure lourde inconnue", stars: 3, material: "Bois, Fer, Pierre, autre..."}],
			[60, {name: "Armure très lourde inconnue", stars: 2, material: "Fer, autre..."}]
		])],
		["Baguette", new Map([
			[3, {name: "Baguette inconnue", stars: 1, material: "Bois"}]
		])],
		["Bijou", new Map([
			[5, {name: "Bijou inconnu", stars: 3, material: null}]
		])],
		["Bottes", new Map([
			[3, {name: "Jambières en fourrure / Sandales", stars: 0, material: "Cuir, autre..."}],
			[5, {name: "Bottes", stars: 0, material: "Cuir"}],
			[15, {name: "Jambières lourdes inconnues", stars: 3, material: "Bois, Cuir, Fer, Pierre, autre..."}]
		])],
		["Bouclier", new Map([
			[5, {name: "Targe", stars: 0, material: null}],
			[10, {name: "Bouclier léger inconnu", stars: 3, material: "Bois, Cuir, Fer, Pierre, autre..."}],
			[20, {name: "Bouclier lourd inconnu", stars: 3, material: "Bois, Fer, Pierren autre..."}],
			[35, {name: "Bouclier à pointes", stars: 5, material: null}]
		])],
		["Casque", new Map([
			[3, {name: "Casque léger inconnu", stars: 0, material: "Cuir, Fer, Tissus, autre..."}],
			[7, {name: "Casque à cornes", stars: 0, material: null}],
			[10, {name: "Casque à pointes", stars: 3, material: null}],
			[15, {name: "Heaume", stars: 3, material: null}]
		])],
		["Talisman", new Map([
			[3, {name: "Talisman inconnu", stars: 2, material: "Bois  Fer, Pierre, autre..."}],
			[5, {name: "Gorgeron en métal", stars: 1, material: null}],
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
		])]
	]);
	nameToExpectedMaterial: Map<string, string> = new Map([
		["Anapside", ""],
		["Anneau Barbare", ""],
		["Anneau de Courage", ""],
		["Anneau de dureté", ""],
		["Anneau de Protection", ""],
		["Anneau de Sagesse", ""],
		["Anneau de Savoir", ""],
		["Anneau de voyage", ""],
		["Anneau Spirituel", ""],
		["Anneau Trollique", ""],

		["Crochet", "Fer"],
		["Dague", "Fer"],
		["Epée bâtarde", "Fer"],
		["Epée courte", "Fer"],
		["Epée de bois", "Bois"],
		["Epée longue", "Fer"],
		["Epieu", "Bois"],
		["Fléau d'armes", "Fer"],
		["Fouet", "Cuir"],
		["Gantelet", "Fer"],
		["Gourdin", "Bois"],
		["Gourdin clouté", "Bois"],
		["Griffes", "Fer"],
		["Grosse racine", "Bois"],
		["Hache d'armes", "Fer"],
		["Hache de guerre naine", "Fer"],
		["Hache de lancer", "Fer"],
		["Hachette", "Fer"],
		["Kama", "Fer"],
		["Lame", "Fer"],
		["Machette", "Fer"],
		["Marteau de guerre", "Bois"],
		["Masse d'arme", "Bois"],
		["Morgenstern", "Fer"],
		["Pic", "Fer"],
		["Torche", "Bois"],

		["Arbalète composite", "Bois"],
		["Arbalète légère", "Bois"],
		["Arbalète lourde", "Bois"],
		["Arc composite", "Bois"],
		["Arc court", "Bois"],
		["Arc long", "Bois"],
		["Baton de combat", "Fer"],
		["Bâton de feu", "Fer"],
		["Bâton lesté", "Bois"],
		["Bâtons de parade", "Bois"],
		["Chaîne cloutée", "Fer"],
		["Epée à deux mains", "Fer"],
		["Espadon", "Fer"],
		["Faux", "Fer"],
		["Grande hache", "Fer"],
		["Hache de bataille", "Fer"],
		["Hache de guerre", "Fer"],
		["Hachoir en bois", "Bois"],
		["Lance-feu", "Fer"],
		["Massue trolle", "Bois"],
		["Pioche", "Fer"],
		["Vorpale", "Fer"],
		["Vouge", "Fer"],

		["Cape", "Tissus"],
		["Culotte en cuir", "Cuir"],
		["Robe de sorcier", "Tissus"],
		["Tablier d'artisan", "Cuir"],
		["Tunique", "Tissus"],
		["Pagne en cuir", "Cuir"],
		["Cotte d'ouvrier", "Fer"],
		["Manteau de mage", "Tissus"],
		["Manteau de sorcier", "Tissus"],
		["Pagne de mailles", "Fer"],
		["Toge", "Tissus"],
		["Toison", "Cuir"],
		["Armure de cuir", "Cuir"],
		["Brigandine", "Cuir"],
		["Chemise d'Alowin", "Cuir"],
		["Plastron", "Fer"],
		["Chemise de mailles", "Fer"],
		["Cuir bouilli", "Cuir"],
		["Cuirasse", "Fer"],
		["Gambison", "Cuir"],
		["Tunique d'écailles", "Fer"],
		["Armure de bois", "Bois"],
		["Cotte de mailles", "Fer"],
		["Cuirasse d'écailles", "Fer"],
		["Armure d'anneaux", "Fer"],
		["Armure de plates", "Fer"],
		["Clibanion", "Fer"],
		["Crevice", "Fer"],
		["Haubert de mailles", "Fer"],

		["Baguette de Golbenstein", "Bois"],
		["Baguette de Tsoin Tsoin", "Bois"],
		["Baguette de Zénie", "Bois"],
		["Noire baguette", "Bois"],

		["Ankh Spectral", ""],
		["Bijou-Fétiche", ""],
		["Bijou-Totem", ""],
		["Breloques Familiales", ""],
		["Bricole d'Alowin", ""],
		["Collier des Anciens", ""],
		["Diadème Nébuleux", ""],
		["Fibule Champêtre", ""],
		["Magatama", ""],
		["Médaillon Protecteur", ""],
		["Menthalite", ""],
		["Pendentif-Chasseur", ""],
		["Phalère Epineuse", ""],
		["Tiare Obscure", ""],

		["Bottes", "Cuir"],
		["Jambières en bois", "Bois"],
		["Jambières en cuir", "Cuir"],
		["Jambières en mailles", "Fer"],
		["Jambières en métal", "Fer"],
		["Sandales", "Cuir"],

		["Targe", "Fer"],
		["Clipeus", "Cuir"],
		["Peltè", "Bois"],
		["Rondache en bois", "Bois"],
		["Aspis", "Bois"],
		["Ecu en bois", "Bois"],
		["Ecu en métal", "Fer"],
		["Rondache en métal", "Fer"],
		["Bouclier à pointes", "Fer"],

		["Bacinet", "Fer"],
		["Barbute", "Fer"],
		["Cagoule", "Tissus"],
		["Casque à cornes", "Fer"],
		["Casque à pointes", "Fer"],
		["Casque en cuir", "Cuir"],
		["Casque en métal", "Fer"],
		["Cerebro", "Fer"],
		["Chapeau pointu", "Tissus"],
		["Heaume", "Fer"],
		["Lorgnons", "Verre"],
		["Masque d'Alowin", "Tissus"],
		["Turban", "Tissus"],

		["Amulette magnétique ", ""],
		["Attrape-rêves", ""],
		["Aurine", ""],
		["Branches tressées", ""],
		["Cercle parfait", ""],
		["Colletin", ""],
		["Collier à fleurs", ""],
		["Collier à pointes", "Fer"],
		["Gorgerin", ""],
		["Gorgeron en cuir", "Cuir"],
		["Gorgeron en métal", "Fer"],
		["Jaseran", ""],
		["Mâlâ", ""],
		["Pectoral", ""],
		["Phylactère", ""],
		["Ruban d'Alowin", ""],

		["Aiguille", "Fer"],
		["Ciseau à bois", "Bois"],
		["Creuset", "Fer"],
		["Hache de bucheron", "Fer"],
		["Marteau de forgeron", "Fer"],
		["Marteau de joaillier", "Fer"],
		["Marteau de tailleur", "Pierre"],
		["Poinçon", "Fer"]
	]);
	nameToExpectedMaterialContains = [
		{name: "en Pierre", materiau: "Pierre"},
		{name: "en Obsidienne", materiau: "Obsidienne"},
		{name: "en Opale", materiau: "Opale"},
		{name: "en Saphir", materiau: "Saphir"},
		{name: "en Diamant", materiau: "Diamant"},
		{name: "en Emeraude", materiau: "Emeraude"},
		{name: "en Rubis", materiau: "Rubis"},
		{name: "en Adamantium", materiau: "Adamantium"},
		{name: "en Argent", materiau: "Argent"},
		{name: "en Cuivre", materiau: "Cuivre"},
		{name: "en Mithril", materiau: "Mithril"},
		{name: "en Or", materiau: "Or"},
		{name: "en Etain", materiau: "Etain"}
	];

	constructor(injector: Injector,
				private recyclageService: RecyclageService) {
		super(injector);
		this.recyclage = this.recyclageService.get()[0];
	}

	public get(force: boolean = false): Observable<GuildPlaceItemsTypings[]> {
		if (localStorage.getItem("guildplaceitems") && !force) {
			// console.log("get local");
			const json = JSON.parse(localStorage.getItem("guildplaceitems"));
			// this.enrichment(json);
			return Observable.of(json);
		} else {
			// console.log("get distant");
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
						json[i].Category = "Materiaux";
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

			// waight expectation
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

			// carats
			if (json[i].Taille && json[i].Matiere) {
				if (json[i].Matiere === "Bois") {
					json[i].Carats = json[i].Taille;
				} else {
					json[i].Carats = json[i].Taille * (json[i].Qualite ? this.carats.get(json[i].Qualite) : 3);
				}
			}

			// estimation carats
			if (["Équipement", "Outil"].indexOf(json[i].Category) > -1) {

				// material expectation
				let mat = json[i].Matiere;
				if (!mat) {
					mat = this.nameToExpectedMaterial.get(json[i].Nom);
					json[i].Matiere = mat;
				}
				if (!mat) {
					this.nameToExpectedMaterialContains.forEach((materialContained) => {
						if (json[i].Nom.indexOf(materialContained.name) > -1) {
							mat = materialContained.materiau;
							json[i].Matiere = mat;
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
						case "Bois":
							json[i].Carats = Math.max(1, Math.floor(json[i].Poids * 0.9 * factor));
							break;
						case "Cuir":
						case "Fer":
						case "Pierre":
						case "Tissus":
							json[i].Carats = Math.max(1, Math.floor(json[i].Poids * factor));
							break;
						case "":
						case null:
							json[i].Carats = null;
							break;
					}
				}
			}
		}
		return json;
	}
}
