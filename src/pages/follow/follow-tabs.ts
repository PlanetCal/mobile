import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { FollowListPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-follow-tabs',
  templateUrl: 'follow-tabs.html'
})
export class FollowTabsPage {

  constructor() {
  }

  getParams(value: string) {
    return { param: value };
  }
}