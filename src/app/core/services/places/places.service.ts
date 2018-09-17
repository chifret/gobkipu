import { Injector, Injectable } from "@angular/core";
import 'rxjs/add/operator/map';import { Component, Input } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Service } from "../service";

@Injectable()
export class PlacesService extends Service {

	constructor(injector: Injector) {
		super(injector);
	}

    public getJSON(): Observable<any> {
        return this.http.get("assets/places.json")
                        .map((res:any) => {
                            return res;
                        })
                        .catch((error:any) => {
                            return Observable.throw(error.statusText);
                        });
    }
}
