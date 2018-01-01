import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserProvider } from './user';
import { ApiProvider } from './api';
import { UtilsProvider } from './utils';
import { Constants } from './constants';
import { GroupsData } from './groups-data';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class FollowData {
  private groups: Array<{ groupCategory: string, groupList: Array<any> }>;

  private currentGroupCategory: string;

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    private utils: UtilsProvider,
    private groupsData: GroupsData,
    private constants: Constants,
    private storage: Storage
  ) {
    this.groups = [];
  }

  private load(refreshFromServer: boolean, groupCategory: string): any {
    this.currentGroupCategory = groupCategory;
    let groupsOfThisGroupCategory = this.groups.find(x => x.groupCategory === groupCategory);
    let groupList = null;
    if (groupsOfThisGroupCategory) {
      groupList = groupsOfThisGroupCategory.groupList;
    }

    if (!refreshFromServer && groupList) {
      return Observable.of(groupList);
    } else {
      return this.getGroupDataFromServer(groupCategory)
        .map(this.processDataFromServer, this);
    }
  }

  private processDataFromServer(data: any) {
    let groupsOfThisGroupCategory = this.groups.find(x => x.groupCategory === this.currentGroupCategory);
    if (groupsOfThisGroupCategory) {
      groupsOfThisGroupCategory.groupList = data;
    }
    else {
      this.groups.push({ groupCategory: this.currentGroupCategory, groupList: data });
    }
    return data;
  }

  private getGroupDataFromServer(groupCategory: string): any {
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      let endpoint = 'groups?fields=name|icon|category|childGroups|parentGroup&filter=category=' + groupCategory;
      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);
      let result = this.api.get(endpoint, null, reqOpts).share();
      return result;
    }
    else {
      return Observable.of([]);
    }
  }

  public getGroups(refreshFromServer: boolean, groupCategory: string) {
    return this.load(refreshFromServer, groupCategory).map((data: { visibleGroups: number, groups: Array<any> }) => {
      return data;
    });
  }
}
