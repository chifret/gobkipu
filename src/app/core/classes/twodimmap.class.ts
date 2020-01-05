import {ItemClass} from "./item.class";

export class Twodimmap {

	private map2: Map<number, Map<number, ItemClass>> = new Map();
	private map1: Map<number, ItemClass> = new Map();

	forEach(callBack: (hex: ItemClass) => any) {
		this.map2.forEach((value1) => {
			value1.forEach((value2) => {
				return callBack(value2);
			});
		});
	}

	get(posX: number, posY: number): ItemClass {
		try {
			return this.map2.get(posX).get(posY);
		} catch (Exception) {
			return null;
		}
	}

	getIndex(idx: number): ItemClass {
		try {
			return this.map1.get(idx);
		} catch (Exception) {
			return null;
		}
	}

	set(item: ItemClass): void {
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
			this.map2.get(item.posY).set(item.posY, item);

			if (item && !this.map1.get(item.num)) {
				this.map1.set(item.num, item);
			}
		}
	}
}
