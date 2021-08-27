import { Component, OnInit, ViewChild } from '@angular/core';
import { TrainersService } from './trainers.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../theme/components/confirmation-box/confirmation-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Globals } from '../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss']
})
export class TrainersComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public router: Router, private translate: TranslateService, public dialog: MatDialog, public _service: TrainersService, public _globals: Globals) {
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

    this._service.getAllTrainers().subscribe((res) => {
      if (res.success) {
        this.dataSource = new MatTableDataSource(res.data);
        this.displayedColumns = ['epath', 'UserName', 'EmailID', 'companyName', 'actions'];
        this.dataSource.paginator = this.paginator;
      }
    });
  }
  addCompany() {
    this.router.navigate(['superadmin/trainers/add'], { skipLocationChange: false });
  }
  editCompany(obj) {
    this.router.navigate(['superadmin/trainers/edit/' + obj.trainerId], { skipLocationChange: false });
  }
  deleteCompany(obj) {
    this.translate.get('dialog.DeleteTrainerSure').subscribe(value => {
      //alert(value);
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: obj.trainerId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          this._service.deleteTrainers(obj.trainerId).subscribe((res) => {
            if (res.success) {
              this.loadCompany();
            }
          });
        }
      });
    });




  }
}
