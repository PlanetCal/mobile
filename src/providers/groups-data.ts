import { Injectable } from '@angular/core';

import { UserProvider } from './user';
import { BaseGroupsData } from './base-groups-data';
import { ApiProvider } from './api';
import { UtilsProvider } from './utils';
import { Constants } from './constants';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class GroupsData extends BaseGroupsData {

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    protected utils: UtilsProvider,
    protected constants: Constants
  ) {
    super(utils, constants);
  }

  protected getGroupDataFromServer(groupType: string): any {
    let endpoint = '';
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      if (this.parentGroup && this.parentGroup.id) {
        endpoint = 'groups?' + this.constants.groupFieldsForAdmin +
          '&filter=parentGroup=' + this.parentGroup.id;
      }
      else {
        switch (groupType) {
          case (this.constants.administeredGroup):
            endpoint = 'groups?' + this.constants.groupFieldsForAdmin + '&administeredByMe=true';
            break;
          case (this.constants.ownedGroup):
            endpoint = 'groups?' + this.constants.groupFieldsForAdmin + '&filter=createdBy=' + userInfo.id;
            break;
          case (this.constants.subscribedGroup):
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
    if (groupType == this.constants.ownedGroup || groupType == this.constants.administeredGroup) {
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

  private hideParentGroupLink(group: any) {
    return !group.parentGroup;
  }

  private hideSubscibeButton(group: any, groupType: string): boolean {
    if (groupType === this.constants.subscribedGroup) {
      return true;
    }

    var hide = false;
    let subscribedGroupsList = this.groups[this.constants.subscribedGroup];
    if (subscribedGroupsList) {
      var currentGroup = subscribedGroupsList.find(element => element.id === group.id);
      hide = currentGroup;
    }
    return hide;
  }

  public deleteGroup(group: any, groupList: any, parentGroup: any): any {
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      var endpoint = 'groups/' + group.id;
      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);

      //update the list by removing the group from here.
      var index = groupList.findIndex(element => element.id === group.id);
      if (index > -1) {
        groupList.splice(index, 1);
      }

      if (parentGroup && parentGroup.childGroups) {
        var childListIndex = parentGroup.childGroups.findIndex(element => element === group.id);
        if (childListIndex > -1) {
          parentGroup.childGroups.splice(childListIndex, 1);
        }
      }

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

      this.updateGroupsCache(this.constants.subscribedGroup, group, subscribe);
      let observable = subscribe ? this.api.post(endpoint, null, reqOpts).share() :
        this.api.delete(endpoint, reqOpts).share();

      observable.subscribe((groupId: any) => {
      }, (err) => {
      });
    }
  }

  private updateGroupsCache(groupType: string, group: any, add: boolean) {
    if (!groupType) return;

    let groupsList = this.groups[groupType];
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
}
