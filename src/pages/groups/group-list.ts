import { Component } from '@angular/core';
import { IonicPage, NavParams, ToastController, LoadingController, ActionSheet, ActionSheetController, ActionSheetOptions, Config, NavController } from 'ionic-angular';
import { GroupsData } from '../../providers/groups-data';
import { GroupDetailPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html'
})
export class GroupListPage {
  actionSheet: ActionSheet;
  groups: any[] = [];
  private data: string;

  public constructor(
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    navParams: NavParams,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private groupsData: GroupsData,
    private config: Config
  ) {
    this.data = navParams.data;
  }

  private ionViewDidLoad() {
    this.fetchData();
  }

  private goToGroupDetail(group: any) {
    this.navCtrl.push(GroupDetailPage, { group: group });
  }

  private fetchData(refreshFromServer: boolean = false) {
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
