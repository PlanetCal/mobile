import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { FollowTabsPage } from './follow-tabs';

@NgModule({
  declarations: [
    FollowTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowTabsPage)
  ],
  exports: [
    FollowTabsPage
  ]
})
export class FollowTabsPageModule { }
