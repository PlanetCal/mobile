import { Component, ViewChild } from '@angular/core';
import { IonicPage, AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, NavParams, ToastController, LoadingController, Refresher } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {
  username: string;

  segment = 'all';
  shownEvents: any = [];
  groups: any = [];

  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('eventList', { read: List }) eventList: List;


  constructor(
    public navCtrl: NavController,
    public app: App,
    public navParams: NavParams,
    public user: UserProvider) {

    let userInfo = this.user._user;
    if (userInfo && userInfo !== null) {
      this.username = 'for ' + userInfo.name;
    }
  }

  ionViewDidLoad() {
    this.app.setTitle('Schedule');
    this.updateEvents();
  }


  updateEvents() {
    // Close any open sliding items when the schedule updates
    this.eventList && this.eventList.closeSlidingItems();

    // this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
    //   this.shownEvents = data.shownEvents;
    //   this.groups = data.groups;
    // });
  }

  presentFilter() {
  }

  goToEventDetail(EventData: any) {
    //this.navCtrl.push(EventDetailPage, { eventId: eventData.id, name: eventData.name });
  }
}
