import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { GlobalService } from './global.service';
// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private globalService: GlobalService,
    // private nativeGeocoder: NativeGeocoder,
    public platform: Platform
  ) { }

  async getCurrentPosition(): Promise<Position> {
    console.log('LOG: Start getCurrentPosition...');
    
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  }

  async ReadGeocode(latitude: number, longitude: number) {
    // const resBookSeatByDate: any = await new Promise(resolve => {
    //   this.fetchService.GetBookSeatByDateAndDivisiId(this.globalService.GetDate().todayFormatted, divisi_id).subscribe(data => {
    //     resolve(data);
    //   });
    // });

    // const result: any = await new Promise(resolve => {
    //   this.nativeGeocoder.reverseGeocode(latitude, longitude, { useLocale: true, maxResults: 5 }).then(result => {
    //     resolve(result);
    //   });
    // });
    // await this.nativeGeocoder.reverseGeocode(latitude, longitude, { useLocale: true, maxResults: 5 })
    //   .then((result: NativeGeocoderResult[]) => {
    //     if (this.platform.is('ios'))
    //       this.MappingLocationGeocode(0, result);
    //     else
    //       this.MappingLocationGeocode(1, result);
    //   }, (rejected) => {
    //     // this.loadingController.dismiss();
    //     this.globalService.PresentAlert(rejected.message)
    //   }).catch((error: any) => {
    //     // this.loadingController.dismiss();
    //     this.globalService.PresentAlert(error.message);
    //   });
  }

  // private MappingLocationGeocode(index: number, result: NativeGeocoderResult[]) {
  //   var thoroughfare = result[index].thoroughfare;
  //   var subThoroughfare = result[index].subThoroughfare;
  //   var subLocality = result[index].subLocality ? ", " + result[index].subLocality : "";
  //   var locality = result[index].locality ? ", " + result[index].locality : "";
  //   var subAdministrativeArea = result[index].subAdministrativeArea ? ", " + result[index].subAdministrativeArea : "";
  //   var administrativeArea = result[index].administrativeArea ? ", " + result[index].administrativeArea : "";
  //   var postalCode = result[index].postalCode ? " " + result[index].postalCode : "";
  //   this.globalService.kota = result[index].subAdministrativeArea;
  //   this.globalService.provinsi = result[index].administrativeArea;
  //   this.globalService.location = thoroughfare + subThoroughfare + subLocality + locality + subAdministrativeArea + administrativeArea + postalCode;
  // }
}
