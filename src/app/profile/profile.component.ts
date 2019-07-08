import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {TeamService} from "app/core/services/meute/team.service";
import {GuildService} from "app/core/services/clan/guild.service";
import {GobsTypings} from "app/core/typings/gobs.typings";

@Component({
	selector: 'app-root',
	templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

	gob: GobsTypings = null;
	private readonly routeSubscription: Subscription;
	private id: number;
	private teamMembresSubscription: Subscription = null;
	private guildMembresSubscription: Subscription = null;

	constructor(protected route: ActivatedRoute,
				protected teamService: TeamService,
				protected guildService: GuildService) {
		this.routeSubscription = this.route.params.subscribe(params => {
			this.id = params["id"];
		});
	}

	ngOnInit(): void {
		this.teamMembresSubscription = this.teamService.get().subscribe(members => {
			members.forEach(member => {
				if (member.Id == this.id && !this.gob) {
					this.gob = member;
				}
			});
		});
		this.guildMembresSubscription = this.guildService.get().subscribe(members => {
			members.forEach(member => {
				if (member.Id == this.id && !this.gob) {
					this.gob = member;
				}
			});
		});
	}

	ngOnDestroy(): void {
		if (this.routeSubscription)
			this.routeSubscription.unsubscribe();
		if (this.teamMembresSubscription)
			this.teamMembresSubscription.unsubscribe();
		if (this.guildMembresSubscription)
			this.guildMembresSubscription.unsubscribe();
	}
}
