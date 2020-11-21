import { Component, OnInit, ViewChild } from '@angular/core';
import { SuperadminService } from '../superadmin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../../theme/components/confirmation-box/confirmation-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AddCourseComponent } from './components/addCourse/addCourse.component';
import { Globals } from '../../common/auth-guard.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  displayedColumns: string[] = [];
  //ImageURL = this._globals.IMAGEURL;
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public router: Router, public dialog: MatDialog, public _service: SuperadminService, public _globals: Globals) { }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    this.loadCompany();
  }
  loadCompany() {
    this._service.getAllCompany().subscribe((res) => {
      if (res.success) {
        this.dataSource = new MatTableDataSource(res.data);
        this.displayedColumns = ['companyId', 'companyLogo', 'companyName', 'webUrl', 'NumOfEmp', 'Courses', 'actions'];
        this.dataSource.paginator = this.paginator;
      } else {
        //this.companyList = [];
      }
    });
  }
  addCompany() {
    this.router.navigate(['superadmin/company/add'], { skipLocationChange: false });
  }
  editCompany(obj) {
    this.router.navigate(['superadmin/company/edit/' + obj.companyId], { skipLocationChange: false });
  }
  addCourse(obj) {
    const dialogRef = this.dialog.open(AddCourseComponent, {
      width: '400px',
      data: { companyId: obj.companyId, Action: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompany();
      }
    });
  }
  deleteCompany(obj) {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: obj.companyId, Action: false, Mes: "Are you sure delete this company?" },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._service.deleteCompany(obj.companyId).subscribe((res) => {
          if (res.success) {
            this.loadCompany();
          }
        });
      }
    });
  }
}
