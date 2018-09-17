import { Component, ViewChild, ElementRef } from '@angular/core';

import { LoginService } from '../core/services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './login.component.html'
})
export class LoginComponent {

    idg: number;
    clan: string;
    meute: string;

    constructor(protected loginService: LoginService) {
        const token = this.loginService.getToken();
        this.idg = token ? token.id : null;
        this.clan = token ? token.clan : null;
        this.meute = token ? token.meute : null;
    }

    login() {
        this.loginService.login({ id: this.idg, clan: this.clan, meute: this.meute });
    }
}
