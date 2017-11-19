import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-detail',
  templateUrl: 'group-detail.html'
})

export class GroupDetailPage {
  group: any;

  constructor(
    public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.group = this.navParams.data.group;
  }
}  
