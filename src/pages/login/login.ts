import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { MainPage } from '../pages';
import { UserProvider } from '../../providers/user';
import { Constants } from '../../providers/constants';

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
  resetPasswordSuccessMessage: string;
  private loginErrorString: string;
  private resetPasswordSuccessString: string;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private constants: Constants,
    private user: UserProvider) {
    this.resetPasswordSuccessString = "Password reset request submitted."
    this.loginErrorString = "Login failed. Please check your username/password, or register yourself.";
  }

  // Attempt to login in through our User service
  onLogin(form: NgForm) {
    this.submitted = true;
    let loading = this.loadingCtrl.create({
      content: `Logging in`
    });
    loading.present();

    if (form.valid) {
      this.user.login(this.account).subscribe((resp) => {
        loading.dismiss();
        this.navCtrl.setRoot(MainPage);
      }, (err) => {
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: this.constants.toastDuration,
          position: 'top'
        });
        loading.dismiss();
        toast.present();
      });
    }
  }

  resetPassword(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.user.resetPassword(this.account).subscribe((resp) => {
        let toast = this.toastCtrl.create({
          message: this.resetPasswordSuccessString,
          duration: this.constants.toastDuration,
          position: 'top'
        });
        toast.present();
        this.resetPasswordSuccessMessage = 'Emailed you the validation link. Please follow the steps in your email. Login afterwards!';
      }, (err) => {
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: this.constants.toastDuration,
          position: 'top'
        });
        toast.present();
      });
    }
  }

  onCancel() {
    this.navCtrl.setRoot(MainPage);
  }
}
