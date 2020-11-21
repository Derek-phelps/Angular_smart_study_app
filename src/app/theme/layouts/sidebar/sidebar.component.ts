import { Component, Input, OnInit } from '@angular/core';
import { menuService } from '../../services/menu.service';
import { GlobalService } from '../../services/global.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Globals } from '../../../common/auth-guard.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [menuService],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, left: 0 })),
      state('hidden', style({ opacity: 0, left: -200 })),
      transition('shown => hidden', animate(200)),
      transition('hidden => shown', animate(520))
    ]),
    trigger('visibilityChanged2', [
      state('shown', style({ opacity: 1, zIndex: 998 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('shown => hidden', animate(200)),
      transition('hidden => shown', animate(500))
    ])
  ]
})
export class SidebarComponent implements OnInit {


  @Input() menuInfo: Array<any> = [];
  public sidebarToggle = true;

  constructor(private _menuService: menuService,
    public _globalService: GlobalService, public _globals: Globals) {
    this.sidebarToggle = this._globals.sidebarToggle;
  }

  ngOnInit() {
    this._menuService.menu_Item = this.menuInfo;
    this._menuService.selectItem(this.menuInfo);
    this._isSelectItem(this.menuInfo);

    this._globalService.data$.subscribe(data => {
      if (data.ev === 'sidebarToggle') {
        this.sidebarToggle = data.value;
      }
    }, error => {
      console.log('Error: ' + error);
    });
  }

  _isSelectItem(item) {
    for (const i in item) {
      if (item[i].children) {
        for (const index in item[i].children) {
          if (item[i].children[index].isActive || item[i].children[index].toggle === 'on') {
            item[i].toggle = 'on';
            break;
          } else {
            this._isSelectItem(item[i].children);
          }
        }
      }
    }
  }

  close() {
    this._globalService.dataBusChanged('sidebarToggle', false);
  }
}
