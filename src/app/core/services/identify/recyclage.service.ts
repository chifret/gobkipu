import {Injectable} from "@angular/core";
import {JsonUtils} from "../../utils/json.utils";

@Injectable()
export class RecyclageService {

	dates = [];

	get(): { niveau: number, atelier: boolean, crochetGriffe: boolean } [] {
		if (localStorage.getItem("recyclage")) {
			console.log("get local");
			return JsonUtils.parse<{ niveau: number, atelier: boolean, crochetGriffe: boolean }>(localStorage.getItem("meutemembres"), this.dates);
		} else {
			let json = [{niveau: 1, atelier: false, crochetGriffe: false}];
			localStorage.setItem("recyclage", JSON.stringify(json));
			return json;
		}
	}

	set(json: { niveau: number, atelier: number, crochetGriffe: number }): void {
		localStorage.setItem("recyclage", JSON.stringify([json]));
	}
}
