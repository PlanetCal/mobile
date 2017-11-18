import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { GroupsListPage } from './groups-list';

@NgModule({
  declarations: [
    GroupsListPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupsListPage)
  ],
  exports: [
    GroupsListPage
  ]
})
export class GroupsListPageModule { }
