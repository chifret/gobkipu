export class CsvUtils {

	static trueValues = ["VRAI", "TRUE"];

	static getJson<T>(csv: string, ints: string[], floats: string[], dates: string[], booleans: string[]): T[] {
		const lines = csv.split("\n");
		let result = [];
		let headers = lines[0].substr(1, lines[0].length).split(";");

		for (let i = 0; i < headers.length; i++) {
			headers[i] = headers[i].replace(/^\"+|\"+$/g, '');
		}

		for (let i = 1; i < lines.length; i++) {
			let obj = {};
			//let obj = new T();
			const currentline = lines[i].split(";");
			if (currentline.length > 1) {
				for (let j = 0; j < headers.length; j++) {



					// TODO would be better to use generic object but it doesn't want to (as beeing static class, damnit)
					/*if (obj[headers[j]] instanceof Date) {
						obj[headers[j]] = new Date(currentline[j].replace(/^\"+|\"+$/g, ''));
					} else {
						switch (typeof obj[headers[j]]) {
							case "number":
								obj[headers[j]] = parseFloat(currentline[j].replace(/^\"+|\"+$/g, ''));
								break;
							default:
								obj[headers[j]] = currentline[j].replace(/^\"+|\"+$/g, '');
								break;
						}
					}*/


					if (ints.indexOf(headers[j]) > -1) {
						obj[headers[j]] = parseInt(currentline[j].replace(/^\"+|\"+$/g, '')) || 0;
					} else if (ints.indexOf(headers[j]) > -1) {
						obj[headers[j]] = parseFloat(currentline[j].replace(/^\"+|\"+$/g, '')) || null;
					} else if (dates.indexOf(headers[j]) > -1) {
						obj[headers[j]] = new Date(currentline[j].replace(/^\"+|\"+$/g, '')) || null;
					} else if (booleans.indexOf(headers[j]) > -1) {
						obj[headers[j]] = (CsvUtils.trueValues.indexOf(currentline[j].replace(/^\"+|\"+$/g, '').toUpperCase().trim()) > -1)
					}
					else {
						obj[headers[j]] = currentline[j].replace(/^\"+|\"+$/g, '');
					}
				}
				result.push(obj);
			}
		}
		return result;
	}
}