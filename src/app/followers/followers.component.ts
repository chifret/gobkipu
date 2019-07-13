import {Component, OnInit} from '@angular/core';

import {LoginService} from '../core/services/login.service';
import {PlusminusEnum} from "app/core/enums/plusminus.enum";
import {SkilllevelEnum} from "app/core/enums/skilllevel.enum";
import {isEven, isOdd} from "app/core/functions/calculation.function";

@Component({
	selector: 'followers-component',
	templateUrl: './followers.component.html'
})
export class FollowersComponent implements OnInit {


	constructor(private loginService: LoginService) {
	};

	ngOnInit(): void {
		this.calculateSteps(
			22,
			7,
			SkilllevelEnum.apprenti,
			{x: 100, y: 100, n: 100},
			{x: PlusminusEnum.plus, y: PlusminusEnum.plus, n: PlusminusEnum.plus}
		);
		// this.calculateSteps(
		// 	3,
		// 	0,
		// 	SkilllevelEnum.apprenti,
		// 	{x: 0, y: 0, n: 0},
		// 	null
		// );
	}

	calculateSteps(
		_gobView: number,
		_spyView: number,
		skillLevel: SkilllevelEnum,
		position: { x: number, y: number, n: number },
		directiions: { x: PlusminusEnum, y: PlusminusEnum, n: PlusminusEnum }
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
			yDir = -1;
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
				x: position.x + 1 + spyView.h + (spyView.h * 2 + 1) * x,
				y: position.y + 1 + spyView.h + (spyView.h * 2 + 1) * y,
				n: position.n + 1 + spyView.v + (spyView.v * 2 + 1) * n + gobView.v
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
					x: position.x + 1 + gobView.h + spyView.h + (spyView.h * 2 + 1) * x,
					y: position.y + 1 + spyView.h + (spyView.h * 2 + 1) * y,
					n: position.n + gobView.v - spyView.v - (spyView.v * 2 + 1) * (groundFloors - 1 - n)
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
					x: position.x + gobView.h - spyView.h - (spyView.h * 2 + 1) * (x - (groundFloorsRowsRest - 1)),
					y: position.y + 1 + gobView.h + spyView.h + (spyView.h * 2 + 1) * y,
					n: position.n + gobView.v - spyView.v - (spyView.v * 2 + 1) * (groundFloors - 1 - n)
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
						x = groundFloorsRows - 1;
						y = outFloorRows - 1;
						xDir = 1;
						yDir = -1;
					}
				}
			}
		}


		// ======================= return =======================

		console.log("vue de " + gobView.h + "/" + gobView.v);
		console.log("suivant de " + spyView.h + "/" + spyView.v);
		console.log("portée de " + skillView.h + "/" + skillView.v);
		console.log(groundFloors + " étages au même niveau de " + groundFloorsRows + " rangs (partie restante : " + groundFloorsRowsRest + ")");
		console.log(outFloors + " étages au niveau différent de " + outFloorRows + " rangs");
		console.log(positions);

		return positions;
	}
}
