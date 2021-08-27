import { Component, OnInit } from '@angular/core';
import { MENU_super_ITEM   } from '../menu';
@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.scss']
})
export class SuperadminComponent implements OnInit {
  public super_Item = MENU_super_ITEM;
  constructor() { }

  ngOnInit() {
  }

}
