import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { MainPage } from '../pages';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';

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
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public user: UserProvider) {
    this.signupSuccessMessage = '';
    this.signupSuccessToast = "Signup request submitted."
    this.signupErrorToast = "Signup failed. Check if account already exists!";
  }

  // Attempt to signup in through our User service
  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.user.signup(this.account).subscribe((resp) => {
        let toast = this.toastCtrl.create({
          message: this.signupSuccessToast,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.signupSuccessMessage = 'Emailed you the validation link. Please follow the steps in your email. Login afterwards!';
      }, (err) => {
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: this.signupErrorToast,
          duration: 3000,
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
