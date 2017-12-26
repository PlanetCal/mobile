import { Component } from '@angular/core';
import { IonicPage, NavParams, ToastController, LoadingController, Config, NavController } from 'ionic-angular';
import { GroupsData } from '../../providers/groups-data';
import { GroupDetailPage } from '../pages';
import { Constants } from '../../providers/constants';
import { UtilsProvider } from '../../providers/utils';

@IonicPage()
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html'
})
export class GroupListPage {
  groups: any[] = [];
  private groupType: any;

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
      this.groupType = this.navParams.data.param;
      this.constants.groupTabName = this.groupType;
    } else {
      this.groupType = this.constants.groupTabName;
    }
    this.fetchData();
  }

  private goToGroupDetail(group: any) {
    this.navCtrl.push(GroupDetailPage, { group: group });
  }

  private fetchData(refreshFromServer: boolean = false) {
    if (!this.groupType) {
      return;
    }

    let loading = this.loadingCtrl.create({
      content: `Fetching groups.`
    });
    loading.present();

    this.groupsData.getGroups(refreshFromServer, this.groupType).subscribe((groups: any[]) => {
      loading.dismiss();
      this.groups = groups;
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Could not fetch the groups',
        duration: 3000,
        position: 'top'
      });
      loading.dismiss();
      toast.present();
    });
  }
}
