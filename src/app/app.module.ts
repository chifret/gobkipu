import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { routes } from "./app.routing";

import { AppComponent } from './app.component'
import { TravelTravelComponent } from './travel/travel-travel.component';
import { SpotTravelComponent } from './travel/spot-travel.component';
import { ViewComponent } from './view/view.component';


import { PlacesService } from './core/services/places/places.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(routes,
      {
        //enableTracing: true,
        useHash: true
      }),
  ],
  declarations: [
    AppComponent,
    TravelTravelComponent,
    SpotTravelComponent,
    ViewComponent
  ],
  providers: [
    PlacesService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
