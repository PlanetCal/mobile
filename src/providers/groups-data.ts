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
  private currentGroupType: string;

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    private utils: UtilsProvider,
    private constants: Constants,
    private storage: Storage
  ) {
    this.groups = [];
  }

  private load(refreshFromServer: boolean, groupType: string): any {
    this.currentGroupType = groupType;
    let groupsOfThisGroupType = this.groups.find(x => x.groupType === groupType);
    let groupList = null;
    if (groupsOfThisGroupType) {
      groupList = groupsOfThisGroupType.groupList;
    }

    if (!refreshFromServer && groupList) {
      return Observable.of(groupList);
    } else {
      return this.getGroupDataFromServer(groupType)
        .map(this.processDataFromServer, this);
    }
  }

  private processDataFromServer(data: any) {
    let groupsOfThisGroupType = this.groups.find(x => x.groupType === this.currentGroupType);
    if (groupsOfThisGroupType) {
      groupsOfThisGroupType.groupList = data;
    }
    else {
      this.groups.push({ groupType: this.currentGroupType, groupList: data });
    }
    return data;
  }

  private getGroupDataFromServer(groupType: string): any {
    let endpoint = '';
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {

      switch (groupType) {
        case ('Administered'):
          endpoint = 'groups?' + this.constants.groupFieldsForAdmin + '&administeredByMe=true';
          break;
        case ('Owned'):
          endpoint = 'groups?' + this.constants.groupFieldsForAdmin + '&filter=createdBy=' + userInfo.id;
          break;
        case ('Subscribed'):
          endpoint = 'userdetails/' + userInfo.id + '/followinggroups?' + this.constants.groupFieldsForSubscriber;
          break;
      }

      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);
      return this.api.get(endpoint, null, reqOpts).share();
    }
    else {
      return Observable.of([]);
    }
  }

  public hideDeleteGroupButton(group: any, groupType: string): boolean {
    if (groupType == 'Owned') {
      return false;
    }
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      if (group.createdBy === userInfo.id || group.modifiedBy === userInfo.id) {
        return false;
      }
    }
    return true;
  }

  public hideSubscibeButton(group: any, groupType: string): boolean {
    if (groupType === 'Subscribed') {
      return true;
    }

    var hide = false;
    let subscribedGroups = this.groups.find(x => x.groupType === 'Subscribed').groupList;
    if (subscribedGroups) {
      var currentGroup = subscribedGroups.find(element => element.id === group.id);
      hide = currentGroup;
    }
    return hide;
  }

  public hideUnsubscibeButton(group: any, groupType: string): boolean {
    return !this.hideSubscibeButton(group, groupType);
  }

  public updateSubscription(group: any, subscribe: boolean): any {
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      var endpoint = 'userdetails/' + userInfo.id + '/followingGroups/' + group.id;
      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);

      if (subscribe) {

        return this.api.post(endpoint, null, reqOpts).share();
      }
      else {
        return this.api.delete(endpoint, reqOpts).share();
      }
    }
    else {
      //this should never hit.
      return Observable.of('');
    }
  }

  public addToSubscribedList(group: any) {

  }

  public getGroup(groupId) {
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      let endpoint = 'groups/' + groupId + '?' + this.constants.groupFieldsForSubscriber;
      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);
      return this.api.get(endpoint, null, reqOpts).share();
    }
    else {
      return Observable.of(null);
    }
  }

  public getGroups(refreshFromServer: boolean, groupType: string) {
    return this.load(refreshFromServer, groupType).map((data: { visibleGroups: number, groups: Array<any> }) => {
      return data;
    });
  }
}
