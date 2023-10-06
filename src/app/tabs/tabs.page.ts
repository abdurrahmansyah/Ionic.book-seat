import { Component } from '@angular/core';
import { dataTemp } from '../dataTemp';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  route = dataTemp.route;

  constructor() {}

}
