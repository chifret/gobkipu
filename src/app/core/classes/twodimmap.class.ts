import {ItemClass} from "./item.class";

export class Twodimmap<T extends ItemClass> {

	private map2: Map<number, Map<number, Map<number, T>>> = new Map();
	private map1: Map<number, T> = new Map();

	// don't use that
	forEach(callBack: (hex: T) => any) {
		this.map2.forEach((value1) => {
			value1.forEach((value2) => {
				value2.forEach((value3) => {
				return callBack(value3);
				});
			});
		});
	}

	get(posX: number, posY: number): Map<number, T> {
		try {
			return this.map2.get(posX).get(posY);
		} catch (Exception) {
			return null;
		}
	}

	getIndex(idx: number): T {
		try {
			return this.map1.get(idx);
		} catch (Exception) {
			return null;
		}
	}

	set(item: T): void {
		if (!item) {
			throw new Error("item null");
		}

		if (!this.map1.get(item.num)) {

			// map1
			this.map1.set(item.num, item);

			// map2
			if (!this.map2.get(item.posX)) {
				this.map2.set(item.posX, new Map());
			}
			if (!this.map2.get(item.posX).get(item.posY)) {
				this.map2.get(item.posX).set(item.posY, new Map());
			}
			this.map2.get(item.posX).get(item.posY).set(item.num, item);

			if (item && !this.map1.get(item.num)) {
				this.map1.set(item.num, item);
			}
		}
	}
}
