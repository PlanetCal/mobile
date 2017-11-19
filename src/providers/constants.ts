import { Injectable } from '@angular/core';

/**
 * Utils is for utilities
 */
@Injectable()
export class Constants {
  public readonly serviceUrl = 'http://localhost:1337';
  public readonly productName = 'PlanetCal';

  public groupTabName: string = null;
  public readonly eventsFields = 'fields=name|description|startDateTime|endDateTime|address|location|groupId|icon';
  public readonly groupFieldsForOwner = 'fields=name|description|privacy|icon|category|createdBy|administrators|members|location|address|contact|webSite|modifiedBy';
  public readonly groupFieldsForAdmin = 'fields=name|description|privacy|icon|category|createdBy|administrators|members|location|address|contact|webSite|modifiedBy';
  public readonly groupFieldsForSubscriber = 'fields=name|description|privacy|icon|category|createdBy|members|location|address|contact|webSite|modifiedBy';
}
