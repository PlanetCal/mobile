import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FollowTabsPage } from '../pages';
import { GroupsPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-dummy',
  templateUrl: 'dummy.html'
})
export class DummyPage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
  ) {
  }

  private ionViewDidEnter() {
    let param = this.navParams.data;
    if (param === 'followGroups') {
      this.navCtrl.setRoot(FollowTabsPage);
    }
    else if (param === 'showGroups') {
      this.navCtrl.setRoot(GroupsPage);
    }
  }
}
