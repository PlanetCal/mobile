import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

import { GroupsContentPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {

  params1: string = 'Subscribed';
  params2: string = 'Owned';
  params3: string = 'Administered';

  tab1Root: any = GroupsContentPage;
  tab2Root: any = GroupsContentPage;
  tab3Root: any = GroupsContentPage;

  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}

