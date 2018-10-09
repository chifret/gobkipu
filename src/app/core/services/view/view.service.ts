import { Injector, Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Service } from "../service";
import { CsvUtils } from "../../utils/csv.utils";
import { ViewTyping } from "../../typings/view.typings";
import {LoginService} from "../login.service";

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
          const token = LoginService.getToken();
          if (token) {
            return this.http.get("https://www.chifret.be/gobkipu/services/view.php?key=" + token.clan + "&id=" + token.id+"&id_view=" + id, { responseType: 'text' })
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
}
