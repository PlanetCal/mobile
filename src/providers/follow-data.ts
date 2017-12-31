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
export class FollowData {
  private groups: Array<{ groupCategory: string, groupList: Array<any> }>;
  private currentGroupCategory: string;

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    private utils: UtilsProvider,
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
    let endpoint = '';
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      let endpoint = 'groups?fields=name|icon|childGroups|parentGroup&filter=category=' + groupCategory;
      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);
      return this.api.get(endpoint, null, reqOpts).share();
    }
    else {
      return Observable.of([]);
    }
  }

  // public hideDeleteGroupButton(group: any, groupCategory: string): boolean {
  //   if (groupCategory == 'Owned') {
  //     return false;
  //   }
  //   let userInfo = this.user.getLoggedInUser();
  //   if (userInfo) {
  //     if (group.createdBy === userInfo.id || group.modifiedBy === userInfo.id) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  public getSubsciptionUpdateText(group: any, groupCategory: string): string {
    return this.hideSubscibeButton(group, groupCategory) ? 'Un-follow' : 'Follow';
  }

  private hideSubscibeButton(group: any, groupCategory: string): boolean {
    // if (groupCategory === 'Subscribed') {
    //   return true;
    // }

    // var hide = false;
    // let subscribedGroups = this.groups.find(x => x.groupCategory === 'Subscribed').groupList;
    // if (subscribedGroups) {
    //   var currentGroup = subscribedGroups.find(element => element.id === group.id);
    //   hide = currentGroup;
    // }
    // return hide;
    return false;
  }

  public updateSubscription(group: any, groupCategory: string): any {
    var subscribe = !this.hideSubscibeButton(group, groupCategory);
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      var endpoint = 'userdetails/' + userInfo.id + '/followingGroups/' + group.id;
      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);

      this.updateGroupsCache('Subscribed', group, subscribe);
      return subscribe ? this.api.post(endpoint, null, reqOpts).share() :
        this.api.delete(endpoint, reqOpts).share();
    }
    else {
      //this should never hit.
      return Observable.of('');
    }
  }

  private updateGroupsCache(groupCategory: string, group: any, add: boolean) {
    let groupsList = this.groups.find(x => x.groupCategory === groupCategory).groupList;
    if (groupsList) {
      if (add) {
        groupsList.push(group);
      } else {
        var index = groupsList.findIndex(element => element.id === group.id);
        if (index > -1) {
          groupsList.splice(index, 1);
        }
      }
    }
  }

  public getGroups(refreshFromServer: boolean, groupCategory: string) {
    return this.load(refreshFromServer, groupCategory).map((data: { visibleGroups: number, groups: Array<any> }) => {
      return data;
    });
  }
}
