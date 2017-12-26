import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { GroupListPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {

  constructor() {
  }

  getParams(value: string) {
    return { param: value };
  }
}

