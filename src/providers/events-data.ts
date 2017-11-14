import { Injectable } from '@angular/core';

import { UserProvider } from './user';
import { ApiProvider } from './api';
import { UtilsProvider } from './utils';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class EventsData {
  private eventsGroupedByDate: { visibleGroups: number, groups: Array<{ date: string, hide: boolean, events: Array<{ any }> }> };
  private _favoriteEvents: Array<string>;
  private FAVORITE_EVENTS = 'favoriteEvents';

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    private utils: UtilsProvider,
    private storage: Storage
  ) {
    this.storage.get(this.FAVORITE_EVENTS).then((value) => {
      this._favoriteEvents = value ? value : [];
    });
  }

  private load(): any {
    if (this.eventsGroupedByDate) {
      return Observable.of(this.eventsGroupedByDate);
    } else {
      return this.getEventsDataFromServer(null)
        .map(this.processDataFromServer, this);
    }
  }

  private getEventsDataFromServer(accountInfo: any) {
    let endpoint = '';
    let token = null;
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      endpoint = 'events';
      token = userInfo.token;
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

  public addToFavoriteEvents(eventId: string) {
    let index = this._favoriteEvents.indexOf(eventId);
    if (index < 0) {
      this._favoriteEvents.push(eventId);
      this.storage.set(this.FAVORITE_EVENTS, this._favoriteEvents);
    }
  }

  public removeFromFavoriteEvents(eventId: string) {
    let index = this._favoriteEvents.indexOf(eventId);
    if (index >= 0) {
      this._favoriteEvents.splice(index, 1);
      this.storage.set(this.FAVORITE_EVENTS, this._favoriteEvents);
    }
  }

  public isFavoriteEvent(eventId: string) {
    let index = this._favoriteEvents.indexOf(eventId);
    return index >= 0;
  }


  private processDataFromServer(data: any) {
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

  public getTimeline(queryText = '', segment = 'all') {
    return this.load().map((data: { visibleGroups: number, groups: Array<{ date: string, hide: boolean, events: Array<{ any }> }> }) => {
      data.visibleGroups = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      data.groups.forEach((group: { date: string, hide: boolean, events: Array<{ any }> }) => {
        group.hide = true;

        group.events.forEach((event: any) => {
          // check if this event should show or not
          this.filterEvent(event, queryWords, segment);
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

  private filterEvent(event: any, queryWords: string[], segment: string) {
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

    // if the segement is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.isFavoriteEvent(event.id)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    event.hide = !(matchesQueryText && matchesSegment);
  }
}
