import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private globalService: GlobalService) {
  }

  async ngOnInit() {
    await this.globalService.GetUserFromPreference();
    this.globalService.isUserDataLoad = true;
  }
}
