import { Injectable } from '@angular/core';

import { UserProvider } from '../../providers/user/user';
import { ApiProvider } from '../api/api';
import { UtilsProvider } from '../utils/utils';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class EventsData {
  eventsGroupedByDate: { visibleGroups: number, groups: Array<{ date: string, hide: boolean, events: Array<{ any }> }> };

  constructor(
    public user: UserProvider,
    public api: ApiProvider,
    public utils: UtilsProvider,
  ) { }

  load(): any {
    if (this.eventsGroupedByDate) {
      return Observable.of(this.eventsGroupedByDate);
    } else {
      return this.getEventsDataFromServer(null)
        .map(this.processDataFromServer, this);
    }
  }

  getEventsDataFromServer(accountInfo: any) {
    let endpoint = '';
    let token = null;
    if (this.user._user) {
      endpoint = 'events';
      token = this.user._user.token;
    }
    else {
      endpoint = 'eventsanonymous';
    }
    let reqOpts = this.utils.getHttpHeaders(token);
    let queryParams = '?filter=endDateTime>=' + this.utils.convertToDateString(new Date());
    queryParams += '&' + this.utils.eventsFields;
    endpoint += queryParams;
    return this.api.get(endpoint, null, reqOpts).share();
  }

  processDataFromServer(data: any) {
    //{ visibleGroups: number, groups: Array<{ date: string, hide: boolean, events: Array<{ any }> }> };
    this.eventsGroupedByDate = { visibleGroups: 0, groups: [] };

    data.forEach((event: any) => {
      let date = this.utils.convertToFriendlyDate(new Date(event.startDateTime));

      let eventsForThisDay = this.eventsGroupedByDate.groups.find(event => event.date === date);
      if (eventsForThisDay) {
        eventsForThisDay.events.push(event);
      }
      else {
        this.eventsGroupedByDate.groups.push({ date: date, hide: false, events: [event] });
      }
    }
    );
    return this.eventsGroupedByDate;
  }

  getTimeline(queryText = '') {
    return this.load().map((data: { visibleGroups: number, groups: Array<{ date: string, hide: boolean, events: Array<{ any }> }> }) => {
      data.visibleGroups = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      data.groups.forEach((group: { date: string, hide: boolean, events: Array<{ any }> }) => {
        group.hide = true;

        group.events.forEach((event: any) => {
          // check if this event should show or not
          this.filterEvent(event, queryWords);
          if (!event.hide) {
            // if this event is not hidden then this group should show
            group.hide = false;
            data.visibleGroups++;
          }
        });
      });

      return data;
    });
  }

  filterEvent(event: any, queryWords: string[]) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the event name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (event.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this event passes the query test
      matchesQueryText = true;
    }

    event.hide = !matchesQueryText;
  }
}
