import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController } from 'ionic-angular';
import { MainPage } from '../pages';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'logout.html'
})
export class LogoutPage {

  submitted = false;
  private logoutErrorString: string;

  constructor(
    public navCtrl: NavController,
    public user: UserProvider) {

    // this.user.hasLoggedIn().then(function (hasLoggedIn) {
    //   if (hasLoggedIn === true) {
    //     this.user.getUserInfo().then((userInfo) => {
    //       if (userInfo !== null) {
    //         this.username = userInfo.name;
    //       }
    //     });
    //   }
    // });
  }

  onLogout() {
    this.user.logout();
    this.navCtrl.setRoot(MainPage);
  }
}
