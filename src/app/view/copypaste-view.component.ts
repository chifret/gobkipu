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
	@ViewChild("textarea") textarea: ElementRef;
	@ViewChild("viewComponent") viewComponent: ViewComponent;

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
				posX: null,
				posY: null,
				posN: null,
				horiz: null,
				verti: null,

				avgPosN: null,
				minX: null,
				maxX: null,
				minY: null,
				maxY: null
			},
			[],
			[],
			[],
			[],
			[]
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
			let goOn = true;
			if (line.indexOf("Créatures | Trésors | Lieux/Décors | Plantes") > 5) {
				current = line.substr(0, line.indexOf("\t")).trim();
				goOn = false;
			}
			if (goOn) {
				switch (current) {
					case null:
						if (line.indexOf("Ma position actuelle est ") > -1) {
							line = line.substr(31, line.length);
							posX = parseInt(line.substr(0, line.indexOf(",")));
							line = line.substr(line.indexOf(",") + 6, line.length);
							posY = parseInt(line.substr(0, line.indexOf(",")));
							line = line.substr(line.indexOf(",") + 6, line.length);
							posN = parseInt(line.substr(0, line.length));
							const creatureTmp = new CreatureClass();
							creatureTmp.dist = -1;
							creatureTmp.num = 0;
							creatureTmp.level = 0;
							creatureTmp.name = "Player";
							creatureTmp.type = 1;
							creatureTmp.posX = posX;
							creatureTmp.posY = posY;
							creatureTmp.posN = posN;
							this.viewable.gobelins.push(creatureTmp);
						} else if (line.indexOf("L'affichage est limité à ") > -1) {
							line = line.substr(25, line.length);
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

	private parseCreature(line: string): void {
		try {
			const cols = line.split("\t").map(item => item.trim());
			const id = CopyPasteViewComponent.getNameAndNum(cols[2]);
			if (!id.num) {
				return;
			}
			if (CreaturetypesUtils.creatureIsGob(cols[4], id.num)) {
				console.log(cols);
				this.viewable.gobelins.push({
					dist: parseInt(cols[0]), level: parseInt(cols[3]), name: id.name, num: id.num, type: 1, race: cols[4], clan: cols[5],
					posX: parseInt(cols[6]), posY: parseInt(cols[7]), posN: parseInt(cols[8])
				})
			} else {
				this.viewable.creatures.push({
					dist: parseInt(cols[0]), level: parseInt(cols[3]), name: id.name, num: id.num, type: 0, race: cols[4], clan: cols[5],
					posX: parseInt(cols[6]), posY: parseInt(cols[7]), posN: parseInt(cols[8])
				});
			}
		} catch (e) {
			return null;
		}
	}

	private parseTresor(line: string): void {
		try {
			const cols = line.split("\t").map(item => item.trim());
			if (!parseInt(cols[1])) {
				return;
			}
			this.viewable.tresors.push({
				dist: parseInt(cols[0]), name: cols[2], num: parseInt(cols[1]),
				posX: parseInt(cols[3]), posY: parseInt(cols[4]), posN: parseInt(cols[5])
			});
		} catch (e) {
			return null;
		}
	}

	private parseLieux(line: string): void {
		try {
			const cols = line.split("\t").map(item => item.trim());
			if (!parseInt(cols[1])) {
				return;
			}
			this.viewable.lieux.push({
				dist: parseInt(cols[0]), name: cols[2], num: parseInt(cols[1]), type: cols[3],
				posX: parseInt(cols[4]), posY: parseInt(cols[5]), posN: parseInt(cols[6])
			});
		} catch (e) {
			return null;
		}
	}

	private parsePlantes(line: string): void {
		try {
			const cols = line.split("\t").map(item => item.trim());
			if (!parseInt(cols[1])) {
				return;
			}
			this.viewable.plantes.push({
				dist: parseInt(cols[0]), name: cols[2], num: parseInt(cols[1]),
				posX: parseInt(cols[3]), posY: parseInt(cols[4]), posN: parseInt(cols[5])
			});
		} catch (e) {
			return null;
		}
	}
}
