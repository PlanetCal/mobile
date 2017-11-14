import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { GroupsContentPage } from './groups-content';

@NgModule({
  declarations: [
    GroupsContentPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupsContentPage)
  ],
  exports: [
    GroupsContentPage
  ]
})
export class GroupsContentPageModule { }
