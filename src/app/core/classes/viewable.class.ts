import {CreatureClass} from "../objects/creature.class";
import {TresorClass} from "../objects/tresor.class";
import {LieuxClass} from "../objects/lieux.class";
import {PlanteClass} from "../objects/plante.class";
import {ItemClass} from "./item.class";
import {Twodimmap} from "./twodimmap.class";

export class ViewableClass {

	position: {
		avgPosN: number,
		minX: number,
		maxX: number,
		minY: number,
		maxY: number,
		minN: number,
		maxN: number
	} = {
		avgPosN: null,
		minX: null,
		maxX: null,
		minY: null,
		maxY: null,
		minN: null,
		maxN: null
	};

	rangeMin: number = null;
	rangeMax: number = null;

	creatures = new Twodimmap<CreatureClass>();
	gobelins = new Twodimmap<CreatureClass>();
	tresors = new Twodimmap<TresorClass>();
	lieux = new Twodimmap<LieuxClass>();
	plantes = new Twodimmap<PlanteClass>();

	viewerLevel: number = null;
	viewerAllies: number[] = [];
	viewerSearches: string[] = [];

	constructor(
		position: {
			avgPosN: number,
			minX: number,
			maxX: number,
			minY: number,
			maxY: number,
			minN: number,
			maxN: number
		} = {
			avgPosN: null,
			minX: null,
			maxX: null,
			minY: null,
			maxY: null,
			minN: null,
			maxN: null
		},
		creatures: Twodimmap<CreatureClass>,
		gobelins: Twodimmap<CreatureClass>,
		tresors: Twodimmap<TresorClass>,
		lieux: Twodimmap<LieuxClass>,
		plantes: Twodimmap<PlanteClass>,
		viewerLevel: number = null,
		viewerAllies: number[] = null,
		viewerSearches: string[] = null) {
		this.position = position;

		this.creatures = creatures;
		this.lieux = lieux;
		this.gobelins = gobelins;
		this.plantes = plantes;
		this.tresors = tresors;

		this.viewerLevel = viewerLevel;
		this.viewerAllies = viewerAllies;
		this.viewerSearches = viewerSearches;
	}

	setVisibility(rangeMin: number, rangeMax: number): void {
		this.rangeMin = rangeMin;
		this.rangeMax = rangeMax;
		if (this.rangeMin == null) {
			this.rangeMin = -99999;
		}
		if (this.rangeMax == null) {
			this.rangeMax = 99999;
		}
		this.setItemListVisibility(this.creatures, this.rangeMin, this.rangeMax);
		this.setItemListVisibility(this.gobelins, this.rangeMin, this.rangeMax);
		this.setItemListVisibility(this.tresors, this.rangeMin, this.rangeMax);
		this.setItemListVisibility(this.lieux, this.rangeMin, this.rangeMax);
		this.setItemListVisibility(this.plantes, this.rangeMin, this.rangeMax);
	}

	private setItemListVisibility(items: Twodimmap<ItemClass>, rangeMin: number, rangeMax: number): void {
		items.forEach(item => {
			item.visible = !(item.posN < rangeMin || item.posN > rangeMax);
		});
	}
}
