import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Constants } from './constants';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class ApiProvider {
  constructor(
    private http: HttpClient,
    private constants: Constants) {
  }

  public get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.constants.serviceUrl + '/' + endpoint, reqOpts);
  }

  public post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.constants.serviceUrl + '/' + endpoint, body, reqOpts);
  }

  public put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.constants.serviceUrl + '/' + endpoint, body, reqOpts);
  }

  public delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.constants.serviceUrl + '/' + endpoint, reqOpts);
  }

  public patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.constants.serviceUrl + '/' + endpoint, body, reqOpts);
  }
}
