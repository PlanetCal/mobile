import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-groups-list',
  templateUrl: 'groups-list.html'
})
export class GroupsListPage {

  public data: string;

  constructor(navParams: NavParams) {
    this.data = navParams.data;
  }
}
