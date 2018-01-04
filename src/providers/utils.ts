import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from './constants';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Utils is for utilities
 */
@Injectable()
export class UtilsProvider {
  public constructor(
    private inAppBrowser: InAppBrowser,
    private constants: Constants
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

  public navigateTo(address: string) {
    var mapLink = 'https://www.google.com/maps/place/';
    var normalizedAddress = address.replace(/ /g, '+');
    this.browseTo(mapLink + normalizedAddress);
  }

  public browseTo(url: string) {
    this.inAppBrowser.create(url, '_system');
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
    if (privacySetting && privacySetting === 'Closed') {
      return 'ios-lock-outline';
    }
    return 'ios-open-outline';
  }

  public getPrivacyMessage(privacySetting: string): string {
    if (privacySetting && privacySetting === 'Closed') {
      return 'Not visible to others';
    }
    return 'Visible to others';
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
