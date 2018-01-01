import { Component } from '@angular/core';
import { IonicPage, NavParams, ToastController, LoadingController, Config, NavController } from 'ionic-angular';
import { FollowData } from '../../providers/follow-data';
import { GroupsData } from '../../providers/groups-data';

import { EventsPage } from '../pages';
import { Constants } from '../../providers/constants';
import { UtilsProvider } from '../../providers/utils';
import { Subscriber } from 'rxjs/Subscriber';
import { GroupDetailPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-follow-list',
  templateUrl: 'follow-list.html'
})
export class FollowListPage {
  groups: any[] = [];
  private groupCategory: any;

  public constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private followData: FollowData,
    private groupsData: GroupsData,
    private constants: Constants,
    public utils: UtilsProvider
  ) {
  }

  private ionViewDidEnter() {
    if (this.navParams.data && this.navParams.data.param) {
      this.groupCategory = this.navParams.data.param;
    }

    this.fetchData();
  }

  private hideNoGroupsMessage() {
    return (this.groups.length > 0);
  }

  private showEvents(group: any) {
    this.navCtrl.push(EventsPage, { group: group });
  }

  private fetchData(refreshFromServer: boolean = false) {
    if (!this.groupCategory) {
      return;
    }

    let loading = this.loadingCtrl.create({
      content: `Fetching groups.`
    });

    if (refreshFromServer) {
      loading.present();
    }

    this.followData.getGroups(refreshFromServer, this.groupCategory).subscribe((groups: any[]) => {
      loading.dismiss();
      this.groups = groups;
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Could not fetch the groups',
        duration: this.constants.toastDuration,
        position: 'top'
      });
      loading.dismiss();
      toast.present();
    });
  }
}
