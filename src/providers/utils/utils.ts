import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Utils is for utilities
 */
@Injectable()
export class UtilsProvider {
  productName: string;

  constructor() {
    this.productName = 'PlanetCal';
  }

  getSimpleHeaders() {
    let reqOpts = {
      headers: new HttpHeaders({
        'Version': '1.0',
        'Accept': 'application/json'
      })
    };

    return reqOpts;
  }
}
