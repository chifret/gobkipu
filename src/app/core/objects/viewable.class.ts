import {CreatureClass} from "./creature.class";
import {TresorClass} from "./tresor.class";
import {LieuxClass} from "./lieux.class";
import {PlanteClass} from "./plante.class";

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
	creatures: Map<number, CreatureClass> = new Map();
	gobelins: Map<number, CreatureClass> = new Map();
	tresors: Map<number, TresorClass> = new Map();
	lieux: Map<number, LieuxClass> = new Map();
	plantes: Map<number, PlanteClass> = new Map();
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
		creatures: Map<number, CreatureClass>,
		gobelins: Map<number, CreatureClass>,
		tresors: Map<number, TresorClass>,
		lieux: Map<number, LieuxClass>,
		plantes: Map<number, PlanteClass>,
		viewerLevel: number = null,
		viewerAllies: number[] = null,
		viewerSearches: string[] = null) {
		this.creatures = creatures;
		this.lieux = lieux;
		this.gobelins = gobelins;
		this.plantes = plantes;
		this.position = position;
		this.tresors = tresors;
		this.viewerLevel = viewerLevel;
		this.viewerAllies = viewerAllies;
		this.viewerSearches = viewerSearches;
	}
}
