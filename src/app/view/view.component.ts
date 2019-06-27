import {Component, ElementRef, ViewChild} from '@angular/core';

import {ViewableClass} from "../core/classes/viewable.class";

@Component({
	selector: 'view-component',
	templateUrl: './view.component.html'
})
export class ViewComponent {

	viewable: ViewableClass;
	processed = false;

	values: { type: string, value: number }[] = [
		{type: "Corps", value: 1},
		{type: "Parchemin", value: 5},
		{type: "Outil", value: 2},
		{type: "Nourriture", value: 2},
		{type: "Anneau", value: 4},
		{type: "Bijou", value: 4},
		{type: "CT", value: 1},
		{type: "Potion", value: 2},
		{type: "Talisman", value: 1},
		{type: "Casque", value: 1},
		{type: "Armure", value: 3},
		{type: "Bottes", value: 3},
		{type: "Baguette", value: 3},
		{type: "Bouclier", value: 3},
		{type: "Arme 1 Main", value: 3},
		{type: "Arme 2 mains", value: 3},
		{type: "Un tas de Canines de Trõll", value: 2},
		{type: "Une poignée de Canines de Trõll", value: 1},

		{type: "Rondin", value: 2},
		{type: "Cuir", value: 2},
		{type: "Tissus", value: 2},
		{type: "Tas de Terre", value: 2},

		{type: "Casque à cornes", value: 1},
		{type: "Cagoule", value: 1},
		{type: "Turban", value: 1},
		{type: "Casque à pointes", value: 1},

		{type: "Collier de dents", value: 1},
		{type: "Collier à pointes", value: 1},

		{type: "Toison", value: 1},

		{type: "Targe", value: 1},
	];

	valuesMateriaux: { type: string, value: number }[] = [
		{type: " centaines de Canines de Trõll", value: 3},
		{type: " en métal", value: 1},
		{type: " en cuir", value: 1},
		{type: " en cuir", value: 1},
		{type: " Adamantium", value: 5},
		{type: " Pierre", value: 2},
		{type: " Fer", value: 2},
		{type: " Argent", value: 5},
		{type: "d'Argent", value: 5},
		{type: " Cuivre", value: 5},
		{type: " Mithril", value: 5},
		{type: " Or", value: 5},
		{type: "d'Or", value: 5},
		{type: " Etain", value: 5},
		{type: "d'Etain", value: 5},
		{type: "Diamant", value: 5},
		{type: "Emeraude", value: 5},
		{type: "Obsidienne", value: 5},
		{type: "Opale", value: 5},
		{type: "Rubis", value: 5},
		{type: "Saphir", value: 5},
		{type: " de la Viverne", value: 5},
		{type: " du Centaure", value: 5},
		{type: " du Titan", value: 5},
		{type: " du Sphinx", value: 5},
		{type: " du Lézard Géant", value: 5},
		{type: " du Griffon", value: 5},
		{type: " du Minotaure", value: 5},
		{type: " de l'Oni", value: 5},
		{type: " du Golem", value: 5},
		{type: " du Galopin", value: 5},
		{type: " du Dragon", value: 5},
		{type: " du Phoenix", value: 5},
		{type: " de l'Ombre", value: 5},
		{type: " de Maître", value: 5},
		{type: "Cadavre ", value: 3}
	];

	followers: string[] = ["Créature mécanique", "CrÃ©ature mÃ©canique", "Arme dansante", "Pixie", "Esprit-rôdeur"];

	@ViewChild("table", {static: true}) table: ElementRef;
	@ViewChild("tooltip", {static: true}) tooltip: ElementRef;

	private static setCellDist(cell: HTMLDivElement, minDist: number): number {
		minDist = 20 - (Math.min(5, Math.max(0, minDist - 2)) * 2);
		cell.style.width = minDist + "px";
		cell.style.height = minDist + "px";
		return minDist;
	}

