import { Injector, Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Service } from "../service";
import { CsvUtils } from "../../utils/csv.utils";
import { MeuteMembresTyping } from "../../typings/meutemembres.typing";

@Injectable()
export class MeuteService extends Service {

    numerics = ["CT", "Id", "IdMeute", "N", "Niveau", "PA", "PI", "PV", "PX", "PXPerso", "X", "Y", "Z"];
    floats = [];
    dates = ["DLA"];

    constructor(injector: Injector) {
        super(injector);
    }

    public get(force: boolean = false): Observable<MeuteMembresTyping[]> {
        if (localStorage.getItem("meutemembres") && !force) {
            console.log("get local");
            return Observable.of(JSON.parse(localStorage.getItem("meutemembres")));
        } else {
            console.log("get distant");
            return this.http.get("https://www.chifret.be/gobkipu/services/teamprofile.php?key=07b5ad969d30132370342bbd3831fc3a&id=332", { responseType: 'text' })
                .map((res: any) => {
                    const json = CsvUtils.getJson<MeuteMembresTyping>(res, this.numerics, this.floats, this.dates);
                    localStorage.setItem("meutemembres", JSON.stringify(json));
                    return json;
                });
        }
    }
}
