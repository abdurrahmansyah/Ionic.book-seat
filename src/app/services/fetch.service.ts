import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { dataTemp } from '../dataTemp';
import { InjectorInstance } from '../app.module';
import { take } from 'rxjs';

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
    let postdata = new FormData();
    postdata.append('username', username);
    postdata.append('password', password);

    var data = this.httpClient.post(dataTemp.url.authAD, postdata);
    var auth = await new Promise(resolve => {
      data.pipe(take(1)).subscribe((data: any) => {
        resolve(data.auth);
      })
    })

    if (auth) {
      return this.httpClient.post(dataTemp.url.loginSSO, postdata);
    }
    else throw ('Login Gagal! Username atau Password Salah.')
  }
}
