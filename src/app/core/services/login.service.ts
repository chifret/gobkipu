import {Observable} from "rxjs/Observable";
import {Service} from "./service";
import {Injectable, Injector} from "@angular/core";

@Injectable()
export class LoginService extends Service {

	constructor(injector: Injector) {
		super(injector);
	}

	login(token: { id: number, clan: string, meute: string }): Observable<boolean> {
		localStorage.setItem("token", JSON.stringify(token));

		const params = new FormData();
		params.set("id", token.id.toString());
		params.set("team", token.meute);
		params.set("guild", token.clan);

		return this.http.get("https://www.chifret.be/gobkipu/services/updatePass.php?id=" + token.id + "&team=" + token.meute + "&guild=" + token.clan, {
			headers: {
				"Content-Type": "application/form-data"
			},
			responseType: "text"
		})
			.map((res: any) => {
				return (res === " OK");
			});
	}

	static getToken(): { id: number, clan: string, meute: string } {
		if (localStorage.getItem("token")) {
			return JSON.parse(localStorage.getItem("token"));
		} else {
			return null;
		}
	}

	static isConnected(): boolean {
		if (localStorage.getItem("token")) {
			const token: { id: number, clan: string, meute: string } = JSON.parse(localStorage.getItem("token"));
			if (token.id && (token.clan || token.meute)) {
				return true;
			}
		}
		return false;
	}

	static logout(): void {
		localStorage.setItem("token", null);
	}

}
