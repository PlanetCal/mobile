import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})

export class EventDetailPage {
  event: any;

  constructor(
    public navParams: NavParams,
    public utils: UtilsProvider) {
  }

  ionViewWillEnter() {
    this.event = this.navParams.data.eventData;
  }
}
