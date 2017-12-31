import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/user';
import { EventsData } from '../../providers/events-data';
import { UtilsProvider } from '../../providers/utils';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  private mapData: Array<any>;

  @ViewChild('mapCanvas') mapElementment: ElementRef;
  constructor(
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private user: UserProvider,
    private utils: UtilsProvider,
    private eventsDataProvider: EventsData) {
  }
  ionViewDidLoad() {

    let refreshFromServer = false;
    let segment = 'all';
    this.eventsDataProvider.getEventsMap(refreshFromServer)
      .subscribe((mapData: any) => {
        this.mapData = mapData;
        if (!mapData || mapData.length <= 0) {
          return;
        }
        mapData[0].center = true;

        let mapElement = this.mapElementment.nativeElement;

        let map = new google.maps.Map(mapElement, {
          center: mapData.find((d: any) => d.center),
          zoom: 16
        });

        mapData.forEach((markerData: any) => {

          let startDateTime = this.utils.convertToFriendlyDateFromDateString(markerData.startDateTime);
          let endDateTime = this.utils.convertToFriendlyDateFromDateString(markerData.endDateTime);
          let infoWindow = new google.maps.InfoWindow({
            content:
              `<div>
                <h4>${markerData.name}</h4>
                <h5>start: ${startDateTime}</h5>
                <h5>end: ${endDateTime}</h5>
                </div>`,
          });

          let marker = new google.maps.Marker({
            position: markerData,
            map: map,
            title: markerData.name
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });

        google.maps.event.addListenerOnce(map, 'idle', () => {
          mapElement.classList.add('show-map');
        });

      });
  }
}
