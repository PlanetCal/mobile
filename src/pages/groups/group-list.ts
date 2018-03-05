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
  private groupType: string;
  private customizedHelpMessage: string;
  private parentGroup: string;

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
      this.populateCustomizedHelpMessage(this.groupType);
      this.fetchData(null);
    }
    else {
      this.parentGroup = this.navParams.data ? this.navParams.data.group : null;
      this.fetchData(this.parentGroup);
    }
  }

  private populateCustomizedHelpMessage(groupType: string) {
    switch (this.groupType) {
      case (this.constants.subscribedGroup):
        this.customizedHelpMessage = `Follow some interesting groups to see their events in 'planet calendar app' 
        by going to \"Follow Groups\" from the top left Menu.`;
        break;
      case (this.constants.ownedGroup):
        this.customizedHelpMessage = `You can create a new group by visiting 'https://planetcal.com' 
        from your laptop (for best experience). You can create events under it and choose to share it with the world by 
        picking the privacy of your group as 'public' or 'private'. You can create a subgroup under a group to organize your events.
        This app does not have this funcationality yet.`;
        break;
      case (this.constants.administeredGroup):
        this.customizedHelpMessage = `Only an owner of some group can delegate you ,${this.groupType}, privilage. Afterwards that group will start showing up here. As a ${this.groupType} to a group, you will have full control over the group including 'deleting' it. Please use your privilage with great care.`;
        break;
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

    this.groupsData.getGroups(parentGroup, this.groupType).subscribe((groups: any[]) => {
      this.groups = groups;
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Could not fetch the groups',
        duration: this.constants.toastDuration,
        position: 'top'
      });
      toast.present();
    });
  }
}
