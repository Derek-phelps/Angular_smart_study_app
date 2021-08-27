import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../employee/employee.service';
import { Globals } from '../common/auth-guard.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../theme/components/confirmation-box/confirmation-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public router: Router, private translate: TranslateService, public dialog: MatDialog, public _service: EmployeeService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    this.loadCompany();
  }
  loadCompany() {

    if (this._globals.getUserType() == "1") {
      this._service.getAllEmployess().subscribe((res) => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.displayedColumns = ['epath', 'EmpName', 'companyName', 'departmentName', 'MOBILEPHONE', 'actions'];
          this.dataSource.paginator = this.paginator;
        }
      });

    } else if (this._globals.getUserType() == "2") {
      this._service.getEmployeesByCompID(this._globals.companyInfo.companyId).subscribe((res) => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.displayedColumns = ['epath', 'EmpName', 'companyName', 'departmentName', 'MOBILEPHONE', 'actions'];
          this.dataSource.paginator = this.paginator;
        }
      });
    } else if (this._globals.getUserType() == "3") {
      if (this._globals.companyInfo.companyId > 0) {
        this._service.getEmployeesByCompID(this._globals.companyInfo.companyId).subscribe((res) => {
          if (res.success) {
            this.dataSource = new MatTableDataSource(res.data);
            this.displayedColumns = ['epath', 'EmpName', 'companyName', 'departmentName', 'MOBILEPHONE', 'actions'];
            this.dataSource.paginator = this.paginator;
          }
        });
      } else {
        this._service.getAllEmployess().subscribe((res) => {
          if (res.success) {
            this.dataSource = new MatTableDataSource(res.data);
            this.displayedColumns = ['epath', 'EmpName', 'companyName', 'departmentName', 'MOBILEPHONE', 'actions'];
            this.dataSource.paginator = this.paginator;
          }
        });
      }
    } else {
      this._service.getEmployeesByCompID(this._globals.companyInfo.companyId).subscribe((res) => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.displayedColumns = ['epath', 'EmpName', 'companyName', 'positionName', 'MOBILEPHONE', 'EMAIL', 'actions'];
          this.dataSource.paginator = this.paginator;
        }
      });
    }

  }
  addCompany() {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/employees/add';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/employees/add';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/employees/add';
    } else {
      path = 'employee/employees/add';
    }
    this.router.navigate([path], { skipLocationChange: false });
  }
  editCompany(obj) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/employees/edit/';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/employees/edit/';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/employees/edit/';
    } else {
      path = 'employee/employees/edit/';
    }
    this.router.navigate([path + obj.empId], { skipLocationChange: false });
  }
  deleteCompany(obj) {
    this.translate.get('dialog.DeleteEmpSure').subscribe(value => {
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: obj.empId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._service.deleteEmployess(obj.empId).subscribe((res) => {
            if (res.success) {
              this.loadCompany();
            }
          });
        }
      });
    });
  }
}
