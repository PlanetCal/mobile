import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-groups-content',
  templateUrl: 'groups-content.html'
})
export class GroupsContentPage {

  public data: string;

  constructor(navParams: NavParams) {
    this.data = navParams.data;
  }
}
