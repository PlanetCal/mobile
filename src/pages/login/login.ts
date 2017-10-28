import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { MainPage } from '../pages';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
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

  // Attempt to login in through our User service
  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.user.login(this.account).subscribe((resp) => {
        this.navCtrl.push(MainPage);
      }, (err) => {
        this.navCtrl.push(MainPage);
        // Unable to log in
        // let toast = this.toastCtrl.create({
        //   message: this.loginErrorString,
        //   duration: 3000,
        //   position: 'top'
        // });
        //toast.present();
      });
    }
  }

  onSignup() {
    //this.navCtrl.push(SignupPage);
  }
}
