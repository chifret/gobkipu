import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {WjGridModule} from "wijmo/wijmo.angular2.grid";
import {WjCoreModule} from "wijmo/wijmo.angular2.core";
import {WjGridGrouppanelModule} from "wijmo/wijmo.angular2.grid.grouppanel";
import {WjGridFilterModule} from "wijmo/wijmo.angular2.grid.filter";
import {WjFilterPanelComponent} from "./core/components/WjFilterPanel/WjFilterPanel";

import {routes} from "./app.routing";

import {AppComponent} from './app.component'
import {TeamComponent} from './team/team.component';
import {GuildComponent} from "./guild/guild.component";
import {TravelTravelComponent} from './travel/travel-travel.component';
import {SpotTravelComponent} from './travel/spot-travel.component';
import {ViewComponent} from './view/view.component';
import {IdentifyComponent} from './identify/identify.component';
import {LoginComponent} from './login/login.component';

import {PlacesService} from './core/services/places/places.service';
import {GuildplacesService} from './core/services/identify/guildplaces.service';
import {ItemsService} from './core/services/identify/items.service';
import {LoginService} from './core/services/login.service';
import {MeuteService} from './core/services/meute/meute.service';
import {CopyPasteViewComponent} from './view/copypaste-view.component';
import {ViewService} from './core/services/view/view.service';
import {QeosGridComponent} from './core/components/QeosGrid/qeosgrid.component';
import {QeosGridPanelsComponent} from './core/components/QeosGridPanels/qeosgridpanels.component';
import {RecyclageService} from "./core/services/identify/recyclage.service";
import {ClanService} from "./core/services/clan/clan.service";

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		WjGridModule,
		WjCoreModule,
		WjGridFilterModule,
		WjGridGrouppanelModule,
		RouterModule.forRoot(routes),
	],
	declarations: [
		AppComponent,
		TeamComponent,
		GuildComponent,
		TravelTravelComponent,
		SpotTravelComponent,
		ViewComponent,
		CopyPasteViewComponent,
		IdentifyComponent,
		LoginComponent,
		WjFilterPanelComponent,
		QeosGridComponent,
		QeosGridPanelsComponent
	],
	providers: [
		PlacesService,
		GuildplacesService,
		ItemsService,
		LoginService,
		MeuteService,
		ClanService,
		ViewService,
		RecyclageService
	],
	entryComponents: [
		QeosGridPanelsComponent,
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {
}