	renderView(viewable: ViewableClass) {

		this.viewable = viewable;
		(this.table.nativeElement as HTMLDivElement).innerHTML = "";
		(this.table.nativeElement as HTMLDivElement).style.transform = "scale(1)";
		(this.table.nativeElement as HTMLDivElement).style.width = "auto";
		(this.table.nativeElement as HTMLDivElement).style.height = "auto";

		console.log(this.viewable.viewerLevel);
		console.log(this.viewable.viewerAllies);
		console.log(this.viewable.viewerSearches);

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
				let maxLevel: number = null;
				let isSearched = false;
				let hasFollower = false;
				let hasMonster = false;
				this.viewable.creatures.forEach((creature) => {
					if (creature.posX == x && creature.posY == y) {
						const diffDist = Math.abs(this.viewable.position.avgPosN - creature.posN);
						let diffLevel = null;
						if (this.viewable.viewerLevel) {
							diffLevel = creature.level - this.viewable.viewerLevel;
						}
						if (this.followers.indexOf(creature.race) > -1) {
							hasFollower = true;
						} else {
							hasMonster = true;
							if (maxLevel === null || maxLevel < diffLevel) {
								maxLevel = diffLevel;
							}
						}
						if (minDist === null || minDist > diffDist) {
							minDist = diffDist;
						}
						if (this.viewable.viewerSearches && this.viewable.viewerSearches.indexOf(creature.name) > -1) {
							isSearched = true;
						}
						if (!infoC) {
							infoC = document.createElement("div") as HTMLDivElement;
							infoC.style.position = "absolute";
							infoC.style.top = "0";
							infoC.style.right = "0";
							infoC.addEventListener("mouseenter", (e: MouseEvent) => {
								this.showMonsterInfo(e, x, y);
							});
							infoC.addEventListener("mouseleave", () => {
								this.hideInfo();
							});
						}
					}
				});
				if (infoC) {
					let lang: number = ViewComponent.setCellDist(infoC, minDist);
					if (hasMonster) {
						let red = "red";
						if (maxLevel) {
							if (maxLevel >= 8) {
								red = "#a50f15";
							} else if (maxLevel >= 0) {
								red = "#cb181d";
							} else if (maxLevel >= -8) {
								red = "#ef3b2c";
							} else if (maxLevel >= -18) {
								red = "#fb6a4a";
							} else {
								red = "#fc9272";
							}
						}
						if (hasFollower) {
							lang = Math.sqrt(2 * (lang * lang)) / 2;
							infoC.style.background = "repeating-linear-gradient(45deg, " + red + ", " + red + " " + lang + "px, aquamarine " + lang + "px, aquamarine " + 2 * lang + "px)";
						} else {
							infoC.style.backgroundColor = red;
						}
					} else {
						infoC.style.backgroundColor = "aquamarine";
					}
					if (isSearched) {
						infoC.style.boxShadow = "0px 0px 40px #ef3b2c, 0px 0px 40px #ef3b2c, 0px 0px 40px #ef3b2c";
					}
					cell.appendChild(infoC);
				}

				// ------------------------------------------- gobelins -------------------------------------------
				infoC = null;
				minDist = null;
				let hasRegularGobs = false;
				let hasAllies = false;
				let hasGod = false;
				this.viewable.gobelins.forEach((gobelin) => {
					if (gobelin.posX == x && gobelin.posY == y) {
						if (gobelin.num <= 14) {
							hasGod = true;
						} else if (viewable.viewerAllies && viewable.viewerAllies.indexOf(gobelin.num) > -1) {
							hasAllies = true;
						} else {
							hasRegularGobs = true;
						}
						if (gobelin.dist == -1) {
							cell.style.border = "1px solid white";
							cell.style.boxShadow = "0px 0px 15px white, 0px 0px 15px white";
						}
						const diffLevel = Math.abs(this.viewable.position.avgPosN - gobelin.posN);
						if (minDist === null || minDist > diffLevel) {
							minDist = diffLevel;
						}
						if (!infoC) {
							infoC = document.createElement("div") as HTMLDivElement;
							infoC.style.position = "absolute";
							infoC.style.top = "0";
							infoC.style.left = "0";
							infoC.addEventListener("mouseenter", (e: MouseEvent) => {
								this.showGobInfo(e, x, y);
							});
							infoC.addEventListener("mouseleave", () => {
								this.hideInfo();
							});
						}

					}
				});
				if (infoC) {
					let lang: number = ViewComponent.setCellDist(infoC, minDist);
					if (hasGod) {
						if (hasAllies) {
							if (hasRegularGobs) {
								lang = Math.sqrt(2 * (lang * lang)) / 3;
								infoC.style.background = "repeating-linear-gradient(45deg, limegreen, limegreen " + lang + "px, " +
									"greenyellow " + lang + "px, greenyellow " + 2 * lang + "px," +
									"white " + 2 * lang + "px, white " + 3 * lang + "px)";
							} else {
								lang = Math.sqrt(2 * (lang * lang)) / 2;
								infoC.style.background = "repeating-linear-gradient(45deg, greenyellow, greenyellow " + lang + "px, white " + lang + "px, white " + 2 * lang + "px)";
							}
						} else {
							if (hasRegularGobs) {
								lang = Math.sqrt(2 * (lang * lang)) / 2;
								infoC.style.background = "repeating-linear-gradient(45deg, limegreen, limegreen " + lang + "px, white " + lang + "px, white " + 2 * lang + "px)";
							} else {
								infoC.style.backgroundColor = "white";
							}
						}
					} else {
						if (hasAllies) {
							if (hasRegularGobs) {
								lang = Math.sqrt(2 * (lang * lang)) / 2;
								infoC.style.background = "repeating-linear-gradient(45deg, limegreen, limegreen " + lang + "px, greenyellow " + lang + "px, greenyellow " + 2 * lang + "px)";
							} else {
								infoC.style.backgroundColor = "greenyellow";
							}
						} else {
							if (hasRegularGobs) {
								infoC.style.backgroundColor = "limegreen";
							} else {
								// cannot happens
								console.log("I said it cannot happens");
							}
						}
					}
					if (hasGod) {
						infoC.style.boxShadow = "0px 0px 15px white";
					}
					cell.appendChild(infoC);
				}

				// ------------------------------------------- trésors -------------------------------------------
				infoC = null;
				minDist = null;
				let maxValue: number = 0;
				this.viewable.tresors.forEach((tresor) => {
					if (tresor.posX == x && tresor.posY == y) {
						const diffLevel = Math.abs(this.viewable.position.avgPosN - tresor.posN);
						if (minDist === null || minDist > diffLevel) {
							minDist = diffLevel;
						}
						let itemValue = 2;

						let found = false;
						for (let v = 0; v < this.valuesMateriaux.length; v++) {
							if (tresor.name.indexOf(this.valuesMateriaux[v].type) > -1) {
								found = true;
								itemValue = this.valuesMateriaux[v].value;
								break;
							}
						}
						if (!found) {
							for (let v = 0; v < this.values.length; v++) {
								if (tresor.name === this.values[v].type) {
									found = true;
									itemValue = this.values[v].value;
									break;
								}
							}
						}
						if (!found) {
							console.log(tresor.name);
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
							infoC.addEventListener("mouseleave", () => {
								this.hideInfo();
							});
						}
					}
				});
				if (infoC) {
					ViewComponent.setCellDist(infoC, minDist);
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
							infoC.style.boxShadow = "0px 0px 15px #f8ed62";
							break;
						case 5:
							infoC.style.backgroundColor = "#fff9ae";
							infoC.style.boxShadow = "0px 0px 40px #f8ed62, 0px 0px 40px #f8ed62, 0px 0px 40px #f8ed62";
							break;
					}
					cell.appendChild(infoC);
				}

