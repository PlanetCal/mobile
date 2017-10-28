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
    email: '',
    password: '1234'
  };

  submitted = false;
  private loginErrorString: string;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public user: UserProvider) {
    this.loginErrorString = "Login failed. Please check your username/password, or register yourself.";

  }

  // Attempt to login in through our User service
  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.user.login(this.account).subscribe((resp) => {
        this.navCtrl.push(MainPage);
      }, (err) => {
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    }
  }

  onSignup() {
    //this.navCtrl.push(SignupPage);
  }
  onCancel() {
    this.navCtrl.push(MainPage);
  }
}
