import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { MainPage } from '../pages';
import { UserProvider } from '../../providers/user';
import { Constants } from '../../providers/constants';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {

  account: { name: string, email: string, password: string } = {
    name: '',
    email: '',
    password: '1234'
  };

  submitted = false;
  signupSuccessMessage: string;
  private signupErrorToast: string;
  private signupSuccessToast: string;


  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private constants: Constants,
    private user: UserProvider) {
    this.signupSuccessMessage = '';
    this.signupSuccessToast = "Signup request submitted."
    this.signupErrorToast = "Signup failed. Check if account already exists!";
  }

  // Attempt to signup in through our User service
  onSignup(form: NgForm) {
    this.submitted = true;
    let loading = this.loadingCtrl.create({
      content: `Registering`
    });
    loading.present();
    if (form.valid) {
      this.user.signup(this.account).subscribe((resp) => {
        let toast = this.toastCtrl.create({
          message: this.signupSuccessToast,
          duration: this.constants.toastDuration,
          position: 'top'
        });
        loading.dismiss();
        toast.present();
        this.signupSuccessMessage = 'Emailed you the validation link. Please follow the steps in your email. Login afterwards!';
      }, (err) => {
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: this.signupErrorToast,
          duration: this.constants.toastDuration,
          position: 'top'
        });
        loading.dismiss();
        toast.present();
      });
    }
  }

  onCancel() {
    this.navCtrl.setRoot(MainPage);
  }
}
