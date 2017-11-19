import { Injectable } from '@angular/core';

/**
 * Utils is for utilities
 */
@Injectable()
export class Constants {
  public serviceUrl: string = 'http://localhost:1337';
  public productName: string = 'PlanetCal';

  public groupTabName: string = null;
  public eventsFields: string = 'fields=name|description|startDateTime|endDateTime|address|location|groupId|icon';
}
