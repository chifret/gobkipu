import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WjGridModule } from "wijmo/wijmo.angular2.grid";

import { routes } from "./app.routing";

import { AppComponent } from './app.component'
import { TeamComponent } from './team/team.component';
import { TravelTravelComponent } from './travel/travel-travel.component';
import { SpotTravelComponent } from './travel/spot-travel.component';
import { ViewComponent } from './view/view.component';
import { IdentifyComponent } from './identify/identify.component';
import { LoginComponent } from './login/login.component';

import { PlacesService } from './core/services/places/places.service';
import { GuildplacesService } from './core/services/identify/guildplaces.service';
import { ItemsService } from './core/services/identify/items.service';
import { LoginService } from './core/services/login.service';
import { MeuteService } from './core/services/meute/meute.service';
import { CopyPasteViewComponent } from './view/copypaste-view.component';
import { ViewService } from './core/services/view/view.service';
import { BabylonjsService } from './core/services/babylonjs.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    WjGridModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    TeamComponent,
    TravelTravelComponent,
    SpotTravelComponent,
    ViewComponent,
    CopyPasteViewComponent,
    IdentifyComponent,
    LoginComponent
    //WjFilterPanelComponent,
    //WjGridFilterModule
  ],
  providers: [
    PlacesService,
    BabylonjsService,
    GuildplacesService,
    ItemsService,
    LoginService,
    MeuteService,
    ViewService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
