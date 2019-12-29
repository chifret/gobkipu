import { Injector } from '@angular/core';

import { PlacesService } from '../services/places/places.service';
import { PositionClass } from '../objects/position.class';
import { DistanceUtils } from '../utils/business/distance-utils';


export abstract class TravelClass {
  private placeSubscription = null;
  places = null;
  placeTypes: { name: string, subtype: string }[] = [];
  placeSearch: any[];
  placesService: PlacesService;

  constructor(protected injector: Injector) {
    this.placesService = this.injector.get(PlacesService);
    this.placesService.getJSON().subscribe(
      (data) => {
        if (data) {
          this.initPlaces(data);
        }
      },
      (error) => {
      });
  }

  initPlaces(data: any): void {
    this.places = data;
    this.places.forEach(element => {
      if (this.placeTypes.map(function (e) { return e.name; }).indexOf(element.name) === -1) {
        this.placeTypes.push({ name: element.name, subtype: element.subtype });
      }
    });
    this.placeTypes.sort(function (a, b) {
      return a.name < b.name ? -1 : 1;
    });
  }
}
