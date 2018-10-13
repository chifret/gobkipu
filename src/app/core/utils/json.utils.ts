export class JsonUtils {

	static parse<T>(json: string, dates: string[]): T[] {
		let val = JSON.parse(json);
		for (let key1 in val) {
			for (let key2 in val[key1]) {
				if (dates.indexOf(key2) > -1) {
					val[key1][key2] = new Date(val[key1][key2]);
				}
			}
		}
		return val;
	}
}