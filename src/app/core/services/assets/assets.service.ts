import {Injectable, Injector} from "@angular/core";
import {Service} from "app/core/services/service";
import {Observable} from "rxjs";

@Injectable()
export class AssetssService extends Service {

	private namepartToItem: { name: string, material: string, value: number }[] = [];
	private nameToItem: Map<string, { material: string, value: number }> = new Map();
	private weightToItem: Map<string, Map<number, { name: string, value: number, material: string }>> = new Map();
	private materialpartToItem: { name: string, material: string, value: number }[] = [];

	constructor(injector: Injector) {
		super(injector);
	}

	public getNamepartToItem(): Observable<{ name: string, material: string, value: number }[]> {
		if (this.namepartToItem && this.namepartToItem.length > 0) {
			return Observable.of(this.namepartToItem);
		} else {
			return this.http.get("./assets/nameparttoitem.json")
				.map((res: any) => {
					this.namepartToItem = res;
					return this.namepartToItem;
				});
		}
	}

	public getNameToItem(): Observable<Map<string, { material: string, value: number }>> {
		if (this.namepartToItem && this.namepartToItem.keys.length > 0) {
			return Observable.of(this.nameToItem);
		} else {
			return this.http.get("./assets/nametoitem.json")
				.map((res: any) => {
					this.nameToItem = new Map(res);
					return this.nameToItem;
				});
		}
	}

	public getWeightToItem(): Observable<Map<string, Map<number, { name: string, value: number, material: string }>>> {
		if (this.namepartToItem && this.namepartToItem.length > 0) {
			return Observable.of(this.weightToItem);
		} else {
			return this.http.get("./assets/weighttoitem.json")
				.map((res: [string, [number, { name: string, value: number, material: string }][]][]) => {
					this.weightToItem = new Map<string, Map<number, { name: string, value: number, material: string }>>();
					res.forEach((cat) => {
						this.weightToItem.set(cat[0], new Map(cat[1]));
					});
					return this.weightToItem;
				});
		}
	}

	public getMaterialpartToItem(): Observable<{ name: string, material: string, value: number }[]> {
		if (this.materialpartToItem && this.materialpartToItem.length > 0) {
			return Observable.of(this.materialpartToItem);
		} else {
			return this.http.get("./assets/materialparttoitem.json")
				.map((res: any) => {
					this.materialpartToItem = res;
					return this.materialpartToItem;
				});
		}
	}
}
