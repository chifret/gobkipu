import { Injector, Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Service } from "../service";
import { CsvUtils } from "../../utils/csv.utils";
import { ViewTyping } from "../../typings/view.typings";

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
            console.log("get local");
            return Observable.of(JSON.parse(localStorage.getItem("view-" + id)));
        } else {
            console.log("get distant");
            return this.http.get("https://www.chifret.be/gobkipu/services/view.php?key=654236304fba843f804c404aa868df39&id=" + id, { responseType: 'text' })
                .map((res: any) => {
                    const json = CsvUtils.getJson<ViewTyping>(res, this.numerics, this.floats, this.dates);
                    localStorage.setItem("view-" + id, JSON.stringify(json));
                    return json;
                });
        }
    }
}
