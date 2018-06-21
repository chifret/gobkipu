import { Routes } from "@angular/router";

import { TravelTravelComponent } from "./travel/travel-travel.component";
import { SpotTravelComponent } from "./travel/spot-travel.component";
import { ViewComponent } from "./view/view.component";

export const routes: Routes = [
    {
        path: "travel",
        component: TravelTravelComponent
    },
    {
        path: "spot",
        component: SpotTravelComponent
    },
    {
        path: "view",
        component: ViewComponent
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "travel"
    }
];
