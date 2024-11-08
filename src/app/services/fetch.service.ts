import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dataTemp } from '../dataTemp';
import { InjectorInstance } from '../app.module';
import { catchError, take } from 'rxjs';
import { GlobalService } from './global.service';

export interface SeatData {
  id?: string,
  code: string,
  name: string,
  description: string,
  status: string,
  // bookedSeatData?: BookSeatData
  bookedSeatData?: any
  divisi_id?: any
}

export interface VIPSeatData {
  id?: string,
  seat_id: string,
  employee_id: string,
  description: string,
  status: string,
}

export interface BookSeatData {
  id?: string,
  employee_id: string,
  date: string,
  code_id: string,
  book_datetime: string,
  description: string,
  status: string
}

export interface UserGroupData {
  id: string,
  nik: string,
  name: string,
  image: string,
  work_email: string,
  token: string,
  attendance_state: string,
  bookedSeatData?: BookSeatData
}

export interface AttendanceData {
  // id?: string,
  attendance_type: string,
  authorization: string,
  absen_date: string,
  time: string,
  // capture_image: string,
  // capture_ext: string
  work_from: string
  location: string
  kota: string
  provinsi: string
  activity_id: string
  reason: string
  // dectotal: string
  // health_check: string
  // suhu: string
  // interaksi: string
  // riwayat_sakit: string
  // kendaraan: string
  // rencana_keluar: string
  // external: string
  // kondisi_keluarga: string
  // waktu_olahraga: string
  is_request: string
  status: string
}

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  httpClient = InjectorInstance.get<HttpClient>(HttpClient);

  constructor(public http: HttpClient,
    public globalService: GlobalService
  ) { }

  GetSeat() {
    return this.httpClient.get(dataTemp.url.getSeat);
  }

  GetSeatById(id: string) {
    return this.httpClient.get(dataTemp.url.getSeatById, { params: { 'id': id } });
  }

  GetSeatByCode(code: string) {
    return this.httpClient.get(dataTemp.url.getSeatByCode, { params: { 'code': code } });
  }

  GetSeatByDivisiId(divisi_id: string) {
    return this.httpClient.get(dataTemp.url.getSeatByDivisiId, { params: { 'divisi_id': divisi_id } });
  }

  CreateSeat(seatData: SeatData) {
    let postdata = new FormData();
    postdata.append('code', seatData.code);
    postdata.append('name', seatData.name);
    postdata.append('description', seatData.description);
    postdata.append('status', seatData.status);

    return this.httpClient.post(dataTemp.url.createSeat, postdata);
  }

  UpdateSeat(seatData: SeatData) {
    let postdata = new FormData();
    postdata.append('id', seatData.id!);
    postdata.append('code', seatData.code);
    postdata.append('name', seatData.name);
    postdata.append('description', seatData.description);
    postdata.append('status', seatData.status);

    return this.httpClient.post(dataTemp.url.updateSeat, postdata);
  }

  /////////////////////////////
  GetVIPSeat() {
    return this.httpClient.get(dataTemp.url.getVIPSeat);
  }

  GetVIPSeatById(id: string) {
    return this.httpClient.get(dataTemp.url.getVIPSeatById, { params: { 'id': id } });
  }

  GetVIPSeatByDivisiId(divisi_id: string) {
    return this.httpClient.get(dataTemp.url.getVIPSeatByDivisiId, { params: { 'divisi_id': divisi_id } });
  }

  createVIPSeat(vipSeatData: VIPSeatData) {
    let postdata = new FormData();
    postdata.append('seat_id', vipSeatData.seat_id);
    postdata.append('employee_id', vipSeatData.employee_id);
    postdata.append('description', vipSeatData.description);
    postdata.append('status', vipSeatData.status);

    return this.httpClient.post(dataTemp.url.createVIPSeat, postdata);
  }

  UpdateVIPSeat(vipSeatData: VIPSeatData) {
    let postdata = new FormData();
    postdata.append('id', vipSeatData.id!);
    postdata.append('seat_id', vipSeatData.seat_id);
    postdata.append('employee_id', vipSeatData.employee_id);
    postdata.append('description', vipSeatData.description);
    postdata.append('status', vipSeatData.status);

    return this.httpClient.post(dataTemp.url.updateVIPSeat, postdata);
  }

  GetBookSeat() {
    return this.httpClient.get(dataTemp.url.getBookSeat);
  }

  GetBookSeatById(id: string) {
    return this.httpClient.get(dataTemp.url.getBookSeatById, { params: { 'id': id } });
  }

  GetBookSeatByDate(date: string) {
    return this.httpClient.get(dataTemp.url.getBookSeatByDate, { params: { 'date': date } });
  }

  GetBookSeatByDateAndDivisiId(date: string, divisi_id: string) {
    return this.httpClient.get(dataTemp.url.getBookSeatByDateAndDivisiId, { params: { 'date': date, 'divisi_id': divisi_id } });
  }

  CreateBookSeat(bookSeatData: BookSeatData) {
    let postdata = new FormData();
    postdata.append('employee_id', bookSeatData.employee_id);
    postdata.append('date', bookSeatData.date);
    postdata.append('code_id', bookSeatData.code_id);
    postdata.append('book_datetime', bookSeatData.book_datetime);
    postdata.append('description', bookSeatData.description);
    postdata.append('status', bookSeatData.status);

    return this.httpClient.post(dataTemp.url.createBookSeat, postdata);
  }

  UpdateBookSeat(bookSeatData: BookSeatData) {
    let postdata = new FormData();
    postdata.append('id', bookSeatData.id!);
    postdata.append('employee_id', bookSeatData.employee_id);
    postdata.append('date', bookSeatData.date);
    postdata.append('code_id', bookSeatData.code_id);
    postdata.append('book_datetime', bookSeatData.book_datetime);
    postdata.append('description', bookSeatData.description);
    postdata.append('status', bookSeatData.status);

    return this.httpClient.post(dataTemp.url.updateBookSeat, postdata);
  }

  GetUsersByDivisiId(divisi_id: string) {
    return this.httpClient.get(dataTemp.url.getUsersByDivisiId, { params: { 'divisi_id': divisi_id } });
  }

  CreateAttendance(attendanceData: AttendanceData) {
    let postdata = new FormData();
    postdata.append('attendance_type', attendanceData.attendance_type);
    postdata.append('authorization', attendanceData.authorization);
    postdata.append('absen_date', attendanceData.absen_date);
    postdata.append('time', attendanceData.time);
    postdata.append('work_from', attendanceData.work_from);
    postdata.append('location', attendanceData.location);
    postdata.append('kota', attendanceData.kota);
    postdata.append('provinsi', attendanceData.provinsi);
    postdata.append('activity_id', attendanceData.activity_id);
    postdata.append('reason', attendanceData.reason);
    postdata.append('is_request', attendanceData.is_request);
    postdata.append('status', attendanceData.status);

    return this.httpClient.post(dataTemp.url.createAbsen, postdata);
  }

  GetAttendancePerdate(date: string) {
    let postdata = new FormData();
    postdata.append('authorization', this.globalService.userData.token);
    postdata.append('date', date);

    return this.httpClient.post(dataTemp.url.getAttendancePerdate, postdata);
  }

  async Login(username: string, password: string) {
    var data = this.httpClient.post(dataTemp.url.loginHITS, { email: username, password: password, device_name: 'Web Browser' });
    var auth: any = await new Promise(resolve => {
      data.pipe(take(1), catchError((error) => { throw error }))
        .subscribe(
          (data: any) => {
            resolve({ status: 'success', data: data.token });
          },
          (error) => {
            const msg = this.GetErrMsg(error.error.error);
            resolve({ status: 'failed', data: msg });
          })
    })

    if (auth.status == 'success') {
      let postdata = new FormData();
      postdata.append('username', username);
      postdata.append('password', password);
      return this.httpClient.post(dataTemp.url.loginSSO, postdata);
    }
    else {
      let postdata = new FormData();
      postdata.append('username', username);
      postdata.append('password', password);
      return this.httpClient.post(dataTemp.url.login, postdata);
      // throw (auth.data);
    }
  }

  GetErrMsg(error: any) {
    if (error == 'Email is not registered.') return 'Login Gagal! Email tidak terdaftar.';
    else if (error == 'The provided credentials do not match our records.') return 'Login Gagal! Username atau Password Salah.';
    else return 'Login Gagal!';
  }
}
