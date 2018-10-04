import {Injector, Injectable} from "@angular/core";
import {Observable} from 'rxjs/Rx';

import {Service} from "../service";
import {CsvUtils} from "../../utils/csv.utils";
import {GuildPlaceItemsTypings} from "../../typings/guildplaceitems.typings";

@Injectable()
export class GuildplacesService extends Service {

  numerics = ["Id", "Poids", "Prix", "Qualite", "Taille"];
  floats = [];
  dates = [];
  booleans = ["Identifie"];
  carats = new Map([
    [1, 2],
    [2, 2.75],
    [3, 3.5],
    [4, 4.25],
    [5, 5],
    [-1, 1]
  ]);
  WeightToExpected = new Map([
    ["Outil", new Map([
      [1, {name: "Aiguille", stars: 0}],
      [2, {name: "Poinçon", stars: 0}],
      [3, {name: "Marteau de joaillier", stars: 0}],
      [5, {name: "Ciseau à bois", stars: 0}],
      [20, {name: "Marteau de forgeron / de tailleur", stars: 0}],
      [40, {name: "Hache de bûcheron", stars: 3}],
      [60, {name: "Creuset", stars: 0}]
    ])],
    ["Anneau", new Map([
      [2, {name: "Anneau standard", stars: 3}]
    ])],
    ["Arme 1 Main", new Map([
      [5, {name: "Coutelas (os, pierre) / Corchet / Dague / Griffes / Racine / Torche", stars: 1}],
      [7.5, {name: "Epée de bois / Fouet / Gantelet", stars: 4}],
      [10, {name: "Epée courte / Hachette / Gourdin", stars: 0}],
      [15, {name: "Cimeterre en pierre / Épieu / Gourdin clouté / Hache de lancer / Kama / Lame / Lame d'os / Machette / Pic", stars: 2}],
      [20, {name: "Épée longue / Hache d'armes / Masse d'armes", stars: 0}],
      [25, {name: "Fléau d'armes", stars: 0}],
      [30, {name: "Épée bâtarde / Hache de guerre naine / Marteau de guerre / Morgenstern", stars: 1}]
    ])],
    ["Arme 2 mains", new Map([
      [8, {name: "Bâton lesté / Bâtons de parade", stars: 0}],
      [10, {name: "Arc court", stars: 3}],
      [15, {name: "Arc composite / Arc long / Bâton de combat / Hachoir en bois", stars: 4}],
      [20, {name: "Bâton de feu", stars: 5}],
      [30, {name: "Arbalète légère / Épée à deux mains / Grande hache / Hache de bataille / de guerre / en os", stars: 3}],
      [35, {name: "Arbalète composite / Chaîne cloutée", stars: 4}],
      [40, {name: "Massue trolle, Pioche, Vouge", stars: 2}],
      [45, {name: "Arbalète lourde, Faux", stars: 4}],
      [50, {name: "Vorpale", stars: 5}],
      [60, {name: "Lance-feu", stars: 5}]
    ])],
    ["Armure", new Map([
      [3, {name: "Vêtement léger", stars: 0}],
      [5, {name: "Pagne en cuir", stars: 0}],
      [7, {name: "Vêtement lourd", stars: 0}],
      [12, {name: "Armure légère", stars: 1}],
      [20, {name: "Armure intermédiaire", stars: 1}],
      [40, {name: "Armure lourde", stars: 3}],
      [60, {name: "Armure très lourde", stars: 2}]
    ])],
    ["Baguette", new Map([
      [3, {name: "Baguette standard", stars: 1}]
    ])],
    ["Bijou", new Map([
      [5, {name: "Bijou standard", stars: 3}]
    ])],
    ["Bottes", new Map([
      [3, {name: "Jambières en fourrure / Sandales", stars: 0}],
      [5, {name: "Bottes", stars: 0}],
      [15, {name: "Jambières lourdes", stars: 3}]
    ])],
    ["Bouclier", new Map([
      [5, {name: "Targe", stars: 0}],
      [10, {name: "Bouclier léger", stars: 3}],
      [20, {name: "Bouclier lourd", stars: 3}],
      [35, {name: "Bouclier à pointes", stars: 5}]
    ])],
    ["Casque", new Map([
      [3, {name: "Casque léger", stars: 0}],
      [7, {name: "Casque à cornes", stars: 0}],
      [10, {name: "Casque à pointes", stars: 3}],
      [15, {name: "Heaume", stars: 3}]
    ])],
    ["Talisman", new Map([
      [3, {name: "Talisman standard", stars: 2}],
      [5, {name: "Gorgeron en métal", stars: 1}],
      [6, {name: "Collier de dents", stars: 0}]
    ])]
  ])
  NameToExpectedMaterial = new Map([
    ["", ""]
  ])

