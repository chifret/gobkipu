import {Injectable, Injector} from "@angular/core";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/catch';
import { throwError } from 'rxjs';

import {Service} from "../service";
import {catchError, map} from "rxjs/operators";

@Injectable()
export class PlacesService extends Service {

	constructor(injector: Injector) {
		super(injector);
	}

	public getJSON(): Observable<any> {
		return this.http.get("assets/places.json")
			.pipe(map((res: any) => {
				return res;
			}))
			.pipe(catchError((error: any) => {
				return throwError(error.statusText);
			}));
	}
}
