import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';

// import { Preferences } from '@capacitor/storage';
import { Preferences } from '@capacitor/preferences';
import { GlobalService } from './global.service';


const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  token = '';

  constructor(private http: HttpClient,
    private globalService: GlobalService) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('auth token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(token: string) {
    return from(Preferences.set({ key: TOKEN_KEY, value: token }).then(() => {
      this.isAuthenticated.next(true);
    }));
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    this.globalService.RemoveUserFromPreference();
    Preferences.remove({ key: "welcome-seen" });
    return Preferences.remove({ key: TOKEN_KEY });
  }
}