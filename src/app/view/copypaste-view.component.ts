import {Component, ElementRef, ViewChild} from "@angular/core";
import {ViewComponent} from "../core/components/view/view.component";
import {ViewableClass} from "../core/classes/viewable.class";
import {CreaturetypesUtils} from "../core/utils/business/creaturetypes.utils";
import {CreatureClass} from "../core/objects/creature.class";
import {Twodimmap} from "../core/classes/twodimmap.class";
import {TresorClass} from "../core/objects/tresor.class";
import {LieuxClass} from "../core/objects/lieux.class";
import {PlanteClass} from "../core/objects/plante.class";

@Component({
	selector: "copypaste-view-component",
	templateUrl: "./copypaste-view.component.html"
})
export class CopyPasteViewComponent {

	processed = false;
	viewable: ViewableClass;

	@ViewChild("textarea", {static: false}) textarea: ElementRef;
	@ViewChild("viewComponent", {static: true}) viewComponent: ViewComponent;

	view(): void {
		const lines = (this.textarea.nativeElement as HTMLTextAreaElement).value
			.replace(/Ã©/g, "é")
			.replace(/Ã/g, "à")
			.split("\n");

		this.viewable = new ViewableClass(
			{
				avgPosN: null,
				minX: null,
				maxX: null,
				minY: null,
				maxY: null,
				minN: null,
				maxN: null
			},
			new Twodimmap<CreatureClass>(),
			new Twodimmap<CreatureClass>(),
			new Twodimmap<TresorClass>(),
			new Twodimmap<LieuxClass>(),
			new Twodimmap<PlanteClass>()
		);
		let posX = null;
		let posY = null;
		let posN = null;
		let horiz = 0;
		let verti = 0;

		let current: string = null;
		lines.forEach(line => {
			line = line.trim();
			if (line === "") {
				return;
			}
			let goOn = true;
			if (line.indexOf("Créatures | Trésors | Lieux") > 5) {
				current = line.substr(0, line.indexOf("\t")).trim();
				goOn = false;
			}
			if (goOn) {
				switch (current) {
					case null:
						if (line.indexOf("a position actuelle est ") > -1) {
							let isFollower = false;
							if (line.indexOf("Sa position actuelle est ") > -1) {
								isFollower = true;
							}
							line = line.substr(31, line.length);
							posX = parseInt(line.substr(0, line.indexOf(",")), 10);
							line = line.substr(line.indexOf(",") + 6, line.length);
							posY = parseInt(line.substr(0, line.indexOf(",")), 10);
							line = line.substr(line.indexOf(",") + 6, line.length);
							posN = parseInt(line.substr(0, line.length), 10);
							const creatureTmp = new CreatureClass();
							creatureTmp.dist = -1;
							creatureTmp.num = -1;
							creatureTmp.level = 0;
							creatureTmp.race = "Créature mécanique";
							creatureTmp.name = "YOU";
							creatureTmp.posX = posX;
							creatureTmp.posY = posY;
							creatureTmp.posN = posN;
							if (isFollower) {
								creatureTmp.type = 0;
								this.viewable.creatures.set(creatureTmp);
							} else {
								creatureTmp.type = 1;
								this.viewable.gobelins.set(creatureTmp);
							}
						} else if (line.indexOf("L'affichage est limité à ") > -1) {
							line = line.substr(25, line.length);
							horiz = parseInt(line.substr(0, line.indexOf("cases horizontalement") - 1), 10);
							verti = parseInt(line.substr(line.indexOf("cases horizontalement") + 24, line.indexOf("verticalement") - 28), 10);
						} else if (line.indexOf("Sa vue porte à ") > -1) {
							line = line.substr(15, line.length);
							horiz = parseInt(line.substr(0, line.indexOf("cases horizontalement") - 1), 10);
							verti = parseInt(line.substr(line.indexOf("cases horizontalement") + 24, line.indexOf("verticalement") - 28), 10);
						}
						break;
					case "Créatures":
						this.parseCreature(line);
						break;
					case "Trésors":
						this.parseTresor(line);
						break;
					case "Lieux/Décors":
						this.parseLieux(line);
						break;
					case "Plantes":
						this.parsePlantes(line);
						break;
				}
			}
		});
		this.setPos(posX - horiz, posY - horiz, posN);
		this.setPos(posX + horiz, posY + horiz, posN);
		this.viewable.position.avgPosN = posN;
		this.viewComponent.renderView(this.viewable);
		this.processed = true;

		console.log(this.viewable);
	}

	// reset(): void {
	// 	// 	this.processed = false;
	// 	// 	(this.textarea.nativeElement as HTMLTextAreaElement).innerHTML = "";
	// 	// }

