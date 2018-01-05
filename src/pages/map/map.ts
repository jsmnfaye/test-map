import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare const google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;

  map: any;
  myWaypoints: any[] = [];

  constructor(public loadCtrl: LoadingController, public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('initializing map!');
    let loading = this.loadCtrl.create({
      content: 'Initializing map...'
    });
    loading.present();
    this.getMyPosition();
    loading.dismiss();
  }

  getMyPosition(){
    console.log('getting your location...');
    this.geolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then((position) => {
      let myLat = position.coords.latitude;
      let myLng = position.coords.longitude;
      // console.log(myLat+" "+myLng);
      this.loadMap(myLat, myLng);
    }).catch((error) => {
      console.log('Error getting your current location! Loading backup map...', error);
    });
  }

  loadMap(myLat, myLng){
    let latLng = {lat: myLat, lng: myLng};
    console.log('my coordinates: '+myLat+' & '+myLng);
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 12,
      center: latLng,
      mapTypeId: 'roadmap'
    });

    this.map.setCenter(latLng);
    this.startNavigating(latLng);
  }
  
  startNavigating(origin){
    let loading = this.loadCtrl.create({
      content: 'Calculating your route...'
    });
    loading.present();
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(this.map);
    directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    this.myWaypoints = [
      {
        location: 'Robinsons Place Manila',
        stopover: true
      }
    ];

    directionsService.route({
      origin: origin,
      waypoints: this.myWaypoints,
      destination: 'Greenbelt Chapel',
      travelMode: google.maps.TravelMode['DRIVING'],
      optimizeWaypoints: true
    }, (res, status) => {
      if(status == google.maps.DirectionsStatus.OK){
        directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }
    });
    loading.dismiss();
  }

  // loadMap(){
  //   let latLng = {lat: 14.59, lng: 120.94};
  //   this.map = new google.maps.Map(this.mapElement.nativeElement, {
  //     zoom: 12,
  //     center: latLng,
  //     mapTypeId: 'roadmap'
  //   });

  //   this.map.setCenter(latLng);
  // }

}
