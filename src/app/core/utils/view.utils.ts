export class ViewUtils {

	static getPath(
		map: Map<number, { x: number, y: number, n: number }>,
		startPosal: { x: number, y: number, n: number } = {x: 0, y: 0, n: 0}
	): { id: number, posal: { x: number, y: number, n: number } }[] {

		const posals: { id: number, posal: { x: number, y: number, n: number } }[] = [];
		const origins = {o1: startPosal, o2: startPosal};
		const originMid = startPosal;

		let i = 0;
		while (map.size > 0 && i < 100) {
			const closest = {id: null, dist: null, posal: {x: null, y: null, n: null}};
			map.forEach((item, id) => {
				const dist = ViewUtils.getDist(originMid, item);
				if (closest.dist == null || closest.dist > dist) {
					closest.id = id;
					closest.dist = dist;
					closest.posal = {x: item.x, y: item.y, n: item.n};
				}
			});
			posals.push({id: closest.id, posal: closest.posal});
			map.delete(closest.id);
			origins.o2 = origins.o1;
			origins.o1 = closest.posal;
			originMid.x = (origins.o1.x + origins.o2.x) / 2;
			originMid.y = (origins.o1.y + origins.o2.y) / 2;
			originMid.n = (origins.o1.n + origins.o2.n) / 2;
			i++;
		}
		return posals;
	}

	static getDist(a: { x: number, y: number, n: number }, b: { x: number, y: number, n: number }): number {
		return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.n - b.n));
	}
}
