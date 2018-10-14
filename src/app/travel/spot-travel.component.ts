import { Component, Injector } from '@angular/core';

import { TravelClass } from './travel.class';
import { PositionClass } from '../core/classes/position.class';
import { DistanceUtils } from '../core/utils/business/distance-utils';

@Component({
    selector: 'app-root',
    templateUrl: './spot-travel.component.html'
})
export class SpotTravelComponent extends TravelClass {

    protected placesByType: Map<string, any[]> = null;
    selectedOptions: string[] = [];

    top20: { distance: number, data: any[] }[] = [];
    worstTop20 = null;
    totPossibilities = 0;
    possibilities = 0;

    constructor(protected injector: Injector) {
        super(injector);
    }

    search(type: any, tp: boolean, p0: boolean, m10: boolean): void {
        this.top20 = [];
        this.worstTop20 = null;
        this.possibilities = 0;
        this.totPossibilities = 0;

        // init places type map
        if (!this.placesByType) {
            this.initPlacesByType();
        }

        // cleaning dual places
        this.selectedOptions.forEach(valueSO => {
            this.placeTypes.forEach(valueP => {
                if (valueSO == valueP.name && valueP.subtype && valueP.subtype !== valueP.name) {
                    for (let i = 0; i < this.selectedOptions.length; i++) {
                        if (valueP.subtype === this.selectedOptions[i]) {
                            this.selectedOptions[i] = null;
                        }
                    }
                }
            });
        });
        this.selectedOptions = this.selectedOptions.filter(x => x != null) as string[];


        const map: Map<string, number> = new Map();
        for (let i = 0; i < this.selectedOptions.length; i++) {
            map.set(this.selectedOptions[i], 0);
        }
        let cont = true;
        while (cont) {
            let push = [];
            let valid = true;
            for (let i = 0; i < this.selectedOptions.length; i++) {
                const data = this.placesByType.get(this.selectedOptions[i])[map.get(this.selectedOptions[i])];
                push.push(data);
                if (!(data.x !== null && data.y !== null && data.z !== null
                    && (p0 || (!p0 && data.z <= 0))
                    && (m10 || (!m10 && data.z >= -20)))) {
                    valid = false;
                }
            }
            this.totPossibilities++;
            if (valid) {
                const distance = this.calculateMultipleDist(push, tp);
                if (distance >= 0) {
                    this.addToTop20(push, distance);
                }
            }
            for (let i = 0; i < this.selectedOptions.length; i++) {
                if (map.get(this.selectedOptions[i]) < this.placesByType.get(this.selectedOptions[i]).length - 1) {
                    map.set(this.selectedOptions[i], map.get(this.selectedOptions[i]) + 1);
                    break;
                } else {
                    let currentReached = false;
                    let testLast = false;
                    for (let j = 0; j < this.selectedOptions.length; j++) {
                        if (!currentReached) {
                            map.set(this.selectedOptions[j], 0);
                            if (this.selectedOptions[i] === this.selectedOptions[j]) {
                                currentReached = true;
                            }
                        } else {
                            testLast = true;
                            break;
                        }
                    }
                    if (currentReached && !testLast) {
                        cont = false;
                    }
                }
            }
        }
        //console.log(this.possibilities + " / " + this.totPossibilities);
        //console.log(this.top20);
        //console.log(this.top20[0]);
    }


    calculateMultipleDist(data: any[], tp: boolean, maxDist: number = 50): number {
        let distance = 0;
        for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
                const distTmp = DistanceUtils.calculateTotalDistance(new PositionClass(data[i].x, data[i].y, data[i].z), new PositionClass(data[j].x, data[j].y, data[j].z), tp);
                if (distTmp >= maxDist) {
                    return -1;
                }
                distance += distTmp;
            }
        }
        return distance;
    }

    addToTop20(data: any[], distance: number) {
        this.possibilities++;
        if (this.top20.length < 20 || distance < this.worstTop20) {
            this.top20.push({ distance: distance, data: data });
            this.top20.sort(function (a, b) {
                return a.distance - b.distance;
            });
            if (this.top20.length > 20) {
                this.top20.splice(20, 1);
            }
            this.worstTop20 = this.top20[this.top20.length - 1].distance;
        }
    }

    initPlacesByType(): void {
        this.placesByType = new Map();
        this.places.forEach(element => {
            if (!this.placesByType.has(element.name)) {
                this.placesByType.set(element.name, []);
            }
            this.placesByType.get(element.name).push(element);
            if (element.subtype && element.name !== element.subtype) {
                if (!this.placesByType.has(element.subtype)) {
                    this.placesByType.set(element.subtype, []);
                }
                this.placesByType.get(element.subtype).push(element);
            }
        });
        //console.log(this.placesByType);
    }

    setSelected(selectElement) {
        this.selectedOptions = [];
        for (var i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].selected == true) {
                this.selectedOptions.push(selectElement.options[i].value);
            }
        }
    }
}
