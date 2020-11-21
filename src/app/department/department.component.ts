import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DepartmentService } from './department.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../theme/components/confirmation-box/confirmation-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Globals } from '../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class DepartmentComponent implements OnInit, AfterViewInit {
  bLoading = true;
  bDepartmentEntriesFound = false;

  isExtendedRow = (index, item) => item.extend;

  displayedColumns: string[] = ['status', 'logo', 'departmentName', 'sumMember', 'sumCourses', 'editDelete'];
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private spinner: NgxSpinnerService, public router: Router, public dialog: MatDialog, private translate: TranslateService,
    public _service: DepartmentService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.dataSource = new MatTableDataSource();
    var obj = this;
    this.dataSource.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.departmentName, filter);
    }

    this.spinner.hide();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  filterFunction(name: string, filter: string) {
    var bMatch = true;
    var trimLowerFilter = filter.trim().toLowerCase().replace(/\s+/g, ' ');
    var splitFilter = trimLowerFilter.split(" ");
    splitFilter.forEach(filterPred => {
      if (!name.toLowerCase().includes(filterPred)) {
        bMatch = false;
      }
    });

    // (data.FIRSTNAME.toLowerCase() == filter)
    return bMatch;
  }
  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
  applyDepartmentFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnInit() {
    //this.spinner.show();
    this.loadDepartment();
  }
  loadDepartment() {
    this.bLoading = true;
    this._service.getDepartmentByCom(this._globals.companyInfo.companyId).subscribe((res) => {
      if (res.success) {
        this.bDepartmentEntriesFound = true;
        this.dataSource.data = res.data;
        // this.dataSource = new MatTableDataSource(res.data);
        // this.displayedColumns = ['logo', 'departmentName', 'sumMember', 'sumCourses', 'editDelete'];
        // this.dataSource.paginator = this.paginator;
      } else {
        var text = [
          { departmentName: this.translate.instant('department.NoDepFound'), extend: true }
        ];
        this.dataSource.data = text;
        this.bDepartmentEntriesFound = false;
        // this.dataSource = new MatTableDataSource();
        // this.displayedColumns = ['logo', 'departmentName', 'sumMember', 'sumCourses', 'editDelete'];
      }
      //this.spinner.hide();
      this.bLoading = false;
    });
  }
  addDepartment() {
    if (this._globals.getUserType() == "1") {
      this.router.navigate(['superadmin/department/add'], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "2") {
      this.router.navigate(['admin/department/add'], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "3") {
      this.router.navigate(['trainer/department/add'], { skipLocationChange: false });
    } else {
      //this.router.navigate(['employee/department/add'], { skipLocationChange: false });
    }
  }
  editDepartment(obj) {
    if (this._globals.getUserType() == "1") {
      this.router.navigate(['superadmin/department/edit', obj.departmentId], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "2") {
      this.router.navigate(['admin/department/edit', obj.departmentId], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "3") {
      this.router.navigate(['trainer/department/edit', obj.departmentId], { skipLocationChange: false });
    } else {
      this.router.navigate(['employee/department/edit', obj.departmentId], { skipLocationChange: false });
    }
  }
  deleteDepartment(obj) {
    if (!this._globals.userInfo.isAdmin) {
      return;
    }
    this.translate.get('dialog.DeleteDepSure').subscribe(value => {
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: obj.departmentId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._service.delete(obj.departmentId).subscribe((res) => {
            if (res.success) {
              this.loadDepartment();
            }
          });
        }
      });
    });
  }
  viewDepartment(department) {
    this.spinner.show();
    var userType = this._globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/department', department.departmentId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/department', department.departmentId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/department', department.departmentId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./employee/department', department.departmentId], { skipLocationChange: false });
    }
  }
}
