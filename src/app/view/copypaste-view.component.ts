import {Component, ElementRef, ViewChild} from '@angular/core';

import {ViewComponent} from './view.component';
import {ViewableClass} from "../core/classes/viewable.class";
import {CreaturetypesUtils} from "../core/utils/business/creaturetypes.utils";
import {CreatureClass} from "../core/classes/creature.class";

@Component({
	selector: 'copypaste-view-component',
	templateUrl: './copypaste-view.component.html'
})
export class CopyPasteViewComponent {

	processed = false;
	viewable: ViewableClass;
	@ViewChild("textarea", {static: false}) textarea: ElementRef;
	@ViewChild("viewComponent", {static: true}) viewComponent: ViewComponent;

	private static getNameAndNum(str: string): { name: string, num: number } {
		try {
			const line = str.lastIndexOf("(") + 1;
			return {name: str.substr(0, line - 2), num: parseInt(str.substr(line, str.lastIndexOf(")") - line))};
		} catch (e) {
			return null;
		}
	}

	view(): void {
		const lines = (this.textarea.nativeElement as HTMLTextAreaElement).value
		// todo dev
			.replace(/Ã©/g, "é")
			.replace(/Ã/g, "à")
			.split('\n');

		this.viewable = new ViewableClass(
			{
				avgPosN: null,
				minX: null,
				maxX: null,
				minY: null,
				maxY: null
			},
			new Map(),
			new Map(),
			new Map(),
			new Map(),
			new Map()
		);
		let posX = null;
		let posY = null;
		let posN = null;
		let horiz: number = 0;
		let verti: number = 0;

		let current: string = null;
		lines.forEach(line => {
			// todo dev
			line = line.trim();
			if (line == "") {
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
							posX = parseInt(line.substr(0, line.indexOf(",")));
							line = line.substr(line.indexOf(",") + 6, line.length);
							posY = parseInt(line.substr(0, line.indexOf(",")));
							line = line.substr(line.indexOf(",") + 6, line.length);
							posN = parseInt(line.substr(0, line.length));
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
								this.viewable.creatures.set(creatureTmp.num, creatureTmp);
							} else {
								creatureTmp.type = 1;
								this.viewable.gobelins.set(creatureTmp.num, creatureTmp);
							}
						} else if (line.indexOf("L'affichage est limité à ") > -1) {
							line = line.substr(25, line.length);
							horiz = parseInt(line.substr(0, line.indexOf("cases horizontalement") - 1));
							verti = parseInt(line.substr(line.indexOf("cases horizontalement") + 24, line.indexOf("verticalement") - 28));
						} else if (line.indexOf("Sa vue porte à ") > -1) {
							line = line.substr(15, line.length);
							horiz = parseInt(line.substr(0, line.indexOf("cases horizontalement") - 1));
							verti = parseInt(line.substr(line.indexOf("cases horizontalement") + 24, line.indexOf("verticalement") - 28));
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
		this.viewable.position.minX = posX - horiz;
		this.viewable.position.maxX = posX + horiz;
		this.viewable.position.minY = posY - horiz;
		this.viewable.position.maxY = posY + horiz;
		this.viewable.position.avgPosN = posN;
		this.viewComponent.renderView(this.viewable);
		this.processed = true;
	}

	reset(): void {
		this.processed = false;
		(this.textarea.nativeElement as HTMLTextAreaElement).innerHTML = "";
	}

	private parseCreature(line: string): void {
		try {
			const cols = this.lineSplit(line);
			if (cols.length == 9) {
				// gob view
				const id = CopyPasteViewComponent.getNameAndNum(cols[2]);
				if (!id.num) {
					return;
				}
				if (CreaturetypesUtils.creatureIsGob(cols[4], id.num)) {
					console.log(cols);
					this.viewable.gobelins.set(id.num, {
						dist: parseInt(cols[0]), level: parseInt(cols[3]), name: id.name, num: id.num, type: 1, race: cols[4], clan: cols[5],
						posX: parseInt(cols[6]), posY: parseInt(cols[7]), posN: parseInt(cols[8])
					})
				} else {
					this.viewable.creatures.set(id.num, {
						dist: parseInt(cols[0]), level: parseInt(cols[3]), name: id.name, num: id.num, type: 0, race: cols[4], clan: cols[5],
						posX: parseInt(cols[6]), posY: parseInt(cols[7]), posN: parseInt(cols[8])
					});
				}
			} else {
				// follower view
				const id = CopyPasteViewComponent.getNameAndNum(cols[1]);
				if (!id.num) {
					return;
				}
				if (CreaturetypesUtils.creatureIsGob(cols[3], id.num)) {
					console.log(cols);
					this.viewable.gobelins.set(id.num, {
						dist: parseInt(cols[0]), level: parseInt(cols[2]), name: id.name, num: id.num, type: 1, race: cols[3], clan: null,
						posX: parseInt(cols[4]), posY: parseInt(cols[5]), posN: parseInt(cols[6])
						// dist: parseInt(cols[0]), level: parseInt(cols[2]), name: id.name, num: id.num, type: 1, race: cols[3], clan: cols[4],
						// posX: parseInt(cols[5]), posY: parseInt(cols[6]), posN: parseInt(cols[7])
					})
				} else {
					this.viewable.creatures.set(id.num, {
						dist: parseInt(cols[0]), level: parseInt(cols[2]), name: id.name, num: id.num, type: 0, race: cols[3], clan: null,
						posX: parseInt(cols[4]), posY: parseInt(cols[5]), posN: parseInt(cols[6])
						// dist: parseInt(cols[0]), level: parseInt(cols[2]), name: id.name, num: id.num, type: 0, race: cols[3], clan: cols[4],
						// posX: parseInt(cols[5]), posY: parseInt(cols[6]), posN: parseInt(cols[7])
					});
				}
			}
		} catch (e) {
			return null;
		}
	}

	private parseTresor(line: string): void {
		try {
			const cols = this.lineSplit(line);
			if (!parseInt(cols[1])) {
				return;
			}
			this.viewable.tresors.set(parseInt(cols[1]), {
				dist: parseInt(cols[0]), name: cols[2], num: parseInt(cols[1]),
				posX: parseInt(cols[3]), posY: parseInt(cols[4]), posN: parseInt(cols[5])
			});
		} catch (e) {
			return null;
		}
	}

	private parseLieux(line: string): void {
		try {
			const cols = this.lineSplit(line);
			if (!parseInt(cols[1])) {
				return;
			}
			this.viewable.lieux.set(parseInt(cols[1]), {
				dist: parseInt(cols[0]), name: cols[2], num: parseInt(cols[1]), type: cols[3],
				posX: parseInt(cols[4]), posY: parseInt(cols[5]), posN: parseInt(cols[6])
			});
		} catch (e) {
			return null;
		}
	}

	private parsePlantes(line: string): void {
		try {
			const cols = this.lineSplit(line);
			if (!parseInt(cols[1])) {
				return;
			}
			this.viewable.plantes.set(parseInt(cols[1]), {
				dist: parseInt(cols[0]), name: cols[2], num: parseInt(cols[1]),
				posX: parseInt(cols[3]), posY: parseInt(cols[4]), posN: parseInt(cols[5])
			});
		} catch (e) {
			return null;
		}
	}

	private lineSplit(line: string): string[] {
		var count = (line.match(/\t\t/g) || []).length;
		console.log(count);


		let cols: string[];
		if (count > 2) {
			cols = line.split("\t\t").map(item => item.trim());
		} else {
			cols = line.split("\t").map(item => item.trim());
		}
		// let cols2: string[];
		// if(cols[1]==""){
		// 	cols.splice(1, 1);
		// }
		return cols;
	}
}
