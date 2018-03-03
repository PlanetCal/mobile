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
  selector: 'page-group-list',
  templateUrl: 'group-list.html'
})
export class GroupListPage {
  private groups: any[] = [];
  private groupType: any;
  private parentGroup: any;

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
    if (this.navParams.data && this.navParams.data.groupType) {
      this.groupType = this.navParams.data.groupType;
      this.fetchData(null);
    }
    else {
      this.parentGroup = this.navParams.data ? this.navParams.data.group : null;
      this.fetchData(this.parentGroup);
    }
  }

  private goToGroupDetail(group: any) {
    this.navCtrl.push(GroupDetailPage, { group: group });
  }

  private showParentGroup(group: any) {
    this.navCtrl.push(GroupDetailPage, { groupId: group.parentGroup });
  }

  private hideNoGroupsMessage() {
    return (this.groups.length > 0);
  }

  private deleteGroup(group: any, groupList: any) {
    this.groupsData.deleteGroup(group, groupList, this.parentGroup).subscribe((groupId: any) => {
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: 'Could not delete the group',
        duration: this.constants.toastDuration,
        position: 'top'
      });
      toast.present();
    });

  }

  private showChildGroups(group: any) {
    this.navCtrl.push(GroupListPage, { group: group });
  }

  private showEvents(group: any) {
    this.navCtrl.push(EventsPage, { group: group });
  }

  private fetchData(parentGroup: any) {
    if (!parentGroup && !this.groupType) {
      return;
    }

    // let loading = this.loadingCtrl.create({
    //   content: `Fetching groups.`
    // });

    //loading.present();

    this.groupsData.getGroups(parentGroup, this.groupType).subscribe((groups: any[]) => {
      //loading.dismiss();
      this.groups = groups;
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Could not fetch the groups',
        duration: this.constants.toastDuration,
        position: 'top'
      });
      //loading.dismiss();
      toast.present();
    });
  }
}
