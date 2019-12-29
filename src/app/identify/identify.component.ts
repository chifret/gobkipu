import {Component, ElementRef, Injector, OnInit, ViewChild} from "@angular/core";

import {GuildplacesService} from "app/core/services/identify/guildplaces.service";
import {CollectionView, GroupDescription, PropertyGroupDescription, SortDescription} from "wijmo/wijmo";
import {Subscription} from "rxjs";
import {DataMap} from "wijmo/wijmo.grid";
import {QeosGridComponent} from "../core/components/QeosGrid/qeosgrid.component";
import {RecyclageService} from "../core/services/identify/recyclage.service";
import {GuildPlaceItemsTypings} from "../core/typings/guildplaceitems.typings";

@Component({
	selector: "app-root",
	templateUrl: "./identify.component.html"
})
export class IdentifyComponent implements OnInit {

	busy = false;
	text = "Refresh";
	cvMain: CollectionView = null;
	subsMain: Subscription;
	recyclage: { niveau: number, atelier: boolean, crochetGriffe: boolean };

	dtmQuality = new DataMap([
		{key: -1, value: "---"},
		{key: 0, value: ""},
		{key: 1, value: "Médiocre"},
		{key: 2, value: "Moyenne"},
		{key: 3, value: "Normale"},
		{key: 4, value: "Bonne"},
		{key: 5, value: "Except."},
		{key: 10, value: ""},
		{key: 11, value: "Amer"},
		{key: 12, value: "Acide"},
		{key: 13, value: "Amidonné"},
		{key: 14, value: "Salé"},
		{key: 15, value: "Sucré"},
		{key: 16, value: "Pimenté"}
	], "key", "value");

	@ViewChild("grid", {static: true}) grid: QeosGridComponent;
	@ViewChild("niveauRecyclageInput", {static: false}) niveauRecyclageInput: ElementRef;
	@ViewChild("atelierCheckbox", {static: false}) atelierCheckbox: ElementRef;
	@ViewChild("griffesCrochetCheckbox", {static: false}) griffesCrochetCheckbox: ElementRef;

	constructor(protected injector: Injector,
				protected guildplacesService: GuildplacesService,
				protected recyclageService: RecyclageService) {
	}

	initGrid() {

	}

	ngOnInit(): void {
		this.subsMain = this.guildplacesService.get().subscribe((res) => {
			this.cvMain = new CollectionView(res);
		});
		this.recyclage = this.recyclageService.get()[0];

		this.grid.filter.filterColumns = [
			"Identifie", "Category", "Type", "Nom", "Matiere", "Poids", "Localisation", "Qualite"
		];
		this.grid.headersVisibility = 1;
	}

	refresh() {
		this.subsMain = this.guildplacesService.get(true).subscribe((res) => {
			this.cvMain = new CollectionView(res);
		});
	}

