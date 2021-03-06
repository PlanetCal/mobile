import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from './constants';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';

/**
 * Utils is for utilities
 */
@Injectable()
export class UtilsProvider {
  public constructor(
    private inAppBrowser: InAppBrowser,
    private constants: Constants,
    private alertCtrl: AlertController
  ) {
  }

  public convertToDateString(dateTime: Date): string {
    let month = dateTime.getMonth() + 1;
    let day = dateTime.getDate();
    let monthString = (month > 9) ? month.toString() : '0' + month.toString();
    let dayString = (day > 9) ? day.toString() : '0' + day.toString();
    return dateTime.getFullYear() + '-' + monthString + '-' + dayString;
  }

  public convertToFriendlyDate(dateTime: Date): string {
    return dateTime.toDateString();
  }

  public addSeconds(date, seconds): Date {
    return new Date(date.getTime() + seconds * 1000);
  }

  public navigateTo(address: string) {
    var mapLink = 'https://www.google.com/maps/place/';
    var normalizedAddress = address.replace(/ /g, '+');
    this.browseTo(mapLink + normalizedAddress);
  }

  public browseTo(url: string) {
    this.inAppBrowser.create(url, '_system');
  }

  public showLoginAlert() {
    let alert = this.alertCtrl.create({
      title: 'Login!',
      subTitle: 'You need to be logged in first!',
      buttons: ['OK']
    });
    alert.present();
  }

  public convertToFriendlyDateFromDateString(dateTime: string): string {
    let date = new Date(dateTime);
    let returnString = date.toLocaleDateString('en-us') + ' ' +
      date.toLocaleTimeString('en-us');
    return returnString;
  }

  public convertToTime(dateTime: string): string {
    let returnString = new Date(dateTime).toLocaleTimeString('en-US');
    return returnString;
  }

  public getPrivacyIcon(privacySetting: string): string {
    return (privacySetting == 'Private') ? 'md-lock' : 'md-unlock';
  }

  public getPrivacyMessage(privacySetting: string): string {
    return (privacySetting == 'Private') ? 'Not visible to others' : 'Visible to others';
  }

  public getEventIcon(event: any): string {
    return (event.icon) ? event.icon : this.constants.defaultEventIcon;
  }

  public getGroupIcon(group: any): string {
    return (group.icon) ? group.icon : this.constants.defaultGroupIcon;
  }

  public getHttpHeaders(authToken: string = null) {
    if (authToken) {
      return {
        headers: new HttpHeaders({
          'Version': '1.0',
          'Accept': 'application/json',
          'Authorization': 'bearer ' + authToken
        })
      };
    }
    else {
      return {
        headers: new HttpHeaders({
          'Version': '1.0',
          'Accept': 'application/json'
        })
      };
    }
  }
}
