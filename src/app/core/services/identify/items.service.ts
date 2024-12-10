import {Injectable, Injector} from "@angular/core";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/catch';

import {Service} from "../service";
import {throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable()
export class ItemsService extends Service {

	constructor(injector: Injector) {
		super(injector);
	}

	public getJSON(): Observable<any> {
		return this.http.get("assets/items.json")
			.pipe(map((res: any) => {
				return res.json();
			}))
			.pipe(catchError((error: any) => {
				return throwError(error.statusText);
			}));
	}
}
