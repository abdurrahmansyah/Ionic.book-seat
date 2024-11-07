import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { dataTemp } from '../dataTemp';
import { BookSeatData } from './fetch.service';
import { LoadingComponent } from '../comp/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  userData: any;
  isUserDataLoad: boolean = false;
  bookedSeatData: BookSeatData | undefined;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  public GetDate(param?: any): DateData {
    var dateData = new DateData();
    var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    if (param) var date = new Date(param);
    else var date = new Date();

    dateData.date = date;
    dateData.decYear = date.getFullYear();
    dateData.szMonth = months[date.getMonth()];
    dateData.decMonth = date.getMonth() + 1;
    dateData.decDate = date.getDate();
    dateData.szDay = days[date.getDay()];
    dateData.decMinute = date.getMinutes();
    dateData.szMinute = dateData.decMinute < 10 ? "0" + dateData.decMinute : dateData.decMinute.toString();
    dateData.decHour = date.getHours();
    dateData.szHour = dateData.decHour < 10 ? "0" + dateData.decHour : dateData.decHour.toString();
    dateData.decSec = date.getSeconds();
    dateData.szAMPM = dateData.decHour > 12 ? "PM" : "AM";
    dateData.todayFormatted = formatDate(date, 'YYYY-MM-dd', 'en-US');
    dateData.todayDateTimeFormatted = formatDate(date, 'YYYY-MM-dd HH:mm:ss', 'en-US');
    dateData.todayDateTimeFormattedWithoutSecond = formatDate(date, 'YYYY-MM-dd HH:mm', 'en-US');
    dateData.todayTimeFormattedWithoutSecond = formatDate(date, 'HH:mm', 'en-US');

    return dateData;
  }

  async SaveUserToPreferences() {
    await Preferences.set({ key: 'token', value: this.userData.token ? this.userData.token : '' });
    await Preferences.set({ key: 'id', value: this.userData.id ? this.userData.id.toString() : 0 });
    await Preferences.set({ key: 'name', value: this.userData.name ? this.userData.name : '' });
    await Preferences.set({ key: 'work_email', value: this.userData.work_email ? this.userData.work_email : '' });
    await Preferences.set({ key: 'nik', value: this.userData.nik ? this.userData.nik : '' });
    await Preferences.set({ key: 'divisi_id', value: this.userData.divisi_id ? this.userData.divisi_id.toString() : 0 });
    await Preferences.set({ key: 'title_name', value: this.userData.title_name ? this.userData.title_name : '' });
    await Preferences.set({ key: 'title_id', value: this.userData.title_id ? this.userData.title_id.toString() : 0 });
    await Preferences.set({ key: 'section_name', value: this.userData.section_name ? this.userData.section_name : '' });
    await Preferences.set({ key: 'section_id', value: this.userData.section_id ? this.userData.section_id.toString() : 0 });
    await Preferences.set({ key: 'divisi_name', value: this.userData.divisi_name ? this.userData.divisi_name : '' });
    await Preferences.set({ key: 'superior_name', value: this.userData.superior_name ? this.userData.superior_name : '' });
    await Preferences.set({ key: 'superior_id', value: this.userData.superior_id ? this.userData.superior_id.toString() : 0 });
    await Preferences.set({ key: 'token_fcm', value: this.userData.token_fcm ? this.userData.token_fcm : '' });
    await Preferences.set({ key: 'image', value: this.userData.image ? this.userData.image : '' });
  }

  public async GetUserFromPreference() {
    dataTemp.user.token = (await Preferences.get({ key: 'token' })).value!;
    dataTemp.user.id = +(await Preferences.get({ key: 'id' })).value!;
    dataTemp.user.name = (await Preferences.get({ key: 'name' })).value!;
    dataTemp.user.work_email = (await Preferences.get({ key: 'work_email' })).value!;
    dataTemp.user.nik = (await Preferences.get({ key: 'nik' })).value!;
    dataTemp.user.divisi_id = +(await Preferences.get({ key: 'divisi_id' })).value!;
    dataTemp.user.title_name = (await Preferences.get({ key: 'title_name' })).value!;
    dataTemp.user.title_id = +(await Preferences.get({ key: 'title_id' })).value!;
    dataTemp.user.section_name = (await Preferences.get({ key: 'section_name' })).value!;
    dataTemp.user.section_id = +(await Preferences.get({ key: 'section_id' })).value!;
    dataTemp.user.divisi_name = (await Preferences.get({ key: 'divisi_name' })).value!;
    dataTemp.user.superior_name = (await Preferences.get({ key: 'superior_name' })).value!;
    dataTemp.user.superior_id = +(await Preferences.get({ key: 'superior_id' })).value!;
    dataTemp.user.token_fcm = (await Preferences.get({ key: 'token_fcm' })).value!;
    dataTemp.user.image = (await Preferences.get({ key: 'image' })).value!;

    this.userData = dataTemp.user;
    console.log('userdata', this.userData);
  }

  async RemoveUserFromPreference() {
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'id' });
    await Preferences.remove({ key: 'name' });
    await Preferences.remove({ key: 'work_email' });
    await Preferences.remove({ key: 'nik' });
    await Preferences.remove({ key: 'divisi_id' });
    await Preferences.remove({ key: 'title_name' });
    await Preferences.remove({ key: 'title_id' });
    await Preferences.remove({ key: 'section_name' });
    await Preferences.remove({ key: 'section_id' });
    await Preferences.remove({ key: 'divisi_name' });
    await Preferences.remove({ key: 'superior_name' });
    await Preferences.remove({ key: 'superior_id' });
    await Preferences.remove({ key: 'token_fcm' });
    await Preferences.remove({ key: 'image' });
  }

  LogToast(msg: string) {
    this.PresentToast(msg);
    console.log('Log:', msg);
  }

  LogAlert(msg: string, header?: string) {
    this.PresentAlert(msg, header);
    console.log('Log:', msg);
  }

  async PresentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "dark",
      mode: "ios"
    });
    toast.present();
  }

  PresentAlert(msg: string, header?: string) {
    this.alertController.create({
      mode: 'ios',
      header: header,
      message: msg,
      buttons: ['OK']
    }).then(alert => {
      return alert.present();
    });
  }

  async PresentLoading(): Promise<HTMLIonModalElement> {
    console.log('Show Loading Modal');

    const modal = await this.modalController.create({
      component: LoadingComponent,
      cssClass: 'transparent-modal'
    });
    await modal.present();

    return modal;
  }
}

export class DateData {
  public date: Date = new Date();
  public szDay: string = '';
  public decDate: number = 0;
  public szMonth: string = '';
  public decYear: number = 0;
  public decHour: number = 0;
  public szHour: string = '';
  public decMinute: number = 0;
  public szMinute: string = '';
  public szAMPM: string = '';
  public decSec: number = 0;
  public decMonth: number = 0;
  public todayFormatted: string = '';
  public todayDateTimeFormatted: string = '';
  public todayDateTimeFormattedWithoutSecond: string = '';
  public todayTimeFormattedWithoutSecond: string = '';

  constructor() { }
}