	preset(preset: string): void {
		switch (preset) {
			case "e":
				// filter
				// noinspection JSNonASCIINames,NonAsciiCharacters
				this.grid.filter.filterDefinition = JSON.stringify({
					"defaultFilterType": 3,
					"filters": [
						{"binding": "Identifie", "type": "value", "filterText": "", "showValues": {"true": true}},
						{"binding": "Category", "type": "value", "filterText": "", "showValues": {"Équipement": true}}
					]
				});
				// sort
				this.cvMain.sortDescriptions.clear();
				this.cvMain.sortDescriptions.push(new SortDescription("Type", true));
				this.cvMain.sortDescriptions.push(new SortDescription("Stars", false));
				// group
				this.cvMain.groupDescriptions.clear();
				this.cvMain.groupDescriptions.push((new PropertyGroupDescription("Type") as GroupDescription));
				// collapse
				this.grid.collapseGroupsToLevel(this.grid.collectionView.groupDescriptions.slice().length);
				break;
			case "i":
				// filter
				this.grid.filter.filterDefinition = JSON.stringify({
					"defaultFilterType": 3,
					"filters": [{"binding": "Identifie", "type": "value", "filterText": "", "showValues": {"false": true}}]
				});
				// sort
				this.cvMain.sortDescriptions.clear();
				this.cvMain.sortDescriptions.push(new SortDescription("Stars", false));
				// group
				this.cvMain.groupDescriptions.clear();
				// collapse
				this.grid.collapseGroupsToLevel(this.grid.collectionView.groupDescriptions.slice().length);
				break;
			case "ir":
				// filter
				this.grid.filter.filterDefinition = JSON.stringify({
					"defaultFilterType": 3,
					"filters": [
						{"binding": "Identifie", "type": "value", "filterText": "", "showValues": {"false": true}},
						{"binding": "Matiere", "type": "condition", "condition1": {"operator": 1, "value": ""}, "and": true, "condition2": {"operator": null, "value": ""}}
					]
				});
				// sort
				this.cvMain.sortDescriptions.clear();
				this.cvMain.sortDescriptions.push(new SortDescription("Poids", false));
				// group
				this.cvMain.groupDescriptions.clear();
				this.cvMain.groupDescriptions.push((new PropertyGroupDescription("Matiere") as GroupDescription));
				// collapse
				this.grid.collapseGroupsToLevel(this.grid.collectionView.groupDescriptions.slice().length);
				break;
			case "r":
				// filter
				// noinspection JSNonASCIINames,NonAsciiCharacters
				this.grid.filter.filterDefinition = JSON.stringify({
					"defaultFilterType": 3,
					"filters": [
						{"binding": "Identifie", "type": "value", "filterText": "", "showValues": {"true": true}},
						{"binding": "Category", "type": "value", "filterText": "", "showValues": {"Équipement": true, "Outil": true}},
						{"binding": "Matiere", "type": "condition", "condition1": {"operator": 1, "value": ""}, "and": true, "condition2": {"operator": null, "value": ""}}
					]
				});
				// sort
				this.cvMain.sortDescriptions.clear();
				this.cvMain.sortDescriptions.push(new SortDescription("Matiere", true));
				this.cvMain.sortDescriptions.push(new SortDescription("Carats", false));
				// group
				this.cvMain.groupDescriptions.clear();
				this.cvMain.groupDescriptions.push((new PropertyGroupDescription("Matiere") as GroupDescription));
				// collapse
				this.grid.collapseGroupsToLevel(0);
				break;
			case "m":
				// filter
				// noinspection JSNonASCIINames,NonAsciiCharacters
				this.grid.filter.filterDefinition = JSON.stringify({
					"defaultFilterType": 3,
					"filters": [{"binding": "Category", "type": "value", "filterText": "", "showValues": {"Matériaux": true}}]
				});
				// sort
				this.cvMain.sortDescriptions.clear();
				this.cvMain.sortDescriptions.push(new SortDescription("Matiere", true));
				this.cvMain.sortDescriptions.push(new SortDescription("Carats", false));
				// group
				this.cvMain.groupDescriptions.clear();
				this.cvMain.groupDescriptions.push((new PropertyGroupDescription("Matiere") as GroupDescription));
				// collapse
				this.grid.collapseGroupsToLevel(0);
				break;
			default:
				console.log(this.grid.filter.filterDefinition);
				console.log(this.cvMain.sortDescriptions);
				console.log(this.cvMain.groupDescriptions);
		}
		this.grid.select(0, 0);
	}

	// getName(item: GuildPlaceItemsTypings): string {
	// 	if(item)
	// }

	//
	// updateRecyclage() {
	// 	console.log(this.niveauRecyclageInput.nativeElement.value + " " + this.atelierCheckbox.nativeElement.checked + " " + this.griffesCrochetCheckbox.nativeElement.checked);
	// 	this.recyclageService.set({
	// 		niveau: this.niveauRecyclageInput.nativeElement.value,
	// 		atelier: this.atelierCheckbox.nativeElement.checked,
	// 		crochetGriffe: this.griffesCrochetCheckbox.nativeElement.checked
	// 	});
	// }
}
