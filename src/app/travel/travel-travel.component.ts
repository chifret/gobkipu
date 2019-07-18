import { Component, Injector } from '@angular/core';

import { TravelClass } from './travel.class';
import { PositionClass } from '../core/classes/position.class';
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
    const currentPosition = new PositionClass(x, y, z);
    this.placeSearch = [];
    this.places.forEach(element => {
      if (("null" === type || element.name === type || element.subtype === type)
        && element.x != null && element.y != null && element.z != null
        && (p0 || (!p0 && element.z <= 0))
        && (m10 || (!m10 && element.z >= -20))) {
		  DistanceUtils.calculateTotalDistanceForElement(element, new PositionClass(element.x, element.y, element.z), currentPosition, true);
        DistanceUtils.calculateTotalDistanceForElement(element, new PositionClass(element.x, element.y, element.z), currentPosition, false);
        this.placeSearch.push(element);
      }
    });
    if(tp){
		this.placeSearch.sort(function (a, b) {
			return a.distanceTp - b.distanceTp;
		});
	}else {
		this.placeSearch.sort(function (a, b) {
			return a.distance - b.distance;
		});
	}
  }
}
