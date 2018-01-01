import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { FollowListPage } from './follow-list';

@NgModule({
  declarations: [
    FollowListPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowListPage)
  ],
  exports: [
    FollowListPage
  ]
})
export class FollowListPageModule { }
