import { Component, OnInit } from '@angular/core';

import { take } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { SuperadminService } from '../superadmin.service';
import { Globals } from 'src/app/common/auth-guard.service';

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.scss']
})
export class RegistrationsComponent implements OnInit {

  private _registeredUsers: [];

  constructor(
    private _spinner: NgxSpinnerService,
    private _service: SuperadminService,
    private _globals: Globals
  ) {
  }

  ngOnInit(): void {
    this._service.getAllRegistrations().pipe(take(1)).subscribe(registrations => {
      if (registrations?.success) {
        this._registeredUsers = registrations.registrations;
        this._spinner.hide();
      }
    });
  }

  formatDate(dateString): Date {
    let date = new Date(dateString + ' UTC');
    return date;
  }

  getIcon(licenseUntil): string {
    let date = new Date(licenseUntil + ' UTC');
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0);
    if (licenseUntil == null || date >= todayDate) {
      return "pi pi-check";
    } else {
      return "pi pi-times";
    }
  }

  getSeverity(licenseUntil): string {
    let date = new Date(licenseUntil + ' UTC');
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0);
    if (licenseUntil == null || date >= todayDate) {
      return "success";
    } else {
      return "danger";
    }
  }

  get registeredUsers(): [] { return this._registeredUsers; }


}
