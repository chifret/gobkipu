import {PositionClass} from '../../classes/position.class';

export class DistanceUtils {
    static calculateTotalDistanceForElement(element: any, p1: PositionClass, p2: PositionClass, tp: boolean): void {
    	if(tp){
			element.distanceTp = DistanceUtils.calculateTotalDistance(p1, p2, true);
		}else{
			element.distance = DistanceUtils.calculateTotalDistance(p1, p2, false);
		}
    }

    static calculateTotalDistance(p1: PositionClass, p2: PositionClass, tp: boolean): number {
        let distance = 0;
        const horiz = Math.max(DistanceUtils.calculateDistanceOneAxe(p1.x, p2.x), DistanceUtils.calculateDistanceOneAxe(p1.y, p2.y));
        const verti = DistanceUtils.calculateDistanceOneAxe(p1.z, p2.z);
        if (verti <= horiz) {
            distance = horiz + verti;
        } else {
            distance = verti * 2;
        }

        if (!tp) {
            let distanceSurface: number = DistanceUtils.calculateDistanceOneAxe(0, p1.z) + DistanceUtils.calculateDistanceOneAxe(0, p2.z);
            if (distanceSurface <= horiz) {
                distanceSurface = Math.ceil((horiz - verti) / 2 + verti * 2);
            } else {
                distanceSurface = verti * 2;
            }
            if (distanceSurface < distance) {
                distance = distanceSurface;
            }
        }

        return distance;
    }

    static calculateDistanceOneAxe(p1: number, p2: number) {
        return Math.abs(p1 - p2);
    }
}
