import { Component, OnInit } from '@angular/core';
import { MENU_admin_ITEM, MENU_admin_ITEM_fagus   } from '../menu';
import { Globals } from '../common/auth-guard.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public admin_Item :Array<any>;
  constructor(private _globals: Globals) { }

  ngOnInit() {
    this.admin_Item = MENU_admin_ITEM;
    if (this._globals.companyInfo.webUrl == 'fagus' || this._globals.companyInfo.webUrl == 'fagus-consult') {
      this.admin_Item = MENU_admin_ITEM_fagus;
    }
  }

}
