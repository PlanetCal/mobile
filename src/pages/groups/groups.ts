import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { GroupListPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {
  tab1Root: any = GroupListPage;
  tab2Root: any = GroupListPage;
  tab3Root: any = GroupListPage;

  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  getParams(value: string) {
    //console.log('param value is ' + value);
    return { param: value };
  }

}

