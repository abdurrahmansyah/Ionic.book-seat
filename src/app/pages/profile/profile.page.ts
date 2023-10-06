import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any;

  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
    public router: Router) {
    this.userData = this.globalService.userData;
  }

  ngOnInit() {
  }

  async Logout() {
    await this.authService.logout();
    await this.globalService.RemoveUserFromPreference();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
