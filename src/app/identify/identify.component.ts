import {Component, Injector, OnInit, ViewChild} from '@angular/core';

import {GuildplacesService} from './../core/services/identify/guildplaces.service';
import {ItemsService} from '../core/services/identify/items.service';
import {CollectionView, GroupDescription, PropertyGroupDescription, SortDescription} from 'wijmo/wijmo';
import {Subscription} from 'rxjs';
import {DataMap} from 'wijmo/wijmo.grid';
import {QeosGridComponent} from '../core/components/QeosGrid/qeosgrid.component';

@Component({
	selector: 'app-root',
	templateUrl: './identify.component.html'
})
export class IdentifyComponent implements OnInit {

	busy = false;
	text = "Refresh";
	cvMain: CollectionView = null;
	subsMain: Subscription;

	dtmQuality = new DataMap([
		{key: -1, value: "---"},
		{key: 0, value: ""},
		{key: 1, value: "Médiocre"},
		{key: 2, value: "Moyenne"},
		{key: 3, value: "Normale"},
		{key: 4, value: "Bonne"},
		{key: 5, value: "Exceptionnelle"}
	], "key", "value");

	@ViewChild("grid") grid: QeosGridComponent;

	constructor(protected injector: Injector,
				protected itemsService: ItemsService,
				protected guildplacesService: GuildplacesService) {
		this.subsMain = this.guildplacesService.get().subscribe((res) => {
			this.cvMain = new CollectionView(res);
		});
	}

	initGrid() {

	}

	ngOnInit(): void {
		this.grid.filter.filterColumns = [
			"Identifie", "Category", "Type", "Matiere"
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
				this.grid.filter.filterDefinition = JSON.stringify({
					"defaultFilterType": 3,
					"filters": [
						{"binding": "Identifie", "type": "value", "filterText": "", "showValues": {"true": true}},
						{"binding": "Category", "type": "value", "filterText": "", "showValues": {"Équipement": true}}
					]
				});
				// sort
				this.cvMain.sortDescriptions.clear();
				this.cvMain.sortDescriptions.push(new SortDescription('Type', true));
				this.cvMain.sortDescriptions.push(new SortDescription('Stars', false));
				// group
				this.cvMain.groupDescriptions.clear();
				this.cvMain.groupDescriptions.push((new PropertyGroupDescription('Type') as GroupDescription));
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
				this.cvMain.sortDescriptions.push(new SortDescription('Stars', false));
				// group
				this.cvMain.groupDescriptions.clear();
				// collapse
				this.grid.collapseGroupsToLevel(this.grid.collectionView.groupDescriptions.slice().length);
				break;
			case "r":
				// filter
				this.grid.filter.filterDefinition = JSON.stringify({
					"defaultFilterType": 3,
					"filters": [
						{"binding": "Identifie", "type": "value", "filterText": "", "showValues": {"true": true}},
						{"binding": "Category", "type": "value", "filterText": "", "showValues": {"Équipement": true, "Outil": true}},
						// {"binding": "Matiere", "type": "value", "filterText": "", "showValues": {"": false}}
						{"binding": "Matiere", "type": "value", "filterText": "", "showValues": {"Bois":true,"Cuir":true,"Fer":true,"Pierre":true,"Tissus":true}}
					]
				});
				// sort
				this.cvMain.sortDescriptions.clear();
				this.cvMain.sortDescriptions.push(new SortDescription('Type', true));
				this.cvMain.sortDescriptions.push(new SortDescription('Carats', false));
				// group
				this.cvMain.groupDescriptions.clear();
				this.cvMain.groupDescriptions.push((new PropertyGroupDescription('Matiere') as GroupDescription));
				// collapse
				this.grid.collapseGroupsToLevel(0);
				break;
			case "m":
				// filter
				this.grid.filter.filterDefinition = JSON.stringify({
					"defaultFilterType": 3,
					"filters": [{"binding": "Category", "type": "value", "filterText": "", "showValues": {"Matériaux": true}}]
				});
				// sort
				this.cvMain.sortDescriptions.clear();
				this.cvMain.sortDescriptions.push(new SortDescription('Type', true));
				this.cvMain.sortDescriptions.push(new SortDescription('Carats', false));
				// group
				this.cvMain.groupDescriptions.clear();
				this.cvMain.groupDescriptions.push((new PropertyGroupDescription('Matiere') as GroupDescription));
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
}
