import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { GroupListPage } from '../pages';
import { Constants } from '../../providers/constants';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {

  constructor(
    public constants: Constants
  ) {
  }

  getParams(value: string) {
    return { groupType: value };
  }
}

