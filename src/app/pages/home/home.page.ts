import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { take } from 'rxjs';
import { dataTemp } from 'src/app/dataTemp';
import { BookSeatData, FetchService, SeatData } from 'src/app/services/fetch.service';
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

  isAlreadyBook: boolean = false;
  bookedSeatData: BookSeatData | undefined;

  isIOS: boolean = false;

  constructor(
    private fetchService: FetchService,
    private globalService: GlobalService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public platform: Platform) { }

  async ngOnInit() {
    try {
      await this.InitializeApp();
      await this.InitializeData();
    } catch (error: any) {
      this.globalService.LogAlert(error);
    }
  }

  async InitializeApp() {
    const requestPermissions = await BarcodeScanner.requestPermissions().catch((err) => { throw err.message });
    this.isIOS = this.platform.is('ios') ? true : false;
  }

  async InitializeData() {
    this.bookSeatDataList = await this.GetBookSeatByDate();
    this.seatDataList = await this.GetSeat();
    console.log('bookSeatDataList', this.bookSeatDataList);

    if (this.bookSeatDataList.length > 0) {
      this.seatDataList.forEach(seat => {
        seat.bookedSeatData = this.bookSeatDataList.find(x => x.code_id[0] == seat.id);
      });

      this.bookedSeatData = this.bookSeatDataList.find(x => x.employee_id[0] == this.globalService.userData.id);
      if (this.bookedSeatData) this.isAlreadyBook = true;
      console.log('this.bookedSeatData', this.bookedSeatData);
    }
    console.log('seatDataList', this.seatDataList);
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

  async ScanSementara() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.InitializeData();
      this.ValidateUser();
      await loading.dismiss();
      this.alertController.create({
        mode: 'ios',
        message: 'Kode Meja',
        inputs: [{
          placeholder: 'Masukkan Kode Meja',
          type: 'textarea',
          cssClass: 'kode-meja'
        }],
        buttons: [{
          text: 'CANCEL',
          role: 'Cancel'
        }, {
          text: 'YES',
          handler: async (code) => {
            const loading = await this.loadingController.create();
            await loading.present();

            try {
              const seat: SeatData = await this.GetSeatByCode(code[0]);
              this.ValidateSeat(seat);
              console.log('seat', seat);

              const bookSeatData: BookSeatData = {
                employee_id: this.globalService.userData.id,
                date: this.globalService.GetDate().todayFormatted,
                code_id: seat.id!,
                book_datetime: this.globalService.GetDate().todayDateTimeFormattedWithoutSecond,
                description: 'TES APP',
                status: dataTemp.status.active,
              }
              console.log('bookSeatData', bookSeatData);
              const id = this.fetchService.CreateBookSeat(bookSeatData);
              var result: any = await new Promise(resolve => {
                id.pipe(take(1)).subscribe((data: any) => {
                  resolve(data);
                })
              })

              console.log('result', result);

              if (!result) throw ('Gagal book');

              this.InitializeData();
              this.globalService.LogToast('Berhasil book');
              await loading.dismiss();
            } catch (error: any) {
              await loading.dismiss();
              throw (error);
            }
          }
        }]
      }).then(alert => {
        return alert.present();
      });
    } catch (e: any) {
      await loading.dismiss();
      this.globalService.LogAlert(e.message);
    }
  }

  async ScanAndBook() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.InitializeData();
      this.ValidateUser();
      await this.CheckAndInstallGoogleBarcodeScanner();
      const code = await this.ScanBarcode();
      const seat = await this.GetSeatByCode(code);
      this.ValidateSeat(seat);
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
      // const code = 'SIT005';
      const code = await this.ScanBarcode();
      const seat = await this.GetSeatByCode(code);
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

  ValidateUser() {
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

  ValidateSeat(seat: SeatData) {
    var bookSeatData = this.bookSeatDataList.find(x => x.code_id[0] == seat.id);

    if (bookSeatData) throw new Error('Booking Gagal! Meja sedang digunakan oleh ' + bookSeatData.employee_id[1]);
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

            const bookSeatData: BookSeatData = {
              employee_id: this.globalService.userData.id,
              date: this.globalService.GetDate().todayFormatted,
              code_id: seat.id!,
              book_datetime: this.globalService.GetDate().todayDateTimeFormattedWithoutSecond,
              description: 'Booked',
              status: dataTemp.status.active,
            }
            console.log('bookSeatData', bookSeatData);
            const id = this.fetchService.CreateBookSeat(bookSeatData);
            var result: any = await new Promise(resolve => {
              id.pipe(take(1)).subscribe((data: any) => {
                resolve(data);
              })
            })

            console.log('result', result);

            if (!result) throw new Error('Gagal book');

            this.InitializeData();
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

            this.InitializeData();
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
}