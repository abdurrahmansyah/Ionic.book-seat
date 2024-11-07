import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { take } from 'rxjs';
import { dataTemp } from 'src/app/dataTemp';
import { BookSeatData, FetchService, SeatData, UserGroupData, VIPSeatData } from 'src/app/services/fetch.service';
import { GlobalService } from 'src/app/services/global.service';
import { PhotoService } from 'src/app/services/photo.service';
import { BarcodeScanner, BarcodeFormat, LensFacing, IsGoogleBarcodeScannerModuleAvailableResult } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  bookSeatDataList: BookSeatData[] = [];
  seatDataList: SeatData[] = [];
  vipSeatDataList: VIPSeatData[] = [];
  userGroupDataList: UserGroupData[] = [];

  isAlreadyBook: boolean = false;
  bookedSeatData: BookSeatData | undefined;

  isIOS: boolean = false;
  isSearch: boolean = false;
  inputs: string = '';
  search: UserGroupData[] = [];
  isLoaded: boolean = false;

  segment: string = "seats";

  // denah
  imageDenah: string | null = null;
  imageDenahMap: string | null = null;
  denahBookedSeat: any[] = [];

  i: number = 0;
  constructor(
    private fetchService: FetchService,
    private globalService: GlobalService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public platform: Platform) { }

  async ngOnInit() {
    try {
      setTimeout(async () => {
        if (!this.globalService.isUserDataLoad) {
          console.log('load data... ', this.i++);
          await this.ngOnInit();
        } else {
          await this.InitializeApp();
          await this.InitializeAllData();
        }
      }, 200);
    } catch (error: any) {
      this.globalService.LogAlert(error);
    }
  }

  async InitializeApp() {
    // const requestPermissions = await BarcodeScanner.requestPermissions().catch((err) => { throw err.message });
    this.isIOS = this.platform.is('ios') ? true : false;
  }

  async InitializeAllData() {
    console.log('userData', this.globalService.userData);
    
    this.imageDenahMap = null;
    if (this.globalService.userData.divisi_name == dataTemp.divisi_name.ETI) {
      this.imageDenah = '../../../assets/images/denah/SIT.png';
      this.imageDenahMap = '../../../assets/images/denah/SIT000.png';
    }
    else if (this.globalService.userData.divisi_name == dataTemp.divisi_name.SEKPER) {
      this.imageDenah = '../../../assets/images/denah/SEKPER.jpeg';
    }
    else if (this.globalService.userData.divisi_name == dataTemp.divisi_name.QHSSE) {
      this.imageDenah = '../../../assets/images/denah/QHSSE.jpeg';
    }
    else if (this.globalService.userData.divisi_name == dataTemp.divisi_name.SPI) {
      this.imageDenah = '../../../assets/images/denah/SPI.jpeg';
    }
    else if (this.globalService.userData.divisi_name == dataTemp.divisi_name.CP) {
      this.imageDenah = '../../../assets/images/denah/CP.jpeg';
    }
    else if (this.globalService.userData.divisi_name == dataTemp.divisi_name.HC) {
      this.imageDenah = '../../../assets/images/denah/HC.jpeg';
    }
    else if (this.globalService.userData.divisi_name == dataTemp.divisi_name.RJT) {
      this.imageDenah = '../../../assets/images/denah/RJT.png';
    }
    else if (this.globalService.userData.divisi_name == dataTemp.divisi_name.DPR) {
      this.imageDenah = '../../../assets/images/denah/DPR.jpeg';
    }
    else {
      this.imageDenah = '../../../assets/images/denah/SIT.png';
    }

    await this.InitializeData();

    this.vipSeatDataList = await this.GetVIPSeatByDivisiId(this.globalService.userData.divisi_id);
    console.log('vipSeatDataList', this.vipSeatDataList);
    await this.FixBookSeatDataList(this.bookSeatDataList, this.vipSeatDataList);

    this.isLoaded = true;
  }

  async InitializeData() {
    this.bookSeatDataList = await this.GetBookSeatByDateAndDivisiId(this.globalService.userData.divisi_id);
    const seatDataList = await this.GetSeatByDivisiId(this.globalService.userData.divisi_id);
    console.log('bookSeatDataList', this.bookSeatDataList);
    console.log('seatDataList', seatDataList);
    this.userGroupDataList = await this.GetUsersByDivisiId(this.globalService.userData.divisi_id);

    if (this.bookSeatDataList.length > 0) {
      seatDataList.forEach(seat => {
        seat.bookedSeatData = this.bookSeatDataList.find(x => x.code_id[0] == seat.id);
        if (this.bookSeatDataList.filter(x => x.code_id[0] == seat.id).length > 0) {
          this.denahBookedSeat.push('../../../assets/images/denah/' + seat.code + '.png');
        }
      });
      this.userGroupDataList.forEach(user => {
        user.bookedSeatData = this.bookSeatDataList.find(x => x.employee_id[0] == user.id);
      });

      this.bookedSeatData = this.bookSeatDataList.find(x => x.employee_id[0] == this.globalService.userData.id);
      this.globalService.bookedSeatData = this.bookedSeatData;
      if (this.bookedSeatData) this.isAlreadyBook = true;
    } else {
      this.bookedSeatData = undefined;
      this.isAlreadyBook = false;
    }
    this.seatDataList = seatDataList;
    console.log('this.bookedSeatData', this.bookedSeatData);
    console.log('denahBookedSeat', this.denahBookedSeat);
    console.log('userGroupDataList', this.userGroupDataList);
  }

  private async GetBookSeatByDate(): Promise<BookSeatData[]> {
    const resBookSeatByDate: any = await new Promise(resolve => {
      this.fetchService.GetBookSeatByDate(this.globalService.GetDate().todayFormatted).subscribe(data => {
        resolve(data);
      });
    });

    // if (resBookSeatByDate.response == 'failed') throw (resBookSeatByDate.data);
    return resBookSeatByDate.data;
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

  private async GetSeat() {
    const resSeat: any = await new Promise(resolve => {
      this.fetchService.GetSeat().subscribe(data => {
        resolve(data);
      });
    });

    // if (resSeat.response == 'failed') throw (resSeat.data);
    return resSeat.data;
  }

  private async GetSeatByCode(code: string): Promise<SeatData> {
    const resSeat: any = await new Promise(resolve => {
      this.fetchService.GetSeatByCode(code).subscribe(data => {
        resolve(data);
      });
    });

    // if (resSeat.response == 'failed') throw (resSeat.data);
    return resSeat.data.find((x: any) => x);
  }

  private async GetSeatByDivisiId(divisi_id: string): Promise<SeatData[]> {
    const resSeat: any = await new Promise(resolve => {
      this.fetchService.GetSeatByDivisiId(divisi_id).subscribe(data => {
        resolve(data);
      });
    });

    return resSeat.data;
  }

  private async GetVIPSeat() {
    const resSeat: any = await new Promise(resolve => {
      this.fetchService.GetVIPSeat().subscribe(data => {
        resolve(data);
      });
    });

    return resSeat.data;
  }

  private async GetVIPSeatByDivisiId(divisi_id: string) {
    const resSeat: any = await new Promise(resolve => {
      this.fetchService.GetVIPSeatByDivisiId(divisi_id).subscribe(data => {
        resolve(data);
      });
    });

    return resSeat.data;
  }

  async FixBookSeatDataList(bookSeatDataList: BookSeatData[], vipSeatDataList: VIPSeatData[]) {
    if (vipSeatDataList.length > 0) {
      vipSeatDataList.forEach(async vipSeatData => {
        if (bookSeatDataList.filter(x => x.employee_id[0] == vipSeatData.employee_id[0]).length == 0) {
          var result = await this.CreateBookSeat(vipSeatData.employee_id[0], vipSeatData.seat_id[0], true);
          console.log('result vip', result);

          if (!result) throw ('Gagal book');
        }
      })
      if (!bookSeatDataList.find(x => x.employee_id[0] == vipSeatDataList[0].employee_id[0]))
        this.bookSeatDataList = await this.GetBookSeatByDate();
    }
  }

  private async GetUsersByDivisiId(divisi_id: string): Promise<UserGroupData[]> {
    const resSeat: any = await new Promise(resolve => {
      this.fetchService.GetUsersByDivisiId(divisi_id).subscribe(data => {
        resolve(data);
      });
    });

    // if (resSeat.response == 'failed') throw (resSeat.data);
    return resSeat.data;
  }

  async ScanAndBook() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.CheckAndInstallGoogleBarcodeScanner();
      // const code = 'SIT037';
      // const code = 'SEKPER011';
      const code = await this.ScanBarcode();
      const seat = await this.GetSeatByCode(code);
      await this.ValidateIsUserAlreadyBook();
      this.ValidateIsSeatAvailabelForUserDivision(seat);

      await this.InitializeData();
      this.ValidateIsSeatAlreadyUsed(seat);
      await loading.dismiss();
      await this.BookSeat(code, seat);
    } catch (e: any) {
      // this.globalService.LogAlert(JSON.stringify(e));
      await loading.dismiss();
      this.globalService.LogAlert(e.message);
    }
  }

  async ScanOnlyOrWithdraw() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.CheckAndInstallGoogleBarcodeScanner();
      // const code = 'SIT037';
      // const code = 'SEKPER011';
      const code = await this.ScanBarcode();
      const seat = await this.GetSeatByCode(code);
      this.ValidateIsSeatAvailabelForUserDivision(seat);
      var bookSeatData = this.bookSeatDataList.find(x => x.code_id[0] == seat.id);

      await loading.dismiss();

      if (bookSeatData) {
        if (bookSeatData.employee_id[0] == this.globalService.userData.id) await this.WithdrawBookSeat(bookSeatData);
        else this.globalService.LogAlert('Meja sedang digunakan oleh ' + bookSeatData.employee_id[1], bookSeatData.code_id[1]);
      }
      else this.globalService.LogAlert('Meja siap digunakan', seat.name);

    } catch (e: any) {
      await loading.dismiss();
      this.globalService.LogAlert(e.message);
    }
  }

  async ValidateIsUserAlreadyBook() {
    var x = this.bookSeatDataList.filter(x => x.employee_id['0'] == this.globalService.userData.id);
    if (x.length > 0) throw new Error('Book Gagal! Anda sudah melakukan book pada: ' + x[0].code_id[1]);
  }

  async CheckAndInstallGoogleBarcodeScanner() {
    if (this.isIOS) return;
    const available: IsGoogleBarcodeScannerModuleAvailableResult = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    if (!available.available) {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
      throw new Error('Proses Instalasi Google Barcode! Silahkan coba lagi nanti');
    }
  }

  async ScanBarcode(): Promise<string> {
    const barcodes = await BarcodeScanner.scan({
      formats: [BarcodeFormat.QrCode],
      // lensFacing: LensFacing.Back,
    });

    // console.log('barcodes', barcodes);
    return barcodes.barcodes[0].rawValue;
  }

  ValidateIsSeatAlreadyUsed(seat: SeatData) {
    var bookSeatData = this.bookSeatDataList.find(x => x.code_id[0] == seat.id);

    if (bookSeatData) throw new Error('Booking Gagal! Meja sedang digunakan oleh ' + bookSeatData.employee_id[1]);
  }

  ValidateIsSeatAvailabelForUserDivision(seat: SeatData) {
    if (seat.divisi_id[1] != this.globalService.userData.divisi_name)
      throw new Error('Gagal! Anda tidak dapat men-scan meja diluar divisi anda: ' + seat.code);
  }

  async BookSeat(code: string, seat: SeatData) {
    await this.alertController.create({
      mode: 'ios',
      header: 'Kode Meja',
      subHeader: code,
      message: 'Apakah anda yakin ingin melanjutkan?',
      buttons: [{
        text: 'CANCEL',
        role: 'Cancel'
      }, {
        text: 'YES',
        handler: async () => {
          const loading = await this.loadingController.create();
          await loading.present();

          try {
            // const seat = await this.GetSeatByCode(code);
            console.log('seat', seat);

            var result = await this.CreateBookSeat(this.globalService.userData.id, seat.id!, false);
            console.log('result', result);

            if (!result) throw new Error('Gagal book');

            this.InitializeAllData();
            this.globalService.LogToast('Berhasil book');
            await loading.dismiss();
          } catch (error: any) {
            await loading.dismiss();
            throw new Error(error);
          }
        }
      }]
    }).then(alert => {
      return alert.present();
    });
  }

  private async CreateBookSeat(employee_id: string, seat_id: string, isVIP: boolean) {
    const bookSeatData: BookSeatData = {
      employee_id: employee_id,
      date: this.globalService.GetDate().todayFormatted,
      code_id: seat_id,
      book_datetime: isVIP ? this.globalService.GetDate().todayFormatted + " 07:00" : this.globalService.GetDate().todayDateTimeFormattedWithoutSecond,
      description: 'Booked',
      status: dataTemp.status.active,
    };
    console.log('bookSeatData', bookSeatData);
    const id = this.fetchService.CreateBookSeat(bookSeatData);
    var result: any = await new Promise(resolve => {
      id.pipe(take(1)).subscribe((data: any) => {
        resolve(data);
      });
    });

    return result;
  }

  async WithdrawBookSeat(bookSeatData: BookSeatData) {
    await this.alertController.create({
      mode: 'ios',
      header: bookSeatData.code_id[1],
      message: 'Anda sedang menggunakan meja ini, Apakah anda ingin melakukan withdraw?',
      buttons: [{
        text: 'CANCEL',
        role: 'Cancel'
      }, {
        text: 'YES',
        handler: async () => {
          const loading = await this.loadingController.create();
          await loading.present();

          try {
            bookSeatData.employee_id = bookSeatData.employee_id[0];
            bookSeatData.code_id = bookSeatData.code_id[0];
            bookSeatData.status = dataTemp.status.inactive;

            console.log('bookSeatData', bookSeatData);
            const id = this.fetchService.UpdateBookSeat(bookSeatData);
            var result: any = await new Promise(resolve => {
              id.pipe(take(1)).subscribe((data: any) => {
                resolve(data);
              })
            })

            console.log('result', result);

            if (!result) throw new Error('Gagal withdraw');

            this.InitializeAllData();
            this.globalService.LogToast('Berhasil withdraw');
            await loading.dismiss();
          } catch (error: any) {
            await loading.dismiss();
            throw new Error(error);
          }
        }
      }]
    }).then(alert => {
      return alert.present();
    });
  }

  public SegmentChanged(ev: any) {
    console.log(ev);
    this.isSearch = false;
  }

  searchInput(event: any) {
    const query = event.target.value.toLowerCase();
    // console.log('Input', query);
  }

  async searchChange(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Search', query);
    this.inputs = query;
    if (this.inputs.length > 0) {
      this.search = this.userGroupDataList.filter(x =>
        Object.keys(x).some(k => x.name != null &&
          x.name.toString().toLowerCase()
            .includes(query.toLowerCase()))
      );
      this.isSearch = true;
    }
    else {
      this.search = [];
      this.isSearch = false;
    }
  }

  searchFocus(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Focus', query);
  }

  searchCancel(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Cancel', query);
    this.search = [];
    this.isSearch = false;
  }
}