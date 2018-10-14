export class CreaturetypesUtils {
	static races = ["Nodef", "Musculeux", "Vis Yonnair", "Zozo Giste", "Trad Scion", "Mentalo"];

	static creatureIsGob(race: string, id: number): boolean {
		return id <= 14 || this.races.indexOf(race) >= 0;
	}
}