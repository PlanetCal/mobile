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
    this.eventsDataProvider.getTimeline(refreshFromServer, '', segment)
      .subscribe((mapData: any) => {

        mapData = [];

        let map1 = {
          name: "Ionic HQ",
          lat: 43.074395,
          lng: -89.381056,
          center: true
        };
        let map2 = {
          name: "Monona Terrace Convention Center",
          lat: 43.071584,
          lng: -89.380120,
          center: false
        };
        let map3 = {
          name: "Afterparty - Brocach Irish Pub",
          lat: 43.07336,
          lng: -89.38335,
          center: false
        };

        mapData.push(map1);
        mapData.push(map2);
        mapData.push(map3);

        let mapElement = this.mapElementment.nativeElement;

        let map = new google.maps.Map(mapElement, {
          center: mapData.find((d: any) => d.center),
          zoom: 16
        });

        mapData.forEach((markerData: any) => {
          let infoWindow = new google.maps.InfoWindow({
            content: `<h5>${markerData.name}</h5>`
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
