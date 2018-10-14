import {Component, ElementRef, ViewChild} from '@angular/core';

import {ViewableClass} from "../core/classes/viewable.class";

@Component({
	selector: 'view-component',
	templateUrl: './view.component.html'
})
export class ViewComponent {

	viewable: ViewableClass;
	scale = 1;
	processed = false;

	values: { type: string, value: number }[] = [
		{type: "Parchemin", value: 5},
		{type: "Outil", value: 4},
		{type: "Nourriture", value: 4},
		{type: "Anneau", value: 4},
		{type: "Bijou", value: 4},
		{type: "CT", value: 1},
		{type: "Potion", value: 1},
		{type: "Talisman", value: 1},
		{type: "Casque", value: 1},
		{type: "Armure", value: 3},
		{type: "Bottes", value: 3},
		{type: "Baguette", value: 3},
		{type: "Bouclier", value: 3},
		{type: "Arme 1 Main", value: 3},
		{type: "Arme 2 mains", value: 3},
	];

	followers: string[] = ["Créature mécanique", "CrÃ©ature mÃ©canique", "Arme dansante", "Pixie"];

	@ViewChild("table") table: ElementRef;
	@ViewChild("tooltip") tooltip: ElementRef;

	renderView(viewable: ViewableClass) {

		this.viewable = viewable;
		(this.table.nativeElement as HTMLDivElement).innerHTML = "";
		(this.table.nativeElement as HTMLDivElement).style.transform = "scale(1)";
		(this.table.nativeElement as HTMLDivElement).style.width = "auto";
		(this.table.nativeElement as HTMLDivElement).style.height = "auto";

		for (let y = this.viewable.position.maxY; y >= this.viewable.position.minY; y--) {
			let row = document.createElement("div") as HTMLDivElement;
			row.style.display = "table-row";
			row.style.width = "auto";
			(this.table.nativeElement as HTMLDivElement).appendChild(row);
			for (let x = this.viewable.position.minX; x <= this.viewable.position.maxX; x++) {
				let cell = document.createElement("div") as HTMLDivElement;
				cell.style.cssFloat = "left";
				cell.style.display = "table-column";
				cell.style.border = "1px solid #aaa";
				cell.style.width = "50px";
				cell.style.height = "50px";
				cell.style.position = "relative";
				cell.style.boxSizing = "border-box";
				row.appendChild(cell);

				// ------------------------------------------- créatures -------------------------------------------
				let infoC: HTMLDivElement = null;
				let minDist: number = null;
				let hasFollower = false;
				let hasMonster = false;
				for (let k = 0; k < this.viewable.creatures.length; k++) {
					if (this.viewable.creatures[k].posX == x && this.viewable.creatures[k].posY == y) {
						const diffLevel = Math.abs(this.viewable.position.avgPosN - this.viewable.creatures[k].posN);
						if (this.followers.indexOf(this.viewable.creatures[k].race) > -1) {
							hasFollower = true;
						} else {
							hasMonster = true;
						}
						if (minDist === null || minDist > diffLevel) {
							minDist = diffLevel;
						}
						if (!infoC) {
							infoC = document.createElement("div") as HTMLDivElement;
							infoC.style.position = "absolute";
							infoC.style.top = "0";
							infoC.style.right = "0";
							infoC.addEventListener("mouseenter", (e: MouseEvent) => {
								this.showMonsterInfo(e, x, y);
							});
							infoC.addEventListener("mouseleave", (e: MouseEvent) => {
								this.hideInfo();
							});
						}
					}
				}
				if (infoC) {
					let lang: number = this.setCellDist(infoC, minDist);
					if (hasMonster) {
						if (hasFollower) {
							lang = Math.sqrt(2 * (lang * lang)) / 2;
							infoC.style.background = "repeating-linear-gradient(45deg, red, red " + lang + "px, aquamarine " + lang + "px, aquamarine " + 2 * lang + "px)";
						} else {
							infoC.style.backgroundColor = "red";
						}
					} else {
						infoC.style.backgroundColor = "aquamarine";
					}
					cell.appendChild(infoC);
				}

				// ------------------------------------------- gobelins -------------------------------------------
				infoC = null;
				minDist = null;
				for (let k = 0; k < this.viewable.gobelins.length; k++) {
					if (this.viewable.gobelins[k].posX == x && this.viewable.gobelins[k].posY == y) {
						if (this.viewable.gobelins[k].dist == -1) {
							cell.style.border = "1px solid white";
							cell.style.boxShadow = "0px 0px 15px white";
						}// else {
						const diffLevel = Math.abs(this.viewable.position.avgPosN - this.viewable.gobelins[k].posN);
						if (minDist === null || minDist > diffLevel) {
							minDist = diffLevel;
						}
						if (infoC) {
							continue;
						}
						infoC = document.createElement("div") as HTMLDivElement;
						infoC.style.position = "absolute";
						infoC.style.top = "0";
						infoC.style.backgroundColor = "greenyellow";
						infoC.style.left = "0";
						infoC.addEventListener("mouseenter", (e: MouseEvent) => {
							this.showGobInfo(e, x, y);
						});
						infoC.addEventListener("mouseleave", (e: MouseEvent) => {
							this.hideInfo();
						});
						//}
					}
				}
				if (infoC) {
					this.setCellDist(infoC, minDist);
					cell.appendChild(infoC);
				}

				// ------------------------------------------- trésors -------------------------------------------
				infoC = null;
				minDist = null;
				let maxValue: number = 0;
				for (let k = 0; k < this.viewable.tresors.length; k++) {
					if (this.viewable.tresors[k].posX == x && this.viewable.tresors[k].posY == y) {
						const diffLevel = Math.abs(this.viewable.position.avgPosN - this.viewable.tresors[k].posN);
						if (minDist === null || minDist > diffLevel) {
							minDist = diffLevel;
						}
						let itemValue = 2;
						for (let v = 0; v < this.values.length; v++) {
							if (this.viewable.tresors[k].name === this.values[v].type) {
								itemValue = this.values[v].value;
								break;
							}
						}
						if (itemValue === 2) {
							console.log(this.viewable.tresors[k].name);
						}
						if (!maxValue || maxValue < itemValue) {
							maxValue = itemValue;
						}
						if (!infoC) {
							infoC = document.createElement("div") as HTMLDivElement;
							infoC.style.position = "absolute";
							infoC.style.bottom = "0";
							infoC.style.left = "0";
							infoC.addEventListener("mouseenter", (e: MouseEvent) => {
								this.showTreasorsInfo(e, x, y);
							});
							infoC.addEventListener("mouseleave", (e: MouseEvent) => {
								this.hideInfo();
							});
						}
					}
				}
				if (infoC) {
					this.setCellDist(infoC, minDist);
					switch (maxValue) {
						case 1:
							infoC.style.backgroundColor = "#a98600";
							break;
						case 2:
							infoC.style.backgroundColor = "#dab600";
							break;
						case 3:
							infoC.style.backgroundColor = "#e9d700";
							break;
						case 4:
							infoC.style.backgroundColor = "#f8ed62";
							infoC.style.boxShadow = "0px 0px 15px #fff9ae";
							break;
						case 5:
							infoC.style.backgroundColor = "#fff9ae";
							infoC.style.boxShadow = "0px 0px 40px white";
							break;
					}
					cell.appendChild(infoC);
				}

				// ------------------------------------------- plantes -------------------------------------------
				infoC = null;
				minDist = null;
				for (let k = 0; k < this.viewable.plantes.length; k++) {
					if (this.viewable.plantes[k].posX == x && this.viewable.plantes[k].posY == y) {
						const diffLevel = Math.abs(this.viewable.position.avgPosN - this.viewable.plantes[k].posN);
						if (minDist === null || minDist > diffLevel) {
							minDist = diffLevel;
						}
						if (!infoC) {
							infoC = document.createElement("div") as HTMLDivElement;
							infoC.style.position = "absolute";
							infoC.style.bottom = "0";
							infoC.style.backgroundColor = "green";
							infoC.style.right = "0";
							infoC.addEventListener("mouseenter", (e: MouseEvent) => {
								this.showPlantsInfo(e, x, y);
							});
							infoC.addEventListener("mouseleave", (e: MouseEvent) => {
								this.hideInfo();
							});
						}
					}
				}
				if (infoC) {
					this.setCellDist(infoC, minDist);
					cell.appendChild(infoC);
				}

				// ------------------------------------------- lieux -------------------------------------------
				let color: string = null;
				for (let k = 0; k < this.viewable.lieux.length; k++) {
					if (this.viewable.lieux[k].posX == x && this.viewable.lieux[k].posY == y) {
						if (this.viewable.lieux[k].name === "Arbre" && !color) {
							color = "green";
						} else {
							color = "purple";
						}
					}
				}
				if (color) {
					cell.style.backgroundColor = color;
					cell.addEventListener("mouseenter", (e: MouseEvent) => {
						this.showLieuxInfo(e, x, y);
					});
					cell.addEventListener("mouseleave", (e: MouseEvent) => {
						this.hideInfo();
					});
				}
			}
		}


		const viewWidth = this.viewable.position.maxX - this.viewable.position.minX + 1;
		let scale = 1;
		if (viewWidth * 50 > (this.table.nativeElement as HTMLDivElement).clientWidth) {
			scale = (this.table.nativeElement as HTMLDivElement).clientWidth / (viewWidth * 50);
		}
		(this.table.nativeElement as HTMLDivElement).style.transform = "scale(" + scale + ")";
		console.log(this.table.nativeElement);
		console.log((this.table.nativeElement as HTMLDivElement).parentElement);
		// (this.table.nativeElement as HTMLDivElement).parentElement.style.height = (this.table.nativeElement as HTMLDivElement).clientHeight * scale + "px";
		(this.table.nativeElement as HTMLDivElement).parentElement.style.height = (this.viewable.position.maxY - this.viewable.position.minY + 1) * 50 * scale + "px";
		(this.table.nativeElement as HTMLDivElement).style.width = viewWidth * 50 + "px";
		//(this.table.nativeElement as HTMLDivElement).style.height = (this.table.nativeElement as HTMLDivElement).clientHeight * scale + "px";

		this.processed = true;
	}

	showGobInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		for (let k = 0; k < this.viewable.gobelins.length; k++) {
			if (this.viewable.gobelins[k].posX == x && this.viewable.gobelins[k].posY == y) {
				txt += "(" + this.viewable.gobelins[k].num + ") " + this.viewable.gobelins[k].name + " [" + this.viewable.gobelins[k].level + "] " + this.viewable.gobelins[k].posX + "/" + this.viewable.gobelins[k].posY + "/" + this.viewable.gobelins[k].posN + "<br/>";
			}
		}
		this.setTooltip(e, txt);
	}

	showMonsterInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		for (let k = 0; k < this.viewable.creatures.length; k++) {
			if (this.viewable.creatures[k].posX == x && this.viewable.creatures[k].posY == y) {
				txt += "(" + this.viewable.creatures[k].num + ") " + this.viewable.creatures[k].name + " [" + this.viewable.creatures[k].level + "] " + this.viewable.creatures[k].posX + "/" + this.viewable.creatures[k].posY + "/" + this.viewable.creatures[k].posN + "<br/>";
			}
		}
		this.setTooltip(e, txt);
	}

	showTreasorsInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		for (let k = 0; k < this.viewable.tresors.length; k++) {
			if (this.viewable.tresors[k].posX == x && this.viewable.tresors[k].posY == y) {
				txt += "(" + this.viewable.tresors[k].num + ") " + this.viewable.tresors[k].name + " " + this.viewable.tresors[k].posX + "/" + this.viewable.tresors[k].posY + "/" + this.viewable.tresors[k].posN + "<br/>";
			}
		}
		this.setTooltip(e, txt);
	}

	showPlantsInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		for (let k = 0; k < this.viewable.plantes.length; k++) {
			if (this.viewable.plantes[k].posX == x && this.viewable.plantes[k].posY == y) {
				txt += "(" + this.viewable.plantes[k].num + ") " + this.viewable.plantes[k].name + " " + this.viewable.plantes[k].posX + "/" + this.viewable.plantes[k].posY + "/" + this.viewable.plantes[k].posN + "<br/>";
			}
		}
		this.setTooltip(e, txt);
	}

	showLieuxInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		for (let k = 0; k < this.viewable.lieux.length; k++) {
			if (this.viewable.lieux[k].posX == x && this.viewable.lieux[k].posY == y) {
				txt += "(" + this.viewable.lieux[k].num + ") " + this.viewable.lieux[k].name + " " + this.viewable.lieux[k].posX + "/" + this.viewable.lieux[k].posY + "/" + this.viewable.lieux[k].posN + "<br/>";
			}
		}
		this.setTooltip(e, txt);
	}

	hideInfo(): void {
		(this.tooltip.nativeElement as HTMLDivElement).style.display = "none";
	}

	private setCellDist(cell: HTMLDivElement, minDist: number): number {
		minDist = 20 - (Math.min(4, Math.max(0, minDist - 3)) * 2);
		cell.style.width = minDist + "px";
		cell.style.height = minDist + "px";
		return minDist;
	}

	private setTooltip(e: MouseEvent, txt: string): void {
		(this.tooltip.nativeElement as HTMLDivElement).innerHTML = txt;
		(this.tooltip.nativeElement as HTMLDivElement).style.display = "";
		(this.tooltip.nativeElement as HTMLDivElement).style.top = (e.pageY + 25) + "px";
		(this.tooltip.nativeElement as HTMLDivElement).style.left = (e.pageX + 25) + "px";
	}
}
