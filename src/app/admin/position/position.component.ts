import { Component, OnInit, ViewChild } from '@angular/core';
import { PositionService } from './position.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../../theme/components/confirmation-box/confirmation-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {

  displayedColumns: string[] = [];
  //ImageURL = this._globals.IMAGEURL;
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public _globals: Globals, private translate: TranslateService, public router: Router, public dialog: MatDialog,
    public _service: PositionService, private spinner: NgxSpinnerService) {
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
    this._service.get().subscribe((res) => {
      if (res.success) {
        this.dataSource = new MatTableDataSource(res.data);
        this.displayedColumns = ['positionId', 'positionName', 'actions'];
        this.dataSource.paginator = this.paginator;
      } else {
        //this.companyList = [];
      }
      this.spinner.hide();
    });
  }
  addCompany() {
    this.router.navigate(['admin/position/add'], { skipLocationChange: false });
  }
  editCompany(obj) {
    this.router.navigate(['admin/position/edit/' + obj.positionId], { skipLocationChange: false });
  }
  deleteCompany(obj) {
    this.translate.get('dialog.DeletePosSure').subscribe(value => {
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: obj.positionId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._service.delete(obj.positionId).subscribe((res) => {
            if (res.success) {
              this.loadCompany();
            }
          });
        }
      });
    });
  }
}
