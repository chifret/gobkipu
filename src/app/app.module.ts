import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WjCoreModule } from "wijmo/wijmo.angular2.core";
import { WjGridModule } from "wijmo/wijmo.angular2.grid";
import { WjGridFilterModule } from "wijmo/wijmo.angular2.grid.filter";
import { WjInputModule } from "wijmo/wijmo.angular2.input";
import { WjChartInteractionModule } from "wijmo/wijmo.angular2.chart.interaction";
import { WjChartModule } from "wijmo/wijmo.angular2.chart";
import { WjChartAnnotationModule } from "wijmo/wijmo.angular2.chart.annotation";
import { WjGridGrouppanelModule } from "wijmo/wijmo.angular2.grid.grouppanel";
import { WjGridDetailModule } from "wijmo/wijmo.angular2.grid.detail";
import { WjGridSheetModule } from "wijmo/wijmo.angular2.grid.sheet";
import { WjViewerModule } from "wijmo/wijmo.angular2.viewer";
import { WjNavModule } from "wijmo/wijmo.angular2.nav";

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

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes,
      {
        //enableTracing: true,
        useHash: true
      }),
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
