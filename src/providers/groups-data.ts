import { Injectable } from '@angular/core';

import { UserProvider } from './user';
import { ApiProvider } from './api';
import { UtilsProvider } from './utils';
import { Constants } from './constants';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class GroupsData {
  private groups: Array<{ groupType: string, groupList: Array<any> }>;
  private currentGroupType: string;
  private parentGroup: any;

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    private utils: UtilsProvider,
    private constants: Constants
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
    let parentGroup = this.parentGroup;
    this.parentGroup = null;
    if (!parentGroup) {
      //Don't filter the subscribed list. Otherwise, it causes wierd issues.
      if (this.currentGroupType != 'Subscribed') {
        data = data.filter(x => !x.parentGroup);
      }

      let groupsOfThisGroupType = this.groups.find(x => x.groupType === this.currentGroupType);
      if (groupsOfThisGroupType) {
        groupsOfThisGroupType.groupList = data;
      }
      else {
        this.groups.push({ groupType: this.currentGroupType, groupList: data });
      }
    }
    return data;
  }

  private getGroupDataFromServer(groupType: string): any {
    let endpoint = '';
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      if (this.parentGroup && this.parentGroup.id) {
        endpoint = 'groups?' + this.constants.groupFieldsForAdmin +
          '&filter=parentGroup=' + this.parentGroup.id;
      }
      else {
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
    if (groupType == 'Owned' || groupType == 'Administered') {
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

  public getSubsciptionUpdateIcon(group: any, groupType: string): string {
    return this.hideSubscibeButton(group, groupType) ? 'md-remove-circle' : 'md-add-circle';
  }

  public getSubsciptionUpdateButtonColor(group: any, groupType: string): string {
    return this.hideSubscibeButton(group, groupType) ? 'danger' : 'secondary';
  }
  public getSubsciptionUpdateText(group: any, groupType: string): string {
    return this.hideSubscibeButton(group, groupType) ? 'Un-follow' : 'Follow';
  }

  private hideChildGroupsLink(group: any) {
    return !group.childGroups || group.childGroups.length <= 0;
  }

  private hideSubscibeButton(group: any, groupType: string): boolean {
    if (groupType === 'Subscribed') {
      return true;
    }

    var hide = false;
    let subscribedGroups = this.groups.find(x => x.groupType === 'Subscribed');
    if (subscribedGroups) {
      let subscribedGroupsList = subscribedGroups.groupList;
      if (subscribedGroupsList) {
        var currentGroup = subscribedGroupsList.find(element => element.id === group.id);
        hide = currentGroup;
      }
    }
    return hide;
  }

  public deleteGroup(group: any, groupType: string): any {
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      var endpoint = 'groups/' + group.id;
      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);
      this.updateGroupsCache(groupType, group, false);
      return this.api.delete(endpoint, reqOpts).share();
    }
    else {
      //this should never hit.
      return Observable.of('');
    }
  }

  public updateSubscription(group: any, groupType: string): any {
    var subscribe = !this.hideSubscibeButton(group, groupType);
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      var endpoint = 'userdetails/' + userInfo.id + '/followingGroups/' + group.id;
      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);

      this.updateGroupsCache('Subscribed', group, subscribe);
      let observable = subscribe ? this.api.post(endpoint, null, reqOpts).share() :
        this.api.delete(endpoint, reqOpts).share();

      observable.subscribe((groupId: any) => {
      }, (err) => {
      });
    }
  }

  private updateGroupsCache(groupType: string, group: any, add: boolean) {
    if (!groupType) return;

    let groupsList = this.groups.find(x => x.groupType === groupType).groupList;
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

  public getGroups(parentGroup, refreshFromServer: boolean, groupType: string) {
    this.parentGroup = parentGroup;
    return this.load(refreshFromServer, groupType).map((data: { visibleGroups: number, groups: Array<any> }) => {
      return data;
    });
  }
}
