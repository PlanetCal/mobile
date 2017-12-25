import { Component } from '@angular/core';
import { IonicPage, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { GroupsData } from '../../providers/groups-data';

@IonicPage()
@Component({
  selector: 'page-group-detail',
  templateUrl: 'group-detail.html'
})

export class GroupDetailPage {
  group: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private groupsData: GroupsData,
    private navParams: NavParams) {
  }

  ionViewWillEnter() {
    var groupId = this.navParams.data.groupId;
    var group = this.navParams.data.group;
    if (group) {
      this.group = group;
    }
    else if (groupId) {
      //fetch group data from backend.
      let loading = this.loadingCtrl.create({
        content: `Fetching groups.`
      });
      loading.present();

      this.groupsData.getGroup(groupId).subscribe((group: any) => {
        loading.dismiss();
        this.group = group;
      }, (err) => {
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: 'Could not fetch the group',
          duration: 3000,
          position: 'top'
        });
        loading.dismiss();
        toast.present();
      });

    }
  }
}  
