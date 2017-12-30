import { Component } from '@angular/core';
import { IonicPage, NavParams, ToastController, LoadingController, Config, NavController } from 'ionic-angular';
import { GroupsData } from '../../providers/groups-data';
import { GroupDetailPage } from '../pages';
import { EventsPage } from '../pages';
import { Constants } from '../../providers/constants';
import { UtilsProvider } from '../../providers/utils';
import { Subscriber } from 'rxjs/Subscriber';

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
    private groupsData: GroupsData,
    private constants: Constants,
    public utils: UtilsProvider
  ) {
  }

  private ionViewDidEnter() {
    if (this.navParams.data && this.navParams.data.param) {
      this.groupCategory = this.navParams.data.param;
      this.constants.followTabName = this.groupCategory;
    } else {
      this.groupCategory = this.constants.followTabName;
    }
    this.fetchData();
  }

  private goToGroupDetail(group: any) {
    this.navCtrl.push(GroupDetailPage, { group: group });
  }

  private hideNoGroupsMessage() {
    return (this.groups.length > 0);
  }

  private deleteGroup(group: any, groupCategory: string) {
    this.groupsData.deleteGroup(group, groupCategory).subscribe((groupId: any) => {
      let toast = this.toastCtrl.create({
        message: 'Deleted the group',
        duration: this.constants.toastDuration,
        position: 'top'
      });
      toast.present();
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: 'Could not delete the group',
        duration: this.constants.toastDuration,
        position: 'top'
      });
      toast.present();
    });

  }

  private updateSubscription(group: any, groupCategory: string) {
    this.groupsData.updateSubscription(group, groupCategory).subscribe((groupId: any) => {
      let toast = this.toastCtrl.create({
        message: 'Updated the subscription',
        duration: this.constants.toastDuration,
        position: 'top'
      });
      toast.present();
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: 'Could not update subscription',
        duration: this.constants.toastDuration,
        position: 'top'
      });
      toast.present();
    });
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

    this.groupsData.getGroups(refreshFromServer, this.groupCategory).subscribe((groups: any[]) => {
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
