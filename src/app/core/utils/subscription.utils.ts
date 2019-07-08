import {Subscription} from "rxjs";

export class SubscriptionUtils {

	static unsubs(subs: Subscription): boolean {
		if (subs) {
			try {
				subs.unsubscribe();
				return true;
			} catch (Exception) {
				return false;
			}
		}
		return false;
	}
}
