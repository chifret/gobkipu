import {Component, ElementRef, ViewChild} from '@angular/core';

import {PlusminusEnum} from "app/core/enums/plusminus.enum";
import {SkilllevelEnum} from "app/core/enums/skilllevel.enum";
import {isEven, isOdd} from "app/core/functions/calculation.function";
import {FollowersService} from "app/core/services/followers/followers.service";

@Component({
	selector: 'followers-component',
	templateUrl: './followers.component.html'
})
export class FollowersComponent {

	processed = false;
	order: string = null;
	usualGobView: number = null;
	usualFollowerView: number = null;
	@ViewChild("textarea", {static: false}) textarea: ElementRef;

	constructor(protected followersService: FollowersService) {
		this.usualGobView = followersService.getGobUsualView();
		this.usualFollowerView = followersService.getFollowerUsualView();
	};

	private static calculateSteps(
		_gobView: number,
		_spyView: number,
		skillLevel: SkilllevelEnum,
		position: { x: number, y: number, n: number },
		directions: { x: PlusminusEnum, y: PlusminusEnum, n: PlusminusEnum }
	): { x: number, y: number, n: number }[] {
		let positions: { x: number, y: number, n: number }[] = [];

		const gobView = {h: _gobView, v: Math.ceil(_gobView / 2)};
		const spyView = {h: _spyView, v: Math.ceil(_spyView / 2)};
		let factor: number;
		switch (skillLevel) {
			case SkilllevelEnum.apprenti:
				factor = 1.5;
				break;
			case SkilllevelEnum.compagnon:
				factor = 2;
				break;
			case SkilllevelEnum.maitre:
				factor = 2.5;
				break;
			case SkilllevelEnum.grandMaitre:
				factor = 3;
		}
		const skillView = {h: Math.ceil(gobView.h * factor), v: Math.ceil((gobView.v * factor))};

		// ======================= top =======================

		const outFloors = Math.ceil((skillView.v - gobView.v) / (spyView.v * 2 + 1));
		const outFloorRows = Math.ceil(skillView.h / (spyView.h * 2 + 1));

		let n = outFloors - 1;
		let x;
		let y;
		let xDir;
		let yDir;

		// si nombre de lignes pair, on commence au-dessus de la position de recherche.
		if (isEven(outFloors) && isEven(outFloorRows)) {
			x = outFloorRows - 1;
			y = 0;
			xDir = -1;
			yDir = +1;
		} else if (isOdd(outFloors) && isEven(outFloorRows)) {
			x = 0;
			y = 0;
			xDir = +1;
			yDir = +1;
		} else if (isEven(outFloors) && isOdd(outFloorRows)) {
			x = outFloorRows - 1;
			y = 0;
			xDir = -1;
			yDir = +1;
		} else {
			x = 0;
			y = outFloorRows - 1;
			xDir = +1;
			yDir = -1;
		}

		for (let i = 0; i < outFloorRows * outFloorRows * outFloors; i++) {
			positions.push({
				x: position.x + (1 + spyView.h + (spyView.h * 2 + 1) * x) * (directions.x === PlusminusEnum.plus ? 1 : -1),
				y: position.y + (1 + spyView.h + (spyView.h * 2 + 1) * y) * (directions.y === PlusminusEnum.plus ? 1 : -1),
				n: position.n + (gobView.v + 1 + spyView.v + (spyView.v * 2 + 1) * n) * (directions.n === PlusminusEnum.plus ? 1 : -1)
			});
			y += yDir;
			if (y < 0 || y > outFloorRows - 1) {
				y -= yDir;
				yDir = yDir * -1;
				x += xDir;
				if (x < 0 || x > outFloorRows - 1) {
					x -= xDir;
					xDir = xDir * -1;
					n -= 1;
				}
			}
		}


		// ======================= ground =======================

		const groundFloors = Math.ceil(gobView.v / (spyView.v * 2 + 1));
		const groundFloorsRows = Math.ceil((skillView.h - gobView.h) / (spyView.h * 2 + 1));
		const groundFloorsRowsRest = Math.ceil(gobView.h / (spyView.h * 2 + 1));

		n = groundFloors - 1;
		x = groundFloorsRows - 1;
		y = 0;
		xDir = -1;
		yDir = 1;
		let isFirstPart = true;

		for (let i = 0; i < (groundFloorsRows * outFloorRows + groundFloorsRows * groundFloorsRowsRest) * groundFloors; i++) {

			if (isFirstPart) {
				positions.push({
					x: position.x + (1 + gobView.h + spyView.h + (spyView.h * 2 + 1) * x) * (directions.x === PlusminusEnum.plus ? 1 : -1),
					y: position.y + (1 + spyView.h + (spyView.h * 2 + 1) * y) * (directions.y === PlusminusEnum.plus ? 1 : -1),
					n: position.n + (gobView.v - spyView.v - (spyView.v * 2 + 1) * (groundFloors - 1 - n)) * (directions.n === PlusminusEnum.plus ? 1 : -1)
				});
				x += xDir;
				if (x < 0 || x > groundFloorsRows - 1) {
					x -= xDir;
					xDir = xDir * -1;
					y += yDir;
					if (y < 0) {
						// restart in 1
						y -= yDir;
						yDir = yDir * -1;
						n -= 1;
					} else if (y > outFloorRows - 1) {
						// go to part 2
						isFirstPart = false;
						x = groundFloorsRowsRest - 1;
						y = groundFloorsRows - 1;
						xDir = -1;
						yDir = -1;
					}
				}
			} else {
				positions.push({
					x: position.x + (gobView.h - spyView.h + (spyView.h * 2 + 1) * (x - (groundFloorsRowsRest - 1))) * (directions.x === PlusminusEnum.plus ? 1 : -1),
					y: position.y + (1 + gobView.h + spyView.h + (spyView.h * 2 + 1) * y) * (directions.y === PlusminusEnum.plus ? 1 : -1),
					n: position.n + (gobView.v - spyView.v - (spyView.v * 2 + 1) * (groundFloors - 1 - n)) * (directions.n === PlusminusEnum.plus ? 1 : -1)
				});
				x += xDir;
				if (x < 0 || x > groundFloorsRowsRest - 1) {
					x -= xDir;
					xDir = xDir * -1;
					y += yDir;
					if (y < 0) {
						// restart in 2
						y -= yDir;
						yDir = yDir * -1;
						n -= 1;
					} else if (y > groundFloorsRows - 1) {
						// go to part 1
						isFirstPart = true;
						x = 0;
						y = outFloorRows - 1;
						xDir = 1;
						yDir = -1;
					}
				}
			}
		}

		return positions;
	}

