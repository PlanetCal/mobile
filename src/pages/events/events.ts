import { Component, ViewChild } from '@angular/core';
import { IonicPage, AlertController, ToastController, LoadingController, App, ItemSliding, List, NavController } from 'ionic-angular';

import { UserProvider } from '../../providers/user';
import { EventsData } from '../../providers/events-data';
import { UtilsProvider } from '../../providers/utils';
import { EventDetailPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {
  private segment = 'all';
  private username: string;
  private shownEvents: any = [];
  private groups: any = [];

  private queryText = '';

  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('eventList', { read: List }) eventList: List;


  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private app: App,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private user: UserProvider,
    private utils: UtilsProvider,

    private eventsDataProvider: EventsData) {

    let userInfo = this.user.getLoggedInUser();
    if (userInfo && userInfo !== null) {
      this.username = 'for ' + userInfo.name;
    }
  }

  ionViewDidLoad() {
    this.app.setTitle('Event');
    this.updateEvents();
  }

  private updateEvents(refreshFromServer: boolean = false) {
    // Close any open sliding items when the schedule updates
    this.eventList && this.eventList.closeSlidingItems();

    let loading = this.loadingCtrl.create({
      content: `Fetching events.`
    });
    loading.present();

    this.eventsDataProvider.getTimeline(refreshFromServer, this.queryText, this.segment)
      .subscribe((data: { visibleGroups: number, groups: Array<{ date: string, hide: boolean, events: Array<{ any }> }> }) => {
        this.shownEvents = data.visibleGroups;
        loading.dismiss();
        this.groups = data.groups;
      }, (err) => {
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: 'Could not fetch the events',
          duration: 3000,
          position: 'top'
        });
        loading.dismiss();
        toast.present();
      });
  }

  public presentFilter() {
  }

  public goToEventDetail(eventData: any) {
    this.navCtrl.push(EventDetailPage, { eventData: eventData });
  }

  public addFavorite(slidingItem: ItemSliding, eventData: any) {

    if (this.eventsDataProvider.isFavoriteEvent(eventData.id)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, eventData, 'Favorite already added');
    } else {
      // remember this event as a user favorite
      this.eventsDataProvider.addToFavoriteEvents(eventData.id);

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
  }

  public removeFavorite(slidingItem: ItemSliding, eventData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this event from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the event
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this event from their favorites
            this.eventsDataProvider.removeFromFavoriteEvents(eventData.id);
            this.updateEvents();

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
