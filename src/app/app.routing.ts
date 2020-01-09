import {Routes} from "@angular/router";

import {TravelTravelComponent} from "./travel/travel-travel.component";
import {SpotTravelComponent} from "./travel/spot-travel.component";
import {IdentifyComponent} from "./identify/identify.component";
import {LoginComponent} from "./login/login.component";
import {TeamComponent} from "./team/team.component";
import {CopyPasteViewComponent} from "./view/copypaste-view.component";
import {GuildComponent} from "./guild/guild.component";
import {ProfileComponent} from "app/profile/profile.component";
import {FollowersComponent} from "app/followers/followers.component";
import {CopypastemhViewComponent} from "./view/copypastemh-view.component";

export const routes: Routes = [
	{
		path: "team",
		component: TeamComponent
	},
	{
		path: "guild",
		component: GuildComponent
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
		path: "viewmh",
		component: CopypastemhViewComponent
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
		path: "profile/:id",
		component: ProfileComponent
	},
	{
		path: "followers",
		component: FollowersComponent
	},
	{
		path: "",
		redirectTo: "/team",
		pathMatch: "full"
	}
];
