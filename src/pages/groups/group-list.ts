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
  private data: any;

  public constructor(
    private navCtrl: NavController,
    navParams: NavParams,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private groupsData: GroupsData,
    private constants: Constants,
    public utils: UtilsProvider
  ) {
    if (navParams.data && navParams.data.param) {
      this.data = navParams.data.param;
      constants.groupTabName = this.data;
    } else {
      this.data = constants.groupTabName;
    }
  }

  private ionViewDidLoad() {
    this.fetchData();
  }

  private goToGroupDetail(group: any) {
    this.navCtrl.push(GroupDetailPage, { group: group });
  }

  private fetchData(refreshFromServer: boolean = false) {
    if (!this.data) {
      return;
    }

    let loading = this.loadingCtrl.create({
      content: `Fetching groups.`
    });
    loading.present();

    this.groupsData.getGroups(refreshFromServer, this.data).subscribe((groups: any[]) => {
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
