"use strict";

import { Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export class Service {
    protected http: HttpClient;
    constructor(injector: Injector) {
        this.http = injector.get(HttpClient);
    }

    /*protected httpRequest(onlyName: boolean, filterDefinition: string = null): Observable<any> {
        const params = new URLSearchParams();
        if (onlyName !== undefined && onlyName !== null && onlyName) {
            params.set("$select", this.requiredFields.join(","));
        }
        if (filterDefinition !== null && filterDefinition !== undefined) {
            params.set("$filter", filterDefinition);
        }
        const requestOptions = new RequestOptions();
        requestOptions.params = params;
        requestOptions.headers = new Headers({
            Authorization: `Basic ${this.tokenService.token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache"
        });
        return this.http
            .get(this.url + "/" + this.urlExtension, requestOptions)
            .filter(data => data !== undefined);
    }

    protected addFilter(filterDefinition: string, filter: string): string {
        if (!filterDefinition) {
            filterDefinition = "";
        }
        filterDefinition += (filterDefinition !== "" ? " and " : "") + filter;
        return filterDefinition;
    }*/
}
