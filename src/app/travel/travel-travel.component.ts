import { Component, Injector } from '@angular/core';

import { TravelClass } from './travel.class';
import { Position } from './../core/classes/position';
import { DistanceUtils } from '../core/utils/business/distance-utils';

@Component({
  selector: 'app-root',
  templateUrl: './travel-travel.component.html'
})
export class TravelTravelComponent extends TravelClass {

  constructor(protected injector: Injector) {
    super(injector);
  }

  search(type: string, x: number, y: number, z: number, tp: boolean, p0: boolean, m10: boolean): void {
    console.log(p0);
    const currentPosition = new Position(x, y, z);
    this.placeSearch = [];
    this.places.forEach(element => {
      if (("null" === type || element.name === type || element.subtype === type)
        && element.x != null && element.y != null && element.z != null
        && (p0 || (!p0 && element.z <= 0))
        && (m10 || (!m10 && element.z >= -20))) {
        DistanceUtils.calculateTotalDistanceForElement(element, new Position(element.x, element.y, element.z), currentPosition, tp);
        this.placeSearch.push(element);
      }
    });
    this.placeSearch.sort(function (a, b) {
      return a.distance - b.distance;
    });
  }
}
