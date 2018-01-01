import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { DummyPage } from './dummy';

@NgModule({
  declarations: [
    DummyPage,
  ],
  imports: [
    IonicPageModule.forChild(DummyPage)
  ],
  exports: [
    DummyPage
  ]
})
export class DummyPageModule { }
