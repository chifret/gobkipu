import {Injectable, Injector} from "@angular/core";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { throwError } from 'rxjs';

import {Service} from "../service";

@Injectable()
export class PlacesService extends Service {

	constructor(injector: Injector) {
		super(injector);
	}

	public getJSON(): Observable<any> {
		return this.http.get("assets/places.json")
			.map((res: any) => {
				return res;
			})
			.catch((error: any) => {
				return throwError(error.statusText);
			});
	}
}
