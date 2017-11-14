import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { MainPage } from '../pages';
import { UserProvider } from '../../providers/user';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'logout.html'
})
export class LogoutPage {
  username: string;

  constructor(
    public navCtrl: NavController,
    public user: UserProvider) {

    let userInfo = this.user.getLoggedInUser();
    if (userInfo && userInfo !== null) {
      this.username = userInfo.name;
    }
  }

  onLogout() {
    this.user.logout();
    this.navCtrl.setRoot(MainPage);
  }

  onCancel() {
    this.navCtrl.setRoot(MainPage);
  }

}
