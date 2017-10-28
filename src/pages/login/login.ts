import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';

@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {

  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };

  submitted = false;

  constructor(public navCtrl: NavController, public user: UserProvider) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      //this.user.login(this.login.username);
      //this.navCtrl.push(TabsPage);
    }
  }

  onSignup() {
    //this.navCtrl.push(SignupPage);
  }
}