	reset(): void {
		this.processed = false;
		(this.textarea.nativeElement as HTMLTextAreaElement).innerHTML = "";
	}

	calculate(): void {
		this.order = "";
		const lines = (this.textarea.nativeElement as HTMLTextAreaElement).value
			.replace(/Ã©/g, "é")
			.replace(/Ã/g, "à")
			.split('\n');

		let success = false;
		let position = {x: 0, y: 0, n: 0};
		let skillLevel: SkilllevelEnum = null;
		let direction = {x: PlusminusEnum.moins, y: PlusminusEnum.moins, n: PlusminusEnum.moins};
		lines.forEach(line => {
			line = line.trim();
			if (line.indexOf("Vous AVEZ RÉUSSI à utiliser cette compétence en tant que ") > -1) {
				line = line.substring(57, line.length);
				line = line.substring(0, line.indexOf(" "));
				switch (line) {
					case "Apprenti":
						skillLevel = SkilllevelEnum.apprenti;
						break;
					case "Compagnon":
						skillLevel = SkilllevelEnum.compagnon;
						break;
					case "Maître":
						skillLevel = SkilllevelEnum.maitre;
						break;
					case "Grand Maître":
						skillLevel = SkilllevelEnum.grandMaitre;
				}
			} else if (line.indexOf("Vous êtiez en ") > -1) {
				line = line.substring(14, line.length);
				position.x = parseInt(line.substr(2, line.indexOf(" ") - 2));
				line = line.substr(line.indexOf(" ") + 1, line.length);
				position.y = parseInt(line.substr(2, line.indexOf(" ") - 2));
				line = line.substr(line.indexOf(" ") + 1, line.length);
				position.n = parseInt(line.substr(2, line.length));
			} else if (line.indexOf("Vous avez trouvé la trace d'une plante hors de votre vue.") > -1) {
				success = true;
			} else if (line.indexOf("elle se trouve plus en ") > -1) {
				line = line.substring(23, line.length);
				let pos = line.substring(0, line.indexOf(","));
				if (pos == "Osten") {
					direction.x = PlusminusEnum.plus;
				}
				line = line.substring(pos.length + 10, line.length);
				pos = line.substring(0, line.indexOf(","));
				if (pos == "Nordi") {
					direction.y = PlusminusEnum.plus;
				}
				line = line.substring(pos.length + 10, line.length - 1);
				if (line == "Haut") {
					direction.n = PlusminusEnum.plus;
				}
			}
		});

		if (!success) {
			return;
		}

		this.followersService.setGobUsualView(this.usualGobView);
		this.followersService.setFollowerUsualView(this.usualFollowerView);
		const steps = FollowersComponent.calculateSteps(
			this.usualGobView,
			this.usualFollowerView,
			skillLevel,
			position,
			direction
		);

		steps.forEach(step => {
			this.order += "move(" + step.x + ", " + step.y + ", " + step.n + ");\r\n";
			this.order += "scout();\r\n";
		});
		this.processed = true;
	}
}
