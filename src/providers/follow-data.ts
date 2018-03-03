import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserProvider } from './user';
import { ApiProvider } from './api';
import { UtilsProvider } from './utils';
import { BaseGroupsData } from './base-groups-data';
import { Constants } from './constants';
import { GroupsData } from './groups-data';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class FollowData extends BaseGroupsData {

  constructor(
    private user: UserProvider,
    private api: ApiProvider,
    protected utils: UtilsProvider,
    private groupsData: GroupsData,
    protected constants: Constants,
    private storage: Storage
  ) {
    super(utils, constants)
  }

  protected processDataFromServer(data: any) {
    data = data.filter(x => !x.parentGroup);
    let groupsOfThisGroupCategory = this.groups.find(x => x.groupType === this.currentGroupType);
    if (groupsOfThisGroupCategory) {
      groupsOfThisGroupCategory.groupList = data;
    }
    else {
      this.groups.push({ groupType: this.currentGroupType, groupList: data });
    }
    return data;
  }

  protected getGroupDataFromServer(groupCategory: string): any {
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
}
