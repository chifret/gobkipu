import {CreatureClass} from "./creature.class";
import {TresorClass} from "./tresor.class";
import {LieuxClass} from "./lieux.class";
import {PlanteClass} from "./plante.class";

export class ViewableClass {

	position: {
		posX: number,
		posY: number,
		posN: number,
		horiz: number,
		verti: number,

		avgPosN: number,
		minX: number,
		maxX: number,
		minY: number,
		maxY: number
	} = {
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
	};
	creatures: CreatureClass[] = [];
	gobelins: CreatureClass[] = [];
	tresors: TresorClass[] = [];
	lieux: LieuxClass[] = [];
	plantes: PlanteClass[] = [];

	constructor(
		position: {
			posX: number,
			posY: number,
			posN: number,
			horiz: number,
			verti: number,

			avgPosN: number,
			minX: number,
			maxX: number,
			minY: number,
			maxY: number
		} = {
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
		creatures: CreatureClass[],
		gobelins: CreatureClass[],
		tresors: TresorClass[],
		lieux: LieuxClass[],
		plantes: PlanteClass[]) {
		this.creatures = creatures;
		this.lieux = lieux;
		this.gobelins = gobelins;
		this.plantes = plantes;
		this.position = position;
		this.tresors = tresors;
	}
}