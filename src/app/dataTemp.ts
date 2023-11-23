import { environment } from "src/environments/environment";

export var url = {
    url: environment.production ? 'https://absensi.hutamakarya.com/api/' : 'https://absensi.hutamakarya.com/api/',
    urlHITS: environment.production ? 'https://api-core.hits.hutamakarya.com/api/' : 'https://api-core.hits.hutamakarya.com/api/',
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
        'createSeat': url.url + 'createSeat',
        'updateSeat': url.url + 'updateSeat',
        'getBookSeat': url.url + 'getBookSeat',
        'getBookSeatById': url.url + 'getBookSeatById',
        'getBookSeatByDate': url.url + 'getBookSeatByDate',
        'createBookSeat': url.url + 'createBookSeat',
        'updateBookSeat': url.url + 'updateBookSeat',
        'authAD': url.url + 'authAD',
        'loginSSO': url.url + 'loginSSO',
        'login': url.urlHITS + 'login'
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
        "description": "Kursi EVP",
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
        "id": 1,
        "employee_id": [
            9853,
            "Nur Ridho A"
        ],
        "date": "2023-09-08",
        "code_id": [
            1,
            "Kursi EVP"
        ],
        "book_datetime": "2023-09-15.34",
        "description": "Untuk hari ini",
        "status": "active",
        "create_uid": [
            2,
            "admin"
        ],
        "create_date": "2023-09-08 08:54:53",
        "write_uid": [
            2,
            "admin"
        ],
        "write_date": "2023-09-08 08:54:53",
        "display_name": "tr.book.seat,1",
        "__last_update": "2023-09-08 08:54:53"
    },
}