import { Routes } from "@angular/router";

import { TravelTravelComponent } from "./travel/travel-travel.component";
import { SpotTravelComponent } from "./travel/spot-travel.component";
import { IdentifyComponent } from "./identify/identify.component";
import { LoginComponent } from "./login/login.component";
import { TeamComponent } from "./team/team.component";
import { CopyPasteViewComponent } from "./view/copypaste-view.component";

export const routes: Routes = [
    {
        path: "team",
        component: TeamComponent
    },
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
        component: CopyPasteViewComponent
    },
    {
        path: "identify",
        component: IdentifyComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "team"
    }
];