				// ------------------------------------------- plantes -------------------------------------------
				infoC = null;
				minDist = null;
				this.viewable.plantes.forEach((plante) => {
					if (plante.posX == x && plante.posY == y) {
						const diffLevel = Math.abs(this.viewable.position.avgPosN - plante.posN);
						if (minDist === null || minDist > diffLevel) {
							minDist = diffLevel;
						}
						if (!infoC) {
							infoC = document.createElement("div") as HTMLDivElement;
							infoC.style.position = "absolute";
							infoC.style.bottom = "0";
							infoC.style.backgroundColor = "#8fa245";
							infoC.style.right = "0";
							infoC.addEventListener("mouseenter", (e: MouseEvent) => {
								this.showPlantsInfo(e, x, y);
							});
							infoC.addEventListener("mouseleave", () => {
								this.hideInfo();
							});
						}
					}
				});
				if (infoC) {
					ViewComponent.setCellDist(infoC, minDist);
					cell.appendChild(infoC);
				}

				// ------------------------------------------- lieux -------------------------------------------
				let color: string = null;
				this.viewable.lieux.forEach((lieu) => {
					if (lieu.posX == x && lieu.posY == y) {
						if (lieu.name === "Arbre" && !color) {
							color = "green";
						} else {
							color = "purple";
						}
					}
				});
				if (color) {
					cell.style.backgroundColor = color;
					cell.addEventListener("mouseenter", (e: MouseEvent) => {
						this.showLieuxInfo(e, x, y);
					});
					cell.addEventListener("mouseleave", () => {
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
		// console.log(this.table.nativeElement);
		// console.log((this.table.nativeElement as HTMLDivElement).parentElement);
		// (this.table.nativeElement as HTMLDivElement).parentElement.style.height = (this.table.nativeElement as HTMLDivElement).clientHeight * scale + "px";
		(this.table.nativeElement as HTMLDivElement).parentElement.style.height = (this.viewable.position.maxY - this.viewable.position.minY + 1) * 50 * scale + "px";
		(this.table.nativeElement as HTMLDivElement).style.width = viewWidth * 50 + "px";
		//(this.table.nativeElement as HTMLDivElement).style.height = (this.table.nativeElement as HTMLDivElement).clientHeight * scale + "px";

		this.processed = true;
	}

	showGobInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.gobelins.forEach((item) => {
			if (item.posX == x && item.posY == y) {
				txt += "(" + item.num + ") " + item.name + " [" + item.level + "] " + item.posX + "/" + item.posY + "/" + item.posN + "<br/>";
			}
		});
		this.setTooltip(e, txt);
	}

	showMonsterInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.creatures.forEach((item) => {
			if (item.posX == x && item.posY == y) {
				txt += "(" + item.num + ") " + item.name + " [" + item.level + "] " + item.posX + "/" + item.posY + "/" + item.posN + "<br/>";
			}
		});
		this.setTooltip(e, txt);
	}

	showTreasorsInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.tresors.forEach((item) => {
			if (item.posX == x && item.posY == y) {
				txt += "(" + item.num + ") " + item.name + " " + item.posX + "/" + item.posY + "/" + item.posN + "<br/>";
			}
		});
		this.setTooltip(e, txt);
	}

	showPlantsInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.plantes.forEach((item) => {
			if (item.posX == x && item.posY == y) {
				txt += "(" + item.num + ") " + item.name + " " + item.posX + "/" + item.posY + "/" + item.posN + "<br/>";
			}
		});
		this.setTooltip(e, txt);
	}

	showLieuxInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.lieux.forEach((item) => {
			if (item.posX == x && item.posY == y) {
				txt += "(" + item.num + ") " + item.name + " " + item.posX + "/" + item.posY + "/" + item.posN + "<br/>";
			}
		});
		this.setTooltip(e, txt);
	}

	hideInfo(): void {
		(this.tooltip.nativeElement as HTMLDivElement).style.display = "none";
	}

	private setTooltip(e: MouseEvent, txt: string): void {
		(this.tooltip.nativeElement as HTMLDivElement).innerHTML = txt;
		(this.tooltip.nativeElement as HTMLDivElement).style.display = "";
		(this.tooltip.nativeElement as HTMLDivElement).style.top = (e.pageY + 25) + "px";
		(this.tooltip.nativeElement as HTMLDivElement).style.left = (e.pageX + 25) + "px";
	}
}
