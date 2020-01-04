import {Component, ElementRef, OnDestroy, ViewChild} from "@angular/core";
import {ViewableClass} from "../../objects/viewable.class";
import {AssetssService} from "app/core/services/assets/assets.service";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "app/core/utils/subscription.utils";
import {ViewUtils} from "../../utils/view.utils";
import {ChangeContext, Options} from "ng5-slider";
import {debounce} from "../../functions/debounce.function";

@Component({
	selector: "view-component",
	templateUrl: "./view.component.html"
})
export class ViewComponent implements OnDestroy {

	viewable: ViewableClass;
	processed = false;
	order: string = null;
	debouncer: any = null;
	rangeMin = 0;
	rangeMax = 0;
	rangeOpt: Options = {
		floor: 0,
		ceil: 0,
		draggableRange: true
	};

	protected readonly namepartToItemSubscription: Subscription = null;
	protected namepartToItem: { name: string, material: string, value: number }[] = null;
	protected readonly nameToItemSubscription: Subscription = null;
	protected nameToItem: Map<string, { material: string, value: number }> = null;
	protected followers: string[] = ["Créature mécanique", "Arme dansante", "Pixie", "Esprit-rôdeur", "Pierreux", "Squelette"];

	@ViewChild("table", {static: true}) table: ElementRef;
	@ViewChild("tooltip", {static: true}) tooltip: ElementRef;

	constructor(protected assetsService: AssetssService) {
		this.namepartToItemSubscription = this.assetsService.getNamepartToItem().subscribe(data => {
			this.namepartToItem = data;
		});
		this.nameToItemSubscription = this.assetsService.getNameToItem().subscribe(data => {
			this.nameToItem = data;
		});
	}

	onUserChange(changeContext: ChangeContext): void {
		this.debouncer = debounce(() => {
			console.log(changeContext.value + " " + changeContext.highValue);
			this.viewable.setVisibility(changeContext.value, changeContext.highValue);
			this.renderView();
		}, this.debouncer, 750);
	}

	setNewRange(min: number, max: number): void {
		// Due to change detection rules in Angular, we need to re-create the options object to apply the change
		this.rangeMin = min;
		this.rangeMax = max;
		const options: Options = Object.assign({}, this.rangeOpt);
		options.floor = min;
		options.ceil = max;
		options.draggableRange = true;
		this.rangeOpt = options;
	}

	ngOnDestroy(): void {
		SubscriptionUtils.unsubs(this.namepartToItemSubscription);
		SubscriptionUtils.unsubs(this.nameToItemSubscription);
	}

