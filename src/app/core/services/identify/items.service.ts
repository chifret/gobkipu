import {Injectable, Injector} from "@angular/core";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

import {Service} from "../service";
import {throwError} from "rxjs";

@Injectable()
export class ItemsService extends Service {

	constructor(injector: Injector) {
		super(injector);
	}

	public getJSON(): Observable<any> {
		return this.http.get("assets/items.json")
			.map((res: any) => {
				return res.json();
			})
			.catch((error: any) => {
				return throwError(error.statusText);
			});
	}
}
