import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { UserProvider } from './user';
import { ApiProvider } from './api';
import { UtilsProvider } from './utils';
import { Constants } from './constants';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class EventsData {
  private eventsGroupedByDate: { visibleGroups: number, groups: Array<{ date: string, hide: boolean, events: Array<{ any }> }> };
  private lastFetchedTimeStamp: Date;
  private eventsMap: any;
  private parentGroup: any;
  private _favoriteEvents: Array<string>;
  private FAVORITE_EVENTS = 'favoriteEvents';

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    private utils: UtilsProvider,
    private constants: Constants,
    private storage: Storage
  ) {
    this.storage.get(this.FAVORITE_EVENTS).then((value) => {
      this._favoriteEvents = value ? value : [];
    });
  }

  private load(): any {
    if (this.shouldUseCachedEvents()) {
      return Observable.of(this.eventsGroupedByDate);
    } else {
      return this.getEventsDataFromServer()
        .map(this.processDataFromServer, this);
    }
  }

  private shouldUseCachedEvents(): boolean {
    if (this.parentGroup && this.parentGroup.id) {
      return false;
    }

    var toReturn = false;
    var currentDateTime = new Date();
    if (this.lastFetchedTimeStamp) {
      var cacheExpiryDateTime = this.utils.addSeconds(this.lastFetchedTimeStamp, this.constants.cacheTimeoutInSeconds);
      toReturn = cacheExpiryDateTime > currentDateTime;
    }

    if (!toReturn) {
      this.lastFetchedTimeStamp = currentDateTime;
    }

    return toReturn;
  }

  public ClearEventCache(): void {
    this.lastFetchedTimeStamp = null;
  }

  public getEventsMap(): any {
    return Observable.of(this.eventsMap);
  }

  private getEventsDataFromServer() {
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
    let queryParams = '?' + this.constants.eventsFields;
    endpoint += queryParams;
    if (this.parentGroup && this.parentGroup.id) {
      endpoint += '&groupids=' + this.parentGroup.id;
    }
    else {
      endpoint += '&filter=endDateTime>=' + this.utils.convertToDateString(new Date());
    }
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
    let parentGroup = this.parentGroup;
    this.parentGroup = null;

    let eventsGroupedByDate = { visibleGroups: 0, groups: [] };
    let eventsMap = [];
    data.forEach((event: any) => {
      if (event.geoLocation &&
        event.geoLocation.coordinates &&
        event.geoLocation.coordinates.length === 2) {
        eventsMap.push({
          name: event.name,
          lat: event.geoLocation.coordinates[1],
          lng: event.geoLocation.coordinates[0],
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime
        })
      }

      let date = this.utils.convertToFriendlyDate(new Date(event.startDateTime));

      let eventsForThisDay = eventsGroupedByDate.groups.find(event => event.date === date);
      if (eventsForThisDay) {
        eventsForThisDay.events.push(event);
      }
      else {
        eventsGroupedByDate.groups.push({ date: date, hide: false, events: [event] });
      }
    }
    );

    if (!parentGroup) {
      this.eventsGroupedByDate = eventsGroupedByDate;
      this.eventsMap = eventsMap;
    }

    return eventsGroupedByDate;
  }

  public getTimeline(parentGroup: any, queryText: string = '', segment: string = 'all') {
    this.parentGroup = parentGroup;
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
