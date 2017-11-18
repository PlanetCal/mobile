import { Component } from '@angular/core';
import { IonicPage, NavParams, ActionSheet, ActionSheetController, ActionSheetOptions, Config, NavController } from 'ionic-angular';
import { GroupsData } from '../../providers/groups-data';

//import { InAppBrowser } from '@ionic-native/in-app-browser';

// TODO remove
// export interface ActionSheetButton {
//   text?: string;
//   role?: string;
//   icon?: string;
//   cssClass?: string;
//   handler?: () => boolean | void;
// };

@IonicPage()
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html'
})
export class GroupListPage {
  actionSheet: ActionSheet;
  groups: any[] = [];
  private data: string;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    navParams: NavParams,
    private groupsData: GroupsData,
    private config: Config
    //private inAppBrowser: InAppBrowser
  ) {
    //this.groups = [];
    this.data = navParams.data;
  }

  ionViewDidLoad() {
    this.groupsData.getGroups(this.data).subscribe((groups: any[]) => {
      this.groups = groups;
    });
  }

  // goToSessionDetail(session: any) {
  //   //this.navCtrl.push(SessionDetailPage, { sessionId: session.id });
  // }

  // goToGroup(group: any) {
  //   this.navCtrl.push(GroupPage, { groupId: group.id });
  // }

  // goToGroupTwitter(group: any) {
  //   this.inAppBrowser.create(
  //     `https://twitter.com/${group.twitter}`,
  //     '_blank'
  //   );
  // }

  // openGroupShare(group: any) {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Share ' + group.name,
  //     buttons: [
  //       {
  //         text: 'Copy Link',
  //         handler: () => {
  //           console.log('Copy link clicked on https://twitter.com/' + group.twitter);
  //           if ((window as any)['cordova'] && (window as any)['cordova'].plugins.clipboard) {
  //             (window as any)['cordova'].plugins.clipboard.copy(
  //               'https://twitter.com/' + group.twitter
  //             );
  //           }
  //         }
  //       } as ActionSheetButton,
  //       {
  //         text: 'Share via ...'
  //       } as ActionSheetButton,
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       } as ActionSheetButton
  //     ]
  //   } as ActionSheetOptions);

  //   actionSheet.present();
  // }

  // openContact(group: any) {
  //   let mode = this.config.get('mode');

  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Contact ' + group.name,
  //     buttons: [
  //       {
  //         text: `Email ( ${group.email} )`,
  //         icon: mode !== 'ios' ? 'mail' : null,
  //         handler: () => {
  //           window.open('mailto:' + group.email);
  //         }
  //       } as ActionSheetButton,
  //       {
  //         text: `Call ( ${group.phone} )`,
  //         icon: mode !== 'ios' ? 'call' : null,
  //         handler: () => {
  //           window.open('tel:' + group.phone);
  //         }
  //       } as ActionSheetButton
  //     ]
  //   } as ActionSheetOptions);

  //   actionSheet.present();
  // }
}
