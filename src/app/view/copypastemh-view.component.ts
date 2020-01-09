import {Component, ElementRef, ViewChild} from "@angular/core";
import {ViewComponent} from "../core/components/view/view.component";
import {ViewableClass} from "../core/classes/viewable.class";
import {CreaturetypesUtils} from "../core/utils/business/creaturetypes.utils";
import {CreatureClass} from "../core/objects/creature.class";
import {Twodimmap} from "../core/classes/twodimmap.class";
import {TresorClass} from "../core/objects/tresor.class";
import {LieuxClass} from "../core/objects/lieux.class";
import {PlanteClass} from "../core/objects/plante.class";
import {ItemClass} from "../core/classes/item.class";

@Component({
	selector: "copypastemh-view-component",
	templateUrl: "./copypastemh-view.component.html"
})
export class CopypastemhViewComponent {

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

		let current: string = null;
		lines.forEach(line => {
			line = line.trim();
			if (line === "") {
				return;
			}
			//console.log(line);
			let goOn = true;
			if (line.indexOf("[-]") > -1) {
				current = line.substr(3, line.indexOf("Monstres |") - 3).trim();
				goOn = false;
			}
			if (goOn) {
				switch (current) {
					case "MONSTRES ERRANTS":
						this.parseCreature(line);
						break;
					case "TRÉSORS":
						this.parseTreasure(line);
						break;
					case "CHAMPIGNONS":
						this.parsePlant(line);
						break;
					case "LIEUX":
						this.parsePlace(line);
						break;
					case "CÉNOTAPHES":
						this.parseCenotaph(line);
						break;
				}
			}
		});
		console.log(this.viewable);
		this.viewComponent.renderView(this.viewable);
		this.processed = true;
	}

	reset(): void {
		this.processed = false;
		(this.textarea.nativeElement as HTMLTextAreaElement).innerHTML = "";
	}

	private parseCreature(line: string): void {
		try {
			const cols = CopypastemhViewComponent.lineSplit(line);
			const item: CreatureClass = this.creatureEnrichment({
				dist: this.pInt(cols[0]), num: this.pInt(cols[1]), name: cols[2],
				posX: this.pInt(cols[3]), posY: this.pInt(cols[4]), posN: this.pInt(cols[5]),
				template: null, basename: null, age: null,
				level: null, visible: true, type: null, race: null, clan: null,
			});
			if (item.num) {
				this.viewable.creatures.set(item);
				this.setPos(item);
			}
		} catch (e) {
			return null;
		}
	}

	private creatureEnrichment(creatureClass: CreatureClass): CreatureClass {
		return creatureClass;
	}

	private parseTreasure(line: string): void {
		// noinspection DuplicatedCode
		try {
			const cols = CopypastemhViewComponent.lineSplit(line);
			if (!parseInt(cols[1], 10)) {
				return;
			}
			const item: TresorClass = {
				dist: this.pInt(cols[0]), num: this.pInt(cols[1]), name: cols[2],
				posX: this.pInt(cols[3]), posY: this.pInt(cols[4]), posN: this.pInt(cols[5]),
				value: null, visible: true
			};
			this.viewable.tresors.set(item);
			this.setPos(item);
		} catch (e) {
			return null;
		}
	}

	private parsePlace(line: string): void {
		try {
			const cols = CopypastemhViewComponent.lineSplit(line);
			if (!parseInt(cols[1], 10)) {
				return;
			}
			const item: LieuxClass = {
				dist: this.pInt(cols[0]), num: this.pInt(cols[1]), name: cols[2],
				posX: this.pInt(cols[3]), posY: this.pInt(cols[4]), posN: this.pInt(cols[5]),
				type: null, visible: true
			};
			this.viewable.lieux.set(item);
			this.setPos(item);
		} catch (e) {
			return null;
		}
	}

	private parsePlant(line: string): void {
		try {
			const cols = CopypastemhViewComponent.lineSplit(line);
			if (!parseInt(cols[1], 10)) {
				return;
			}
			const item: PlanteClass = {
				dist: this.pInt(cols[0]), num: this.pInt(cols[1]), name: cols[2],
				posX: this.pInt(cols[3]), posY: this.pInt(cols[4]), posN: this.pInt(cols[5]),
				visible: true
			};
			this.viewable.plantes.set(item);
			this.setPos(item);
		} catch (e) {
			return null;
		}
	}

	private parseCenotaph(line: string): void {
		// noinspection DuplicatedCode
		try {
			const cols = CopypastemhViewComponent.lineSplit(line);
			if (!parseInt(cols[1], 10)) {
				return;
			}
			const item: TresorClass = {
				dist: this.pInt(cols[0]), num: this.pInt(cols[1]), name: cols[2],
				posX: this.pInt(cols[3]), posY: this.pInt(cols[4]), posN: this.pInt(cols[5]),
				value: null, visible: true
			};
			this.viewable.plantes.set(item);
			this.setPos(item);
		} catch (e) {
			return null;
		}
	}

	// noinspection DuplicatedCode
	private setPos(item: ItemClass): void {
		console.log(this.viewable.position.minX + " " + item.posX);
		if (this.viewable.position.minX == null || item.posX < this.viewable.position.minX) {
			this.viewable.position.minX = item.posX;
		}
		if (this.viewable.position.maxX == null || item.posX > this.viewable.position.maxX) {
			this.viewable.position.maxX = item.posX;
		}
		if (this.viewable.position.minY == null || item.posY < this.viewable.position.minY) {
			this.viewable.position.minY = item.posY;
		}
		if (this.viewable.position.maxY == null || item.posY > this.viewable.position.maxY) {
			this.viewable.position.maxY = item.posY;
		}
		if (this.viewable.position.minN == null || item.posN < this.viewable.position.minN) {
			this.viewable.position.minN = item.posN;
		}
		if (this.viewable.position.maxN == null || item.posN > this.viewable.position.maxN) {
			this.viewable.position.maxN = item.posN;
		}
	}

	private pInt(str: string): number {
		return parseInt(str, 10);
	}

	private static lineSplit(line: string): string[] {
		const cols = line.split(" ")
			// .map(item => item.trim())
			.filter(item => item !== "");
		// if (cols.length < 6) {
		// 	const name = cols[1].substr(0, cols[1].indexOf(" "));
		// 	const id = cols[1].substr(cols[1].indexOf(" ") + 1);
		// 	cols[1] = name;
		// 	cols.splice(2, 0, id);
		// }
		return [cols[0], cols[1], cols.slice(2, cols.length - 3).join(" "), cols[cols.length - 3], cols[cols.length - 2], cols[cols.length - 1]];
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
