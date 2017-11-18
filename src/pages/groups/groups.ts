import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

import { GroupsListPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {

  params1: string = 'Subscribed';
  params2: string = 'Owned';
  params3: string = 'Administered';

  tab1Root: any = GroupsListPage;
  tab2Root: any = GroupsListPage;
  tab3Root: any = GroupsListPage;

  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}

