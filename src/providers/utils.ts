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
    return dateTime.getFullYear() + '-' + month + '-' + dateTime.getDate();
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

  public getEventIcon(event: any) {
    return (event.icon) ? event.icon : this.constants.defaultEventIcon;
  }

  public getGroupIcon(group: any) {
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