  constructor(injector: Injector) {
    super(injector);
  }

  public get(force: boolean = false): Observable<GuildPlaceItemsTypings[]> {
    if (localStorage.getItem("guildplaceitems") && !force) {
      console.log("get local");
      const json = JSON.parse(localStorage.getItem("guildplaceitems"));
      return Observable.of(json);
    } else {
      console.log("get distant");
      return this.http.get("https://www.chifret.be/gobkipu/services/guildplace.php?key=654236304fba843f804c404aa868df39&id=332", {responseType: 'text'})
        .map((res: any) => {
          const json = CsvUtils.getJson<GuildPlaceItemsTypings>(res, this.numerics, this.floats, this.dates, this.booleans);
          this.enrichment(json);
          localStorage.setItem("guildplaceitems", JSON.stringify(json));
          return json;
        });
    }
  }

  private enrichment(json: GuildPlaceItemsTypings[]): GuildPlaceItemsTypings[] {
    for (let i = 0; i < json.length; i++) {
      if (json[i].Type === "Matériau" && !json[i].Qualite) {
        json[i].Qualite = -1;
      }
      if (json[i].Qualite && !(["Composant", "Fleur"].indexOf(json[i].Type) > -1)) {
        if (!json[i].Matiere) {
          json[i].Matiere = json[i].Nom === "Rondin" ? "Bois" : json[i].Nom;
        }
        json[i].Category = "Matériaux";
        json[i].Carats = json[i].Taille * this.carats.get(json[i].Qualite);
        json[i].Desc = null;
      } else if (["Nourriture", "Potion", "Outil", "Corps"].indexOf(json[i].Type) > -1) {
        json[i].Category = json[i].Type;
        if (!(json[i].Type === "Potion")) {
          json[i].Desc = null;
        }
        if (["Nourriture", "Potion", "Outil"].indexOf(json[i].Type) > -1) {
          json[i].Taille = null;
        }
      } else if (["Fleur", "Composant"].indexOf(json[i].Type) > -1) {
        json[i].Category = "Compo & Fleurs";
        json[i].Desc = null;
      } else {
        json[i].Category = "Équipement";
        json[i].Taille = null;
        if (json[i].Matiere) {
          json[i].Nom = json[i].Nom + " en " + json[i].Matiere;
          json[i].Matiere = null;
        }
      }
      if (json[i].Poids) {
        json[i].Poids = Math.round((json[i].Poids / 60) * 100) / 100;
      }

      if (!json[i].Identifie && ["Équipement", "Outil"].indexOf(json[i].Category) > -1) {
        if (this.WeightToExpected.get(json[i].Type)) {
          if (this.WeightToExpected.get(json[i].Type).get(json[i].Poids)) {
            json[i].Expected = this.WeightToExpected.get(json[i].Type).get(json[i].Poids).name;
            json[i].Stars = this.WeightToExpected.get(json[i].Type).get(json[i].Poids).stars;
          } else {
            json[i].Expected = "???";
            json[i].Stars = 5;
          }
        } else {
          //console.log("Weight to expected " + json[i].Type + " not done");
        }
      }
    }
    return json;
  }
}
