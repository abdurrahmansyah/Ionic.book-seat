import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Position } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { take } from 'rxjs';
import { dataTemp } from 'src/app/dataTemp';
import { AuthService } from 'src/app/services/auth.service';
import { AttendanceData, BookSeatData, FetchService } from 'src/app/services/fetch.service';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any;

  bookSeatDataList: BookSeatData[] = [];
  bookedSeatData: BookSeatData | undefined;
  isAlreadyBook: boolean = false;
  i: number = 0;

  // attendance data
  attendanceData: any;
  checkIn: string = '';
  checkOut: string = '';

  constructor(
    private globalService: GlobalService,
    private fetchService: FetchService,
    private authService: AuthService,
    private geolocationService: GeolocationService,
    public router: Router,
    private platform: Platform) {
    this.userData = this.globalService.userData;
    this.bookedSeatData = this.globalService.bookedSeatData;
  }

  ngOnInit() {
    if (!this.bookedSeatData) {
      try {
        setTimeout(async () => {
          if (!this.globalService.isUserDataLoad) {
            console.log('load data... ', this.i++);
            await this.ngOnInit();
          } else {
            await this.InitializeData();
          }
        }, 200);
      } catch (error: any) {
        this.globalService.LogAlert(error);
      }
    }
  }

  async InitializeData() {
    await this.InitializeBookSeatData();
    await this.InitializeAttendanceData();
  }

  private async InitializeBookSeatData() {
    this.bookSeatDataList = await this.GetBookSeatByDateAndDivisiId(this.globalService.userData.divisi_id);

    if (this.bookSeatDataList.length > 0) {
      this.bookedSeatData = this.bookSeatDataList.find(x => x.employee_id[0] == this.globalService.userData.id);
      this.globalService.bookedSeatData = this.bookedSeatData;
      if (this.bookedSeatData) this.isAlreadyBook = true;
    } else {
      this.bookedSeatData = undefined;
      this.isAlreadyBook = false;
    }
    console.log('this.bookedSeatData', this.bookedSeatData);
  }

  private async GetBookSeatByDateAndDivisiId(divisi_id: string): Promise<BookSeatData[]> {
    const resBookSeatByDate: any = await new Promise(resolve => {
      this.fetchService.GetBookSeatByDateAndDivisiId(this.globalService.GetDate().todayFormatted, divisi_id).subscribe(data => {
        resolve(data);
      });
    });

    // if (resBookSeatByDate.response == 'failed') throw (resBookSeatByDate.data);
    return resBookSeatByDate.data;
  }

  private async InitializeAttendanceData() {
    this.attendanceData = await this.GetAttendancePerdate();
    console.log('this.attendanceData', this.attendanceData);

    this.checkIn = this.attendanceData ? this.attendanceData.check_in_display.split(' ')[1] : undefined;
    this.checkOut = this.attendanceData ? this.attendanceData.check_out_display ? this.attendanceData.check_out_display.split(' ')[1] : undefined : undefined;
  }

  private async GetAttendancePerdate(): Promise<BookSeatData[] | undefined> {
    const res: any = await new Promise(resolve => {
      this.fetchService.GetAttendancePerdate(this.globalService.GetDate().todayFormatted).subscribe(data => {
        resolve(data);
      });
    });

    if (res.response == 'failed') return undefined;
    else return res.data;
  }

  async Absen() {
    console.log('LOG: Do Absen...');
    const loading = await this.globalService.PresentLoading();

    try {
      const coordinates = await this.geolocationService.getCurrentPosition();
      // const address = this.geolocationService.ReadGeocode(coordinates.coords.latitude, coordinates.coords.longitude);
      const isHKTower = this.ValidateLocationHKTower(coordinates);
      // console.log('address', address);
      console.log('isHKTower', isHKTower);
      if (!isHKTower) throw 'Anda saat ini sedang berada diluar HK Tower. Silahkan absen menggunakan aplikasi HITS!'

      var result = await this.CreateAttendance();
      console.log('result', result);

      // if (!result) throw new Error('Gagal melakukan absen. Coba beberapa saat lagi!');

      this.InitializeAttendanceData();
      this.globalService.LogToast('Berhasil melakukan absen');
      loading.dismiss();
    } catch (error: any) {
      this.globalService.LogAlert(error);
      loading.dismiss();
    }
  }

  async Logout() {
    await this.authService.logout();
    await this.globalService.RemoveUserFromPreference();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  ValidateLocationHKTower(coordinates: Position): boolean {
    if (coordinates.coords.latitude <= -6.24508
      && coordinates.coords.latitude >= -6.24587
      && coordinates.coords.longitude >= 106.87269
      && coordinates.coords.longitude <= 106.87379) return true;
    else return false;
  }

  private async CreateAttendance() {
    const attendanceData: AttendanceData = {
      attendance_type: this.platform.is('ios') ? dataTemp.attendance_type.bookseatIos : dataTemp.attendance_type.bookseatAndroid,
      authorization: this.globalService.userData.token,
      absen_date: this.globalService.GetDate().todayFormatted,
      time: this.globalService.GetDate().todayTimeFormattedWithoutSecond,
      work_from: dataTemp.work_from.wfo,
      location: dataTemp.location.hktower,
      kota: dataTemp.location.jakartatimur,
      provinsi: dataTemp.location.dkijakarta,
      activity_id: dataTemp.attendance_activity.wfo_id,
      reason: dataTemp.attendance_activity.wfo_reason,
      is_request: '1',
      status: dataTemp.status.aktif,
    };
    console.log('attendanceData', attendanceData);
    const id = this.fetchService.CreateAttendance(attendanceData);
    var result: any = await new Promise((resolve, reject) => {
      id.pipe(take(1)).subscribe((data: any) => {
        resolve(data);
      }, (error: any) => {
        reject('Gagal melakukan absen. Coba beberapa saat lagi!');
      });
    });

    return result.data;
  }
}
