import { Component, ViewChild } from '@angular/core';
import { IonicPage, AlertController, App, ItemSliding, List, ModalController, NavController, NavParams, ToastController, LoadingController, Refresher } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { EventsData } from '../../providers/events/events-data';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {
  username: string;
  shownEvents: any = [];
  groups: any = [];

  queryText = '';
  excludeTracks: any = [];

  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('eventList', { read: List }) eventList: List;


  constructor(
    public navCtrl: NavController,
    public app: App,
    public navParams: NavParams,
    public user: UserProvider,
    public utils: UtilsProvider,
    public eventsDataProvider: EventsData) {

    let userInfo = this.user._user;
    if (userInfo && userInfo !== null) {
      this.username = 'for ' + userInfo.name;
    }
  }

  ionViewDidLoad() {
    this.app.setTitle('Event');
    this.updateEvents();
  }

  updateEvents() {
    // Close any open sliding items when the schedule updates
    this.eventList && this.eventList.closeSlidingItems();

    this.eventsDataProvider.getTimeline(this.queryText)
      .subscribe((data: { visibleGroups: number, groups: Array<{ date: string, hide: boolean, events: Array<{ any }> }> }) => {
        this.shownEvents = data.visibleGroups;
        this.groups = data.groups;
      });
  }

  presentFilter() {
  }

  goToEventDetail(EventData: any) {
    //this.navCtrl.push(EventDetailPage, { eventId: eventData.id, name: eventData.name });
  }
}
