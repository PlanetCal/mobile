import { Injectable } from '@angular/core';
import { UserProvider } from './user';
import { ApiProvider } from './api';
import { UtilsProvider } from './utils';
import { BaseGroupsData } from './base-groups-data';
import { Constants } from './constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class FollowData extends BaseGroupsData {

  constructor(
    protected user: UserProvider,
    protected api: ApiProvider,
    protected utils: UtilsProvider,
    protected constants: Constants
  ) {
    super(user, api, utils, constants)
  }

  protected getRestCallEndpoint(groupCategory: string): string {
    return 'groups?fields=name|icon|category|privacy|childGroups|parentGroup&filter=category=' + groupCategory;
  }
}
