import { Component, Injector } from '@angular/core';

import { GuildplacesService } from './../core/services/identify/guildplaces.service';
import { ItemsService } from '../core/services/identify/items.service';
import { CollectionView } from 'wijmo/wijmo';

@Component({
    selector: 'app-root',
    templateUrl: './identify.component.html'
})
export class IdentifyComponent {

    protected placesByType: Map<string, any[]> = null;
    selectedOptions: string[] = [];

    top20: { distance: number, data: any[] }[] = [];
    worstTop20 = null;
    totPossibilities = 0;
    possibilities = 0;

    cvMain = new CollectionView();

    constructor(protected injector: Injector,
        protected itemsService: ItemsService,
        protected guildplacesService: GuildplacesService) {
    }


}
