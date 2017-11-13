import 'rxjs/add/operator/toPromise';
//import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { UtilsProvider } from '../utils/utils';
/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class UserProvider {
  _user: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_WELCOME = 'hasSeenWelcome';

  constructor(
    public api: ApiProvider,
    public utils: UtilsProvider,
    public events: Events,
    public storage: Storage
  ) {
    this.storage.get('user').then((value) => {
      this._user = value;
    });
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let reqOpts = this.utils.getHttpHeaders();
    let seq = this.api.post('login', accountInfo, reqOpts).share();

    seq.subscribe((res: any) => {
      this._loggedIn(res);
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let reqOpts = this.utils.getHttpHeaders();
    let seq = this.api.post('userauth', accountInfo, reqOpts).share();

    seq.subscribe((res: any) => {
      //do nothing from the response.
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  resetPassword(accountInfo: any) {
    let reqOpts = this.utils.getHttpHeaders();
    let seq = this.api.put('userauth', accountInfo, reqOpts).share();

    seq.subscribe((res: any) => {
      //do nothing from the response.
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }


  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    this.storage.set(this.HAS_LOGGED_IN, false);
    this.storage.set('user', null);
    this.events.publish('user:logout');
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp;
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set('user', resp);
    this.events.publish('user:login');
  }

  getUserInfo(): Promise<string> {
    return this.storage.get('user').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenWelcome(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_WELCOME).then((value) => {
      return value;
    });
  };
}
