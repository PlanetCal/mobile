import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { UserProvider } from '../providers/user';
import { MainPage } from '../pages/pages';
import { WelcomePage } from '../pages/pages';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string;
  appPages: Array<{ title: string, component: string, param: any, icon: string }>;
  loggedInPages: Array<{ title: string, component: string, param: any, icon: string }>;
  loggedOutPages: Array<{ title: string, component: string, param: any, icon: string }>;
  conditionalPages: Array<{ title: string, component: string, param: any, icon: string }>;

  constructor(
    public events: Events,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public userProvider: UserProvider
  ) {
    this.appPages = [
      { title: 'Upcoming Events', component: 'EventsPage', param: '', icon: 'calendar' },
      { title: 'About', component: 'AboutPage', param: '', icon: 'information-circle' },
      { title: 'Support', component: 'SupportPage', param: '', icon: 'help-circle' }
    ];

    this.loggedInPages = [
      { title: 'Manage Groups', component: 'DummyPage', param: 'showGroups', icon: 'people' },
      { title: 'Configure Followings', component: 'DummyPage', param: 'followGroups', icon: 'settings' },
      { title: 'Logout', component: 'LogoutPage', param: '', icon: 'log-out' },
      { title: 'Reset Password', component: 'LoginPage', param: '', icon: 'refresh' }
    ];

    this.loggedOutPages = [
      { title: 'Login', component: 'LoginPage', param: '', icon: 'log-in' },
      { title: 'Signup', component: 'SignupPage', param: '', icon: 'person-add' }
    ];

    this.initializeApp();

    // Check if the user has already seen the welcome
    this.storage.get('hasSeenWelcome')
      .then((hasSeenWelcome) => {
        if (hasSeenWelcome) {
          this.rootPage = MainPage;
        } else {
          this.rootPage = WelcomePage;
        }
        this.platformReady();
      });

    // load the conference data
    //confData.load();

    this.enableMenu(false);

    // decide which menu items should be hidden by current login status stored in local storage
    this.userProvider.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    this.listenToLoginEvents();
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    // this.events.subscribe('user:signup', () => {
    //   this.enableMenu(true);
    // });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  enableMenu(loggedIn: boolean) {
    this.conditionalPages = loggedIn ? this.loggedInPages : this.loggedOutPages;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, page.param);
    //    this.nav.setRoot(page.component);
  }

  isActive(page) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.component) {
      return 'primary';
    }
    return;
  }

}
