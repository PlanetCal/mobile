import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils';
import { GroupDetailPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})

export class EventDetailPage {
  event: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    public utils: UtilsProvider) {
  }

  ionViewWillEnter() {
    this.event = this.navParams.data.eventData;
  }

  browseToGroup(groupId) {
    this.navCtrl.push(GroupDetailPage, { groupId: groupId });
  }
}