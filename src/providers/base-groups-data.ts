import { Injectable } from '@angular/core';
import { UserProvider } from './user';
import { ApiProvider } from './api';
import { UtilsProvider } from './utils';
import { Constants } from './constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class BaseGroupsData {
  private lastFetchedTimeStamp: Map<string, Date>; // groupType to date dictionary.
  protected groups: Map<string, Array<any>>;// groupType to groupList dictionary.
  protected currentGroupType: string;
  protected parentGroup: any;

  constructor(
    protected user: UserProvider,
    protected api: ApiProvider,
    protected utils: UtilsProvider,
    protected constants: Constants
  ) {
    this.groups = new Map<string, Array<any>>();
    this.lastFetchedTimeStamp = new Map<string, Date>();
  }

  public getGroups(parentGroup, groupType: string) {
    this.parentGroup = parentGroup;
    return this.load(groupType).map((data: { visibleGroups: number, groups: Array<any> }) => {
      return data;
    });
  }

  private shouldUseCachedGroups(groupType: string): boolean {
    if (this.parentGroup && this.parentGroup.id) {
      return false;
    }

    var toReturn = false;
    var currentDateTime = new Date();

    let lastFetchTimeForThisGroupType = this.lastFetchedTimeStamp[groupType];

    if (lastFetchTimeForThisGroupType) {
      var cacheExpiryDateTime = this.utils.addSeconds(lastFetchTimeForThisGroupType, this.constants.cacheTimeoutInSeconds);
      toReturn = cacheExpiryDateTime > currentDateTime;
    }

    if (!toReturn) {
      this.lastFetchedTimeStamp[groupType] = currentDateTime;
    }
    return toReturn;
  }

  private load(groupType: string): any {
    this.currentGroupType = groupType;
    let groupList = this.groups[groupType];
    if (this.shouldUseCachedGroups(groupType)) {
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
      if (this.currentGroupType != this.constants.subscribedGroup) {
        data = data.filter(x => !x.parentGroup);
      }

      this.groups[this.currentGroupType] = data;
    }
    return data;
  }

  private getGroupDataFromServer(groupType: string): any {
    let endpoint = '';
    let userInfo = this.user.getLoggedInUser();
    if (userInfo) {
      let endpoint = this.parentGroup && this.parentGroup.id ?
        'groups?' + this.constants.groupFieldsForAdmin + '&filter=parentGroup=' + this.parentGroup.id :
        this.getRestCallEndpoint(groupType);

      let token = userInfo.token;
      let reqOpts = this.utils.getHttpHeaders(token);
      return this.api.get(endpoint, null, reqOpts).share();
    }
    else {
      return Observable.of([]);
    }
  }

  //abstract implementation of a method
  protected getRestCallEndpoint(groupCategory: string): string {
    return null;
  }
}
