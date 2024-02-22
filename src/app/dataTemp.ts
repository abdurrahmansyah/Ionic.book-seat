import { environment } from "src/environments/environment";
import { formatDate } from '@angular/common';

export var url = {
    url: environment.production ? 'https://absensi.hutamakarya.com/api/' : 'https://absensi.hutamakarya.com/api/',
    urlHITS: environment.production ? 'https://api-core.hits.hutamakarya.com/api/' : 'https://api-core.hits.hutamakarya.com/api/',
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
}

export class DataTempClass {
    public GetDate(param?: any): DateData {
        var dateData = new DateData();
        var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
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

        return dateData;
    }
}

export var dataTemp = {
    status: {
        'active': 'active',
        'inactive': 'inactive',
    },
    route: {
        'login': '/login',
        'home': '/tabs/home',
        'profile': '/tabs/profile',
    },
    url: {
        'getSeat': url.url + 'getSeat',
        'getSeatById': url.url + 'getSeatById',
        'getSeatByCode': url.url + 'getSeatByCode',
        'getSeatByDivisiId': url.url + 'getSeatByDivisiId',
        'createSeat': url.url + 'createSeat',
        'updateSeat': url.url + 'updateSeat',
        'getVIPSeat': url.url + 'getVIPSeat',
        'getVIPSeatById': url.url + 'getVIPSeatById',
        'getVIPSeatByDivisiId': url.url + 'getVIPSeatByDivisiId',
        'createVIPSeat': url.url + 'createVIPSeat',
        'updateVIPSeat': url.url + 'updateVIPSeat',
        'getBookSeat': url.url + 'getBookSeat',
        'getBookSeatById': url.url + 'getBookSeatById',
        'getBookSeatByDate': url.url + 'getBookSeatByDate',
        'getBookSeatByDateAndDivisiId': url.url + 'getBookSeatByDateAndDivisiId',
        'createBookSeat': url.url + 'createBookSeat',
        'updateBookSeat': url.url + 'updateBookSeat',
        'getUsersByDivisiId': url.url + 'getUsersByDivisiId',
        'authAD': url.url + 'authAD',
        'loginSSO': url.url + 'loginSSO',
        'loginHITS': url.urlHITS + 'login',
        'login': url.url + 'login'
    },
    userGroup: {
        'divisiSIT': '1489',
    },
    user: {
        "id": 9853,
        "name": "Nur Ridho A",
        "work_email": "ridho.abdurrahmansyah@hutamakarya.com",
        "nik": "2195.4147",
        "token": "20200113$2y$10$j1yhevO9XNuvP9CKx1FGge5cMMOOJ4DRlUUUbYUIIw9Yo4nC3Gd4S123753",
        "divisi_id": 1489,
        "title_name": "Officer Teknologi Informasi",
        "title_id": 36654,
        "section_name": "Bagian Teknologi Informasi",
        "section_id": 6483,
        "divisi_name": "Divisi Sistem, TI & Riset Teknologi",
        "superior_name": "",
        "superior_id": 0,
        "token_fcm": "",
        "image": ""
    },
    seat: {
        "id": 1,
        "code": "SIT001",
        "name": "Kursi EVP",
        "description": "vip",
        "status": "active",
        "create_uid": [
            2,
            "admin"
        ],
        "create_date": "2023-09-08 08:27:52",
        "write_uid": [
            2,
            "admin"
        ],
        "write_date": "2023-09-08 08:27:52",
        "display_name": "Kursi EVP",
        "__last_update": "2023-09-08 08:27:52"
    },
    bookSeat: {
        "id": 1157,
        "employee_id": [
            10005,
            "Nurindra Notarianto"
        ],
        "date": "2024-01-11",
        "code_id": [
            12,
            "Kursi 12"
        ],
        "book_datetime": new DataTempClass().GetDate().todayDateTimeFormattedWithoutSecond,
        "description": "Booked",
        "status": "active",
        "create_uid": [
            2,
            "admin"
        ],
        "create_date": "2024-01-11 01:12:54",
        "write_uid": [
            2,
            "admin"
        ],
        "write_date": "2024-01-11 01:12:54",
        "display_name": "tr.book.seat,1157",
        "__last_update": "2024-01-11 01:12:54"
    },
    desc_seat: {
        "vip": "vip",
        "public": "public"
    },
    divisi_name: {
        SIT: "Divisi Sistem, TI & Riset Teknologi",
        SEKPER: "Sekretaris Perusahaan",
        QHSSE: "Divisi QHSSE",
        SPI: "Satuan Pengawas Internal",
    }
}