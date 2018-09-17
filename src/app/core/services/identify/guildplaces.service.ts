import { Injector, Injectable } from "@angular/core";
import 'rxjs/add/operator/map';
import { Component, Input } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Service } from "../service";

@Injectable()
export class GuildplacesService extends Service {

    constructor(injector: Injector) {
        super(injector);
    }

    public getJSON(): Observable<any> {
        return this.http.get("https://www.chifret.be/gobkipu/services/guildplace.php?key=e618f823c1948db83494380d35dee07d04dabfbc&id=332")
            .map((res: any) => {
                return res.json();
            })
            .catch((error: any) => {
                return Observable.throw(error.statusText);
            });
    }
}