	renderView(viewable?: ViewableClass) {
		console.log("begin");
		if (viewable) {
			this.viewable = viewable;
		}
		(this.table.nativeElement as HTMLDivElement).innerHTML = "";
		(this.table.nativeElement as HTMLDivElement).style.transform = "scale(1)";
		(this.table.nativeElement as HTMLDivElement).style.width = "auto";
		(this.table.nativeElement as HTMLDivElement).style.height = "auto";

		for (let y = this.viewable.position.maxY; y >= this.viewable.position.minY; y--) {
			const row = document.createElement("div") as HTMLDivElement;
			row.style.display = "table-row";
			row.style.width = "auto";
			(this.table.nativeElement as HTMLDivElement).appendChild(row);
			for (let x = this.viewable.position.minX; x <= this.viewable.position.maxX; x++) {
				const cell = document.createElement("div") as HTMLDivElement;
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
					if (creature.posX === x && creature.posY === y && creature.visible) {
						const diffDist = Math.abs(this.viewable.position.avgPosN - creature.posN);
						let diffLevel = null;
						if (this.viewable.viewerLevel) {
							diffLevel = creature.level - this.viewable.viewerLevel;
						}
						if (this.followers.indexOf(creature.race) > -1 && creature.race !== creature.name) {
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
						if (creature.dist === -1) {
							cell.style.border = "1px solid white";
							cell.style.boxShadow = "0px 0px 15px white, 0px 0px 15px white";
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
					if (gobelin.posX === x && gobelin.posY === y && gobelin.visible) {
						if (gobelin.num > 0 && gobelin.num <= 14) {
							hasGod = true;
						} else if (this.viewable.viewerAllies && this.viewable.viewerAllies.indexOf(gobelin.num) > -1) {
							hasAllies = true;
						} else {
							hasRegularGobs = true;
						}
						if (gobelin.dist === -1) {
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
				let maxValue = 0;
				this.viewable.tresors.forEach((tresor) => {
					if (tresor.posX === x && tresor.posY === y && tresor.visible) {
						const diffLevel = Math.abs(this.viewable.position.avgPosN - tresor.posN);
						if (minDist === null || minDist > diffLevel) {
							minDist = diffLevel;
						}

						let found = false;
						const tmp = this.nameToItem.get(tresor.name);
						if (tmp) {
							found = true;
							tresor.value = tmp.value;
						}

						if (!found) {
							for (let v = 0; v < this.namepartToItem.length; v++) {
								if (tresor.name.indexOf(this.namepartToItem[v].name) > -1) {
									found = true;
									tresor.value = this.namepartToItem[v].value;
									break;
								}
							}
						}
						if (!found) {
							tresor.value = 0;
							console.log(tresor.name + " not listed !");
						}

						if (!maxValue || maxValue < tresor.value) {
							maxValue = tresor.value;
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
						case 0:
							infoC.style.backgroundColor = "#7f5f00";
							break;
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
					if (plante.posX === x && plante.posY === y && plante.visible) {
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
				const color: string = null;
				let hasTree = false;
				let hasBuilding = false;
				this.viewable.lieux.forEach((lieu) => {
					if (lieu.posX === x && lieu.posY === y && lieu.visible) {
						if (lieu.name === "Arbre" && !color) {
							hasTree = true;
						} else {
							hasBuilding = true;
						}
					}
				});
				if (hasTree || hasBuilding) {
					cell.addEventListener("mouseenter", (e: MouseEvent) => {
						this.showLieuxInfo(e, x, y);
					});
					cell.addEventListener("mouseleave", () => {
						this.hideInfo();
					});
					if (hasTree && hasBuilding) {
						const lang = Math.sqrt(2 * (50 * 50)) / 2;
						cell.style.background = "repeating-linear-gradient(45deg, green, green " + lang + "px, purple " + lang + "px, purple " + 2 * lang + "px)";
					} else if (hasTree) {
						cell.style.backgroundColor = "green";
					} else {
						cell.style.backgroundColor = "purple";
					}
				}
			}
		}

		console.log(this.viewable.rangeMin + " " + this.viewable.rangeMax);
		setTimeout(() => {
			const viewWidth = this.viewable.position.maxX - this.viewable.position.minX + 1;
			let scale = 1;
			if (viewWidth * 50 > (this.table.nativeElement as HTMLDivElement).clientWidth) {
				scale = (this.table.nativeElement as HTMLDivElement).clientWidth / (viewWidth * 50);
			}

			(this.table.nativeElement as HTMLDivElement).style.transform = "scale(" + scale + ")";
			(this.table.nativeElement as HTMLDivElement).parentElement.style.height = (this.viewable.position.maxY - this.viewable.position.minY + 1) * 50 * scale + "px";
			(this.table.nativeElement as HTMLDivElement).style.width = viewWidth * 50 + "px";

			if (viewable) {
				// means : if new view, not current one bug with range change
				this.setNewRange(this.viewable.position.minN, this.viewable.position.maxN);
			}
		}, 50);

		this.processed = true;
		console.log("processed");
	}

	// noinspection DuplicatedCode
	showGobInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.gobelins.forEach((item) => {
			if (item.posX === x && item.posY === y && item.visible) {
				txt += "(" + item.num + ") " + item.name + " [" + item.level + "] " + item.posX + "/" + item.posY + "/" + item.posN + "<br/>";
			}
		});
		this.setTooltip(e, txt);
	}

	// noinspection DuplicatedCode
	showMonsterInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.creatures.forEach((item) => {
			if (item.posX === x && item.posY === y && item.visible) {
				txt += "(" + item.num + ") " + item.name + " [" + item.level + "] " + item.posX + "/" + item.posY + "/" + item.posN + "<br/>";
			}
		});
		this.setTooltip(e, txt);
	}

	// noinspection DuplicatedCode
	showTreasorsInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.tresors.forEach((item) => {
			if (item.posX === x && item.posY === y && item.visible) {
				txt += "(" + item.num + ") " + item.name + " " + item.posX + "/" + item.posY + "/" + item.posN + "<br/>";
			}
		});
		this.setTooltip(e, txt);
	}

	// noinspection DuplicatedCode
	showPlantsInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.plantes.forEach((item) => {
			if (item.posX === x && item.posY === y && item.visible) {
				txt += "(" + item.num + ") " + item.name + " " + item.posX + "/" + item.posY + "/" + item.posN + "<br/>";
			}
		});
		this.setTooltip(e, txt);
	}

	// noinspection DuplicatedCode
	showLieuxInfo(e: MouseEvent, x: number, y: number): void {
		let txt = "";
		this.viewable.lieux.forEach((item) => {
			if (item.posX === x && item.posY === y && item.visible) {
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

	getPickOrder(): void {
		const map = new Map<number, { x: number, y: number, n: number }>();
		this.viewable.tresors.forEach((treasure) => {
			if (treasure.value >= 3 && treasure.visible) {
				map.set(treasure.num, {x: treasure.posX, y: treasure.posY, n: treasure.posN});
			}
		});
		if (map.size > 0) {
			let posals: { id: number, posal: { x: number, y: number, n: number } }[] = null;
			this.viewable.creatures.forEach((creature) => {
				if (creature.dist === -1) {
					posals = ViewUtils.getPath(map, {x: creature.posX, y: creature.posY, n: creature.posN});
				}
			});
			if (!posals) {
				this.viewable.gobelins.forEach((creature) => {
					if (creature.dist === -1) {
						posals = ViewUtils.getPath(map, {x: creature.posX, y: creature.posY, n: creature.posN});
					}
				});
			}
			if (!posals) {
				posals = ViewUtils.getPath(map);
			}

			//const posals = ViewUtils.getPath(map, {x: 53, y: 29, n: -9});
			if (posals.length > -1) {
				let ids = "";
				let move = "";
				posals.forEach((pos) => {
					move += "move(" + pos.posal.x + ", " + pos.posal.y + ", " + pos.posal.n + ");\n";
					ids += (ids !== "" ? ", " : "") + pos.id;
				});
				this.order = "foreach(objects() as o):\nif(in(id(o), array(" + ids + "))):\npick(OBJECT, id(o));\nendif;\nendforeach;\n" + move;
			} else {
				this.order = null;
			}
		} else {
			this.order = null;
		}
	}

	private static setCellDist(cell: HTMLDivElement, minDist: number): number {
		minDist = 20 - (Math.min(5, Math.max(0, minDist - 2)) * 2);
		cell.style.width = minDist + "px";
		cell.style.height = minDist + "px";
		return minDist;
	}
}
