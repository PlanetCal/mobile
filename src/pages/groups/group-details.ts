import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-details',
  templateUrl: 'group-details.html'
})
export class GroupDetailsPage {

  public data: string;

  constructor(navParams: NavParams) {
    this.data = navParams.data;
  }
}
