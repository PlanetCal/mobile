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

  convertToUTCDateString(dateTime: Date): string {
    let month = dateTime.getUTCMonth() + 1;
    return dateTime.getUTCFullYear() + '-' + month + '-' + dateTime.getUTCDate();
  }

  convertToFriendlyDate(dateTime: Date): string {
    return dateTime.toDateString();
  }

  convertToTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString('en-US');
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
