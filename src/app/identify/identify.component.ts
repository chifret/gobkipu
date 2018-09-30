import { Component, Injector, ViewChild, OnInit } from '@angular/core';

import { GuildplacesService } from './../core/services/identify/guildplaces.service';
import { ItemsService } from '../core/services/identify/items.service';
import { CollectionView } from 'wijmo/wijmo';
import { Subscription } from 'rxjs';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { DataMap } from 'wijmo/wijmo.grid';
import { QeosGridComponent } from '../core/components/QeosGrid/qeosgrid.component';

@Component({
    selector: 'app-root',
    templateUrl: './identify.component.html'
})
export class IdentifyComponent implements OnInit {

    cvMain: CollectionView = null;
    subsMain: Subscription;

    dtmQuality = new DataMap([
        { key: -1, value: "---" },
        { key: 0, value: "" },
        { key: 1, value: "Médiocre" },
        { key: 2, value: "Moyenne" },
        { key: 3, value: "Normale" },
        { key: 4, value: "Bonne" },
        { key: 5, value: "Exceptionnelle" }
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
}
