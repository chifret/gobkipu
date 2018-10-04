import {Component} from '@angular/core';

import {LoginService} from '../core/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  busy = false;
  text = "Submit";

  idg: number;
  clan: string;
  meute: string;

  constructor(protected loginService: LoginService) {
    const token = LoginService.getToken();
    this.idg = token ? token.id : null;
    this.clan = token ? token.clan : null;
    this.meute = token ? token.meute : null;
  }

  login() {
    this.busy = true;
    this.loginService.login({id: this.idg, clan: this.clan, meute: this.meute})
      .subscribe((res) => {
        console.log(res);
        this.busy = false;
        this.text = "Ok !";
        setTimeout(() => {
          this.text = "Submit";
        }, 2000);
      });
  }
}
