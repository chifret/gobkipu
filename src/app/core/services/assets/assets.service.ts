import {Injectable, Injector} from "@angular/core";
import {Service} from "app/core/services/service";
import {Observable} from "rxjs";

@Injectable()
export class AssetssService extends Service {

	private namePartToMatrial: { name: string, material: string, value: number }[] = [];
	private nameToMaterial: Map<string, { material: string, value: number }> = new Map([]);

	constructor(injector: Injector) {
		super(injector);
	}

	public getNamePartToMatrial(): Observable<{ name: string, material: string, value: number }[]> {
		if (this.namePartToMatrial && this.namePartToMatrial.length > 0) {
			return Observable.of(this.namePartToMatrial);
		} else {
			return this.http.get("./assets/nameparttomaterial.json")
				.map((res: any) => {
					this.namePartToMatrial = res;
					return this.namePartToMatrial;
				});
		}
	}

	public getNameToMatrial(): Observable<Map<string, { material: string, value: number }>> {
		if (this.namePartToMatrial && this.namePartToMatrial.keys.length > 0) {
			return Observable.of(this.nameToMaterial);
		} else {
			return this.http.get("./assets/nametomaterial.json")
				.map((res: any) => {
					this.nameToMaterial = new Map(res);
					return this.nameToMaterial;
				});
		}
	}
}
