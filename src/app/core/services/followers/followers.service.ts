import {Injectable, Injector} from "@angular/core";
import {Service} from "app/core/services/service";

@Injectable()
export class FollowersService extends Service {

	constructor(injector: Injector) {
		super(injector);
	}

	getGobUsualView(): number {
		if (localStorage.getItem("gobusualview")) {
			return parseInt(localStorage.getItem("gobusualview"));
		} else {
			return null;
		}
	}

	setGobUsualView(view: number): void {
		localStorage.setItem("gobusualview", view.toString());
	}

	getFollowerUsualView(): number {
		if (localStorage.getItem("followerusualview")) {
			return parseInt(localStorage.getItem("followerusualview"));
		} else {
			return null;
		}
	}

	setFollowerUsualView(view: number): void {
		localStorage.setItem("followerusualview", view.toString());
	}
}
