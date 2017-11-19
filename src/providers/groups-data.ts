import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { UserProvider } from './user';
import { ApiProvider } from './api';
import { UtilsProvider } from './utils';
import { Constants } from '../providers/constants';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class GroupsData {
  private groups: Array<any>;

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    private utils: UtilsProvider,
    private constants: Constants,
    private storage: Storage
  ) {
    this.groups = [
      {
        name: "sachin",
        profilePic: "../assets/imgs/time-zones.png"
      },
      {
        name: "sachin2",
        profilePic: "../assets/imgs/time-zones.png"
      },
      {
        name: "sachin3",
        profilePic: "../assets/imgs/time-zones.png"
      },
      {
        name: "sachin4",
        profilePic: "../assets/imgs/time-zones.png"
      },
      {
        name: "sachi53",
        profilePic: "../assets/imgs/time-zones.png"
      },
      {
        name: "sachin6",
        profilePic: "../assets/imgs/time-zones.png"
      }


    ];
  }

  private load(refreshFromServer: boolean, groupType: string): any {
    if (!refreshFromServer && this.groups) {
      return Observable.of(this.groups);
    } else {
      return this.getGroupDataFromServer(groupType);
    }
  }

  private getGroupDataFromServer(groupType: string) {
    let endpoint = '';
    let token = null;
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      endpoint = 'events';
      token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);
      let queryParams = '?filter=endDateTime>=' + this.utils.convertToDateString(new Date());
      queryParams += '&' + this.constants.eventsFields;
      endpoint += queryParams;
      return this.api.get(endpoint, null, reqOpts).share();
    }
    else {
      return null;
    }
  }

  public getGroups(refreshFromServer: boolean, groupType: string) {
    return this.load(refreshFromServer, groupType).map((data: { visibleGroups: number, groups: Array<any> }) => {
      return data;
    });
  }
}
