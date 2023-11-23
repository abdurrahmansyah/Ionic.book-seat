import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dataTemp } from '../dataTemp';
import { InjectorInstance } from '../app.module';
import { catchError, take } from 'rxjs';

export interface SeatData {
  id?: string,
  code: string,
  name: string,
  description: string,
  status: string,
  bookedSeatData?: BookSeatData
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

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  httpClient = InjectorInstance.get<HttpClient>(HttpClient);

  constructor(public http: HttpClient) { }

  GetSeat() {
    return this.httpClient.get(dataTemp.url.getSeat);
  }

  GetSeatById(id: string) {
    return this.httpClient.get(dataTemp.url.getSeatById, { params: { 'id': id } });
  }

  GetSeatByCode(code: string) {
    return this.httpClient.get(dataTemp.url.getSeatByCode, { params: { 'code': code } });
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

  GetBookSeat() {
    return this.httpClient.get(dataTemp.url.getBookSeat);
  }

  GetBookSeatById(id: string) {
    return this.httpClient.get(dataTemp.url.getBookSeatById, { params: { 'id': id } });
  }

  GetBookSeatByDate(date: string) {
    return this.httpClient.get(dataTemp.url.getBookSeatByDate, { params: { 'date': date } });
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

  async Login(username: string, password: string) {
    var data = this.httpClient.post(dataTemp.url.login, { email: username, password: password, device_name: 'Web Browser' });
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
    else throw (auth.data)
  }

  GetErrMsg(error: any) {
    if (error == 'Email is not registered.') return 'Login Gagal! Email tidak terdaftar.';
    else if (error == 'The provided credentials do not match our records.') return 'Login Gagal! Username atau Password Salah.';
    else return 'Login Gagal!';
  }
}
