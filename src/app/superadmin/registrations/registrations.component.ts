import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { take } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SuperadminService } from '../superadmin.service';
// import { Globals } from 'src/app/common/auth-guard.service';

import { ConfirmationBoxComponent } from '../../theme/components/confirmation-box/confirmation-box.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.scss'],
  providers: [DatePipe]
})
export class RegistrationsComponent implements OnInit {

  private _registeredUsers: [];
  private _tableLoading: boolean = true;
  private _licenseDialog: boolean = false;
  private _editLicense: Date = undefined;
  private _editUserId: Number = undefined;

  constructor(
    private _spinner: NgxSpinnerService,
    private _service: SuperadminService,
    private _datePipe: DatePipe,
    private _snackbar: MatSnackBar,
    private _translate: TranslateService,
    public dialog: MatDialog
    // private _globals: Globals
  ) {
    this._spinner.hide();
  }

  ngOnInit(): void {
    this.loadTable();
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

  getButtonClass(licenseUntil): string {
    let date = new Date(licenseUntil + ' UTC');
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0);
    if (licenseUntil == null || date >= todayDate) {
      return "p-button-raised p-button-success";
    } else {
      return "p-button-raised p-button-danger";
    }
  }

  loadTable(): void {
    this._tableLoading = true;
    this._service.getAllRegistrations().pipe(take(1)).subscribe(registrations => {
      if (registrations?.success) {
        this._registeredUsers = registrations.registrations;
      } else {
        this._registeredUsers = [];
      }
      this._tableLoading = false;
    });
  }

  editLicense(user): void {
    this._editLicense = user.licenseUntil != null ? new Date(user.licenseUntil + ' UTC') : null;
    this._editUserId = Number(user.UserId);
    this._licenseDialog = true;
  }

  deleteFullRegistration(user): void {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: 0, Action: false, Mes: this._translate.instant('dialog.DeleteRegSure', { name: user.FULLNAME }) },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        // this._spinner.show();
        this._tableLoading = true;
        this._service.deleteRegistration(user.UserId).pipe(take(1)).subscribe(data => {
          if (data?.success) {
            this._snackbar.open(this._translate.instant('registrations.DeleteRegSuccess'), '', { duration: 3000 });
          } else {
            this._snackbar.open(this._translate.instant('registrations.DeleteRegFail'), '', { duration: 3000 });
          }
          this.loadTable();
        }, () => {
          this._snackbar.open(this._translate.instant('registrations.DeleteRegFail'), '', { duration: 3000 });
          this.loadTable();
        });
      }
    });
  }

  hideDialog(): void {
    this._licenseDialog = false;
    this._editLicense = undefined;
    this._editUserId = undefined;
  }

  saveLicense() {
    this._tableLoading = true;
    let userId = this._editUserId;
    let formatLicense = this._datePipe.transform(this._editLicense, 'yyyy-MM-dd');
    this.hideDialog();
    this._service.updateLicense(userId, formatLicense).pipe(take(1)).subscribe(data => {
      if (data?.success) {
        this._snackbar.open(this._translate.instant('registrations.LicenseUpdateSuccess'), '', { duration: 3000 });
      } else {
        this._snackbar.open(this._translate.instant('registrations.LicenseUpdateFail'), '', { duration: 3000 });
      }
      this.loadTable();
    }, () => {
      this._snackbar.open(this._translate.instant('registrations.LicenseUpdateFail'), '', { duration: 3000 });
      this.loadTable();
    });
  }

  get registeredUsers(): [] { return this._registeredUsers; }
  get tableLoading(): boolean { return this._tableLoading; }
  get licenseDialog(): boolean { return this._licenseDialog; }
  set licenseDialog(licenseDialog: boolean) { this._licenseDialog = licenseDialog; }
  get selectedLicense(): Date { return this._editLicense; }
  set selectedLicense(date: Date) { this._editLicense = date; }
  get calendarLocale(): string { return "de"; }
}
