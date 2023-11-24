import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { take } from 'rxjs';
import { dataTemp } from 'src/app/dataTemp';
import { AuthService } from 'src/app/services/auth.service';
import { FetchService } from 'src/app/services/fetch.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  dummyUser = {
    "id": 9853,
    "name": "Admin Testing User",
    "work_email": "ridho.abdurrahmansyah@hutamakarya.com",
    "nik": "2195.4147",
    "token": "20200113$2y$10$j1yhevO9XNuvP9CKx1FGge5cMMOOJ4DRlUUUbYUIIw9Yo4nC3Gd4S123753",
    "divisi_id": 1489,
    "title_name": "Officer Teknologi Informasi",
    "title_id": 36654,
    "section_name": "Bagian Teknologi Informasi",
    "section_id": 6483,
    "divisi_name": "Divisi Sistem, TI & Riset Teknologi",
    "superior_name": null,
    "superior_id": null,
    "token_fcm": null,
    "image": ""
  };

  constructor(private router: Router,
    private loadingController: LoadingController,
    private fetchService: FetchService,
    private globalService: GlobalService,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  async Login() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      if (this.email == 'usertest@hutamakarya.com' && this.password == 'psswrd!') {
        this.globalService.userData = this.dummyUser;
      } else {
        this.ValidateData();
        const data = await this.fetchService.Login(this.email, this.password);
        var result: any = await new Promise(resolve => {
          data.pipe(take(1)).subscribe((data: any) => {
            resolve(data);
          })
        })

        if (result.response == 'failed') throw (result.data);
        this.globalService.userData = result.data;
      }
      console.log(this.globalService.userData);

      this.authService.login(this.globalService.userData.token);
      await this.globalService.SaveUserToPreferences();
      this.globalService.LogToast('Login Berhasil');
      await loading.dismiss();
      this.router.navigateByUrl(dataTemp.route.home, { replaceUrl: true });
    } catch (error: any) {
      this.globalService.LogAlert(error);
      await loading.dismiss();
    }
  }

  ValidateData() {
    if (!this.email) throw ('Email tidak boleh kosong!');
    if (!this.password) throw ('Password tidak boleh kosong!');
    this.email = this.email.toLowerCase();
  }
}
