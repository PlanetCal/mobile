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
  private groups: Array<{ groupType: string, groupList: Array<any> }>;

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    private utils: UtilsProvider,
    private constants: Constants,
    private storage: Storage
  ) {
    this.groups = [
      {
        groupType: 'Subscribed',
        groupList: [
          {
            name: "sachin_Subscribed",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachin2",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachin3_Subscribed",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachin4",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachi53_Subscribed",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachin6_Subscribed",
            profilePic: "../assets/imgs/time-zones.png"
          }
        ]
      },
      {
        groupType: 'Owned',
        groupList: [
          {
            name: "sachin_Owned",
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
            name: "sachin4_Owned",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachi53",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachin6_Owned",
            profilePic: "../assets/imgs/time-zones.png"
          }
        ]
      }, {
        groupType: 'Administered',
        groupList: [
          {
            name: "sachin_Administered",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachin2",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachin3_Administered",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachin4",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachi53_Administered",
            profilePic: "../assets/imgs/time-zones.png"
          },
          {
            name: "sachin6",
            profilePic: "../assets/imgs/time-zones.png"
          }
        ]
      }
    ];
  }

  private load(refreshFromServer: boolean, groupType: string): any {

    let groupsOfThisGroupType = this.groups.find(x => x.groupType === groupType);
    let groupList = null;
    if (groupsOfThisGroupType) {
      groupList = groupsOfThisGroupType.groupList;
    }

    if (!refreshFromServer && groupList) {
      return Observable.of(groupList);
    } else {
      return this.getGroupDataFromServer(groupType)
        .map(this.processDataFromServer, this, groupType);
    }
  }

  private processDataFromServer(data: any, groupType: string) {

    let groupsOfThisGroupType = this.groups.find(x => x.groupType === groupType);
    if (groupsOfThisGroupType) {
      groupsOfThisGroupType.groupList = data;
    }
    else {
      this.groups.push({ groupType: groupType, groupList: data });
    }
    return data;
  }

  private getGroupDataFromServer(groupType: string): any {
    let endpoint = '';
    let token = null;
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      endpoint = 'groups';
      token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);
      let queryParams = '?filter=endDateTime>=' + this.utils.convertToDateString(new Date());
      queryParams += '&' + this.constants.eventsFields;
      endpoint += queryParams;
      return this.api.get(endpoint, null, reqOpts).share();
    }
    else {
      return Observable.of([]);
    }
  }

  public getGroups(refreshFromServer: boolean, groupType: string) {
    return this.load(refreshFromServer, groupType).map((data: { visibleGroups: number, groups: Array<any> }) => {
      return data;
    });
  }
}