	private parseCreature(line: string): void {
		try {
			const cols = CopyPasteViewComponent.lineSplit(line);
			let x: number;
			let y: number;
			let n: number;
			if (cols.length === 9) {
				// gob view
				const id = CopyPasteViewComponent.getNameAndNum(cols[2]);
				if (!id.num) {
					return;
				}
				x = parseInt(cols[6], 10);
				y = parseInt(cols[7], 10);
				n = parseInt(cols[8], 10);
				if (CreaturetypesUtils.creatureIsGob(cols[4], id.num)) {
					this.viewable.gobelins.set({
						dist: parseInt(cols[0], 10), level: parseInt(cols[3], 10), name: id.name, num: id.num, type: 1, race: cols[4], clan: cols[5],
						posX: x, posY: y, posN: n, visible: true
					});
				} else {
					this.viewable.creatures.set({
						dist: parseInt(cols[0], 10), level: parseInt(cols[3], 10), name: id.name, num: id.num, type: 0, race: cols[4], clan: cols[5],
						posX: x, posY: y, posN: n, visible: true
					});
				}
			} else {
				// follower view
				const id = CopyPasteViewComponent.getNameAndNum(cols[1]);
				if (!id.num) {
					return;
				}
				x = parseInt(cols[4], 10);
				y = parseInt(cols[5], 10);
				n = parseInt(cols[6], 10);
				if (CreaturetypesUtils.creatureIsGob(cols[3], id.num)) {
					this.viewable.gobelins.set({
						dist: parseInt(cols[0], 10), level: parseInt(cols[2], 10), name: id.name, num: id.num, type: 1, race: cols[3], clan: null,
						posX: x, posY: y, posN: n, visible: true
					});
				} else {
					this.viewable.creatures.set({
						dist: parseInt(cols[0], 10), level: parseInt(cols[2], 10), name: id.name, num: id.num, type: 0, race: cols[3], clan: null,
						posX: x, posY: y, posN: n, visible: true
					});
				}
			}
			this.setPos(x, y, n);
		} catch (e) {
			return null;
		}
	}

	private parseTresor(line: string): void {
		try {
			const cols = CopyPasteViewComponent.lineSplit(line);
			if (!parseInt(cols[1], 10)) {
				return;
			}
			const x = parseInt(cols[3], 10);
			const y = parseInt(cols[4], 10);
			const n = parseInt(cols[5], 10);
			this.viewable.tresors.set({
				dist: parseInt(cols[0], 10), name: cols[2], num: parseInt(cols[1], 10),
				posX: x, posY: y, posN: n, value: null, visible: true
			});
			this.setPos(x, y, n);
		} catch (e) {
			return null;
		}
	}

	private parseLieux(line: string): void {
		try {
			const cols = CopyPasteViewComponent.lineSplit(line);
			if (!parseInt(cols[1], 10)) {
				return;
			}
			const x = parseInt(cols[4], 10);
			const y = parseInt(cols[5], 10);
			const n = parseInt(cols[6], 10);
			this.viewable.lieux.set({
				dist: parseInt(cols[0], 10), name: cols[2], num: parseInt(cols[1], 10), type: cols[3],
				posX: x, posY: y, posN: n, visible: true
			});
			this.setPos(x, y, n);
		} catch (e) {
			return null;
		}
	}

	private parsePlantes(line: string): void {
		try {
			const cols = CopyPasteViewComponent.lineSplit(line);
			if (!parseInt(cols[1], 10)) {
				return;
			}
			const x = parseInt(cols[3], 10);
			const y = parseInt(cols[4], 10);
			const n = parseInt(cols[5], 10);
			this.viewable.plantes.set({
				dist: parseInt(cols[0], 10), name: cols[2], num: parseInt(cols[1], 10),
				posX: x, posY: y, posN: n, visible: true
			});
			this.setPos(x, y, n);
		} catch (e) {
			return null;
		}
	}

	// noinspection DuplicatedCode
	private setPos(x: number, y: number, n: number): void {
		if (!this.viewable.position.minX || x < this.viewable.position.minX) {
			this.viewable.position.minX = x;
		}
		if (!this.viewable.position.maxX || x > this.viewable.position.maxX) {
			this.viewable.position.maxX = x;
		}
		if (!this.viewable.position.minY || y < this.viewable.position.minY) {
			this.viewable.position.minY = y;
		}
		if (!this.viewable.position.maxY || y > this.viewable.position.maxY) {
			this.viewable.position.maxY = y;
		}
		if (!this.viewable.position.minN || n < this.viewable.position.minN) {
			this.viewable.position.minN = n;
		}
		if (!this.viewable.position.maxN || n > this.viewable.position.maxN) {
			this.viewable.position.maxN = n;
		}
	}

	private static lineSplit(line: string): string[] {
		const count = (line.match(/\t\t/g) || []).length;

		let cols: string[];
		if (count > 2) {
			cols = line.split("\t\t").map(item => item.trim());
		} else {
			cols = line.split("\t").map(item => item.trim());
		}
		return cols;
	}

	private static getNameAndNum(str: string): { name: string, num: number } {
		try {
			const line = str.lastIndexOf("(") + 1;
			return {name: str.substr(0, line - 2), num: parseInt(str.substr(line, str.lastIndexOf(")") - line), 10)};
		} catch (e) {
			return null;
		}
	}
}
