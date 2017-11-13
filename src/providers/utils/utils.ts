import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Utils is for utilities
 */
@Injectable()
export class UtilsProvider {
  productName: string;
  eventsFields: string;

  constructor() {
    this.productName = 'PlanetCal';
    this.eventsFields = 'fields=name|description|startDateTime|endDateTime|address|location|groupId|icon';
  }

  convertToDateString(dateTime: Date): string {
    let month = dateTime.getMonth() + 1;
    return dateTime.getFullYear() + '-' + month + '-' + dateTime.getDate();
  }

  convertToFriendlyDate(dateTime: Date): string {
    return dateTime.toDateString();
  }

  convertToFriendlyDateFromDateString(dateTime: string): string {
    let date = new Date(dateTime);
    let returnString = date.toLocaleDateString('en-us') + ' ' +
      date.toLocaleTimeString('en-us');
    return returnString;
  }

  convertToTime(dateTime: string): string {
    let returnString = new Date(dateTime).toLocaleTimeString('en-US');
    return returnString;
  }

  // getDuration(startDatetime: string, endDateTime: string): string {
  //   let startDate = new Date(startDatetime);
  //   let endDate = new Date(endDateTime);
  // }

  getHttpHeaders(authToken: string = null) {
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
