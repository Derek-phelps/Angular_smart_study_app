import { Component, Input } from '@angular/core';
import { collapse } from '../../animation/collapse-animate';
import { GlobalService } from '../../services/global.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Globals } from 'src/app/common/auth-guard.service';

@Component({
  selector: 'du-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [collapse]
})
export class MenuComponent {
  @Input() menuInfo: any;
  @Input() showSeparators = true;
  appendDepartments = false;
  appendGroups = false;
  appendCourses = false;

  constructor(private _globalService: GlobalService, private spinner: NgxSpinnerService, public globals: Globals) {
    this.appendDepartments = globals.hasDepartments;
    this.appendGroups = globals.hasGroups;
    this.appendCourses = globals.hasCourses || globals.canCreateCourses;
  }

  isToggleOn(item) {
    item.toggle === 'on' ? item.toggle = 'off' : item.toggle = 'on';
  }

  _selectItem(item, bLocChange = true) {
    if (item.disabled) {
      alert("TODO");
      return;
    }

    if (bLocChange) {
      this.spinner.show();
    }

    this._globalService._isActived(item);
    this._globalService.dataBusChanged('isActived', item);
    if (window.innerWidth <= 800) {
      this._globalService.dataBusChanged('sidebarToggle', false);
    }
  }
}