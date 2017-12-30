import { Injectable } from '@angular/core';

/**
 * Utils is for utilities
 */
@Injectable()
export class Constants {
  public readonly serviceUrl: string = 'http://calapisvc.azurewebsites.net';
  //public readonly serviceUrl: string = 'http://localhost:1337';

  public readonly productName: string = 'PlanetCal';

  public groupTabName: string = null;
  public readonly eventsFields: string = 'fields=name|description|startDateTime|endDateTime|address|location|geoLocation|groupId|icon';
  public readonly defaultEventIcon: string = 'assets/imgs/defaultEventIcon.jpg';

  public readonly groupFieldsForOwner: string = 'fields=name|description|privacy|icon|category|createdBy|administrators|members|location|address|contact|webSite|modifiedBy';
  public readonly groupFieldsForAdmin: string = 'fields=name|description|privacy|icon|category|createdBy|administrators|members|location|address|contact|webSite|modifiedBy';
  public readonly groupFieldsForSubscriber: string = 'fields=name|description|privacy|icon|category|createdBy|members|location|address|contact|webSite|modifiedBy';
  public readonly defaultGroupIcon: string = 'assets/imgs/defaultGroupIcon.jpg';

  public readonly toastDuration: number = 3000;
}
