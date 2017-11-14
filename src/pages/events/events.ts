import { Component, ViewChild } from '@angular/core';
import { IonicPage, AlertController, App, ItemSliding, List, ModalController, NavController, NavParams, ToastController, LoadingController, Refresher } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { EventsData } from '../../providers/events/events-data';
import { UtilsProvider } from '../../providers/utils/utils';

import { EventDetailPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {
  segment = 'all';
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
    public alertCtrl: AlertController,
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

    this.eventsDataProvider.getTimeline(this.queryText, this.segment)
      .subscribe((data: { visibleGroups: number, groups: Array<{ date: string, hide: boolean, events: Array<{ any }> }> }) => {
        this.shownEvents = data.visibleGroups;
        this.groups = data.groups;
      });
  }

  presentFilter() {
  }

  goToEventDetail(eventData: any) {
    this.navCtrl.push(EventDetailPage, { eventData: eventData });
  }

  addFavorite(slidingItem: ItemSliding, eventData: any) {

    // if (this.user.hasFavorite(eventData.name)) {
    //   // woops, they already favorited it! What shall we do!?
    //   // prompt them to remove it
    //   this.removeFavorite(slidingItem, eventData, 'Favorite already added');
    // } else {
    //   // remember this session as a user favorite
    //   this.user.addFavorite(eventData.name);

    // create an alert instance
    let alert = this.alertCtrl.create({
      title: 'Favorite Added',
      buttons: [{
        text: 'OK',
        handler: () => {
          // close the sliding item
          slidingItem.close();
        }
      }]
    });
    // now present the alert on top of all other content
    alert.present();
  }



  removeFavorite(slidingItem: ItemSliding, eventData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            // this.user.removeFavorite(eventData.name);
            // this.updateEvents();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }
}
