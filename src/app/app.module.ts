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
import {TeamService} from 'app/core/services/meute/team.service';
import {CopyPasteViewComponent} from './view/copypaste-view.component';
import {ViewService} from './core/services/view/view.service';
import {QeosGridComponent} from './core/components/QeosGrid/qeosgrid.component';
import {QeosGridPanelsComponent} from './core/components/QeosGridPanels/qeosgridpanels.component';
import {RecyclageService} from "./core/services/identify/recyclage.service";
import {GuildService} from "app/core/services/clan/guild.service";
import {ProfileComponent} from "app/profile/profile.component";
import {AssetssService} from "app/core/services/assets/assets.service";
import {FollowersComponent} from "app/followers/followers.component";

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
		QeosGridPanelsComponent,
		ProfileComponent,
		FollowersComponent,
	],
	providers: [
		PlacesService,
		GuildplacesService,
		ItemsService,
		LoginService,
		TeamService,
		GuildService,
		ViewService,
		RecyclageService,
		AssetssService
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
