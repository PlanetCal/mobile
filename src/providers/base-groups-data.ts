import { Injectable } from '@angular/core';
import { UtilsProvider } from './utils';
import { Constants } from './constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class BaseGroupsData {
  protected groups: Map<string, Array<any>>;// groupType to groupList dictionary.
  protected lastFetchedTimeStamp: Map<string, Date>; // groupType to date dictionary.
  protected currentGroupType: string;
  protected parentGroup: any;

  constructor(
    protected utils: UtilsProvider,
    protected constants: Constants
  ) {
    this.groups = new Map<string, Array<any>>();
    this.lastFetchedTimeStamp = new Map<string, Date>();
  }

  protected shouldUseCachedGroups(groupType: string): boolean {
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

  protected load(groupType: string): any {
    this.currentGroupType = groupType;
    let groupList = this.groups[groupType];
    if (this.shouldUseCachedGroups(groupType)) {
      return Observable.of(groupList);
    } else {
      return this.getGroupDataFromServer(groupType)
        .map(this.processDataFromServer, this);
    }
  }

  public getGroups(parentGroup, groupType: string) {
    this.parentGroup = parentGroup;
    return this.load(groupType).map((data: { visibleGroups: number, groups: Array<any> }) => {
      return data;
    });
  }

  protected processDataFromServer(data: any) {
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

  protected getGroupDataFromServer(groupType: string): any {
    //abstract implmentation of these methods. Actual implementation is in base classes.
  }
}
