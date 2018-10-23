import {DlastateEnum} from "../../enums/dlastate.enum";
import {PastateEnum} from "../../enums/pastate.enum";

export class DlaUtils {

	static getNextDlas(dla: Date, duration: number, pas: number, now = new Date()): {
		dlaState: DlastateEnum,
		paState: PastateEnum,
		dla: { date: Date, cumulable: boolean },
		nextDla: { date: Date },
	} {
		const item: {
			dlaState: DlastateEnum,
			paState: PastateEnum,
			dla: { date: Date, cumulable: boolean },
			nextDla: { date: Date }
		} = {
			dlaState: DlastateEnum.Regular,
			paState: null,
			dla: {date: dla, cumulable: false},
			nextDla: {date: null}
		};

		item.nextDla.date = new Date(item.dla.date.getTime() + (1000 * duration));
		console.log(item.nextDla.date.getDay());
		if (item.dla.date.getDay() === 5) {
			// vendredi
			if (item.nextDla.date.getDay() === 6) {
				// dla d'après samedi
				if (now.getDay() === 5) {
					item.dlaState = DlastateEnum.WaitForMidnight;
				} else {
					item.dlaState = DlastateEnum.Shortened;
				}
				item.dla.cumulable = true;
				item.nextDla.date = new Date(item.dla.date.getTime() + (500 * duration));
			} else if (
				new Date(item.nextDla.date.getTime() + (500 * duration)).getDay() === 6
				|| (
				new Date(item.nextDla.date.getTime() + (1500 * duration)).getDay() === 6
				&& new Date(item.nextDla.date.getTime() + (1000 * duration)).getDay() != 6)
			) {
				item.dlaState = DlastateEnum.ShouldDelayAtMidnight;
				item.dla.cumulable = false;
			}
		} else if (item.dla.date.getDay() > 5 || item.dla.date.getDay() == 0) {
			// samedi ou dimanche
			if (item.nextDla.date.getDay() < 6 && item.nextDla.date.getDay() > 0) {
				item.dlaState = DlastateEnum.ShouldActivateBeforeMidnight
			} else {
				item.dlaState = DlastateEnum.Shortened;
			}
			item.dla.cumulable = true;
			item.nextDla.date = new Date(item.dla.date.getTime() + (500 * duration));
		}

		const diffNextDla = (item.nextDla.date.getTime() - now.getTime()) / 60000;
		if (now.getTime() > item.dla.date.getTime()) {
			if (item.dla.cumulable && (item.dla.date.getDay() > 5 || item.dla.date.getDay() == 0)) {
				let nextNextDla = new Date(item.nextDla.date.getTime() + (500 * duration));
				const diffNextNextDla = (nextNextDla.getTime() - now.getTime()) / 60000;
				if (diffNextNextDla <= 30) {
					item.paState = PastateEnum.CumulableVeryUrgent;
				} else if (diffNextNextDla <= 90) {
					item.paState = PastateEnum.CumulableUrgent;
				} else if (diffNextDla <= 0 && diffNextNextDla >= 0) {
					item.paState = PastateEnum.Cumulable;
				} else if (diffNextDla > 0) {
					item.paState = PastateEnum.Usable;
				}
			} else if (diffNextDla > 0) {
				if (diffNextDla <= 30) {
					item.paState = PastateEnum.VeryUrgent;
				} else if (diffNextDla <= 90) {
					item.paState = PastateEnum.Urgent;
				} else {
					item.paState = PastateEnum.Usable;
				}
			}
		} else if (pas > 0) {
			item.paState = PastateEnum.Usable;
		}

		return item;
	}
}