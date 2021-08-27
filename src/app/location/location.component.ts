import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from '../common/auth-guard.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from './location.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationBoxComponent } from '../theme/components/confirmation-box/confirmation-box.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public _globals: Globals, public router: Router, public dialog: MatDialog, public _service: LocationService, private translate: TranslateService) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.loadLocations();
  }
  addLocation() {
    var path = '';
    if (this._globals.getUserType() === '1') {
      path = 'superadmin/location/add';
    } else if (this._globals.getUserType() === '2') {
      path = 'admin/location/add';
    }
    this.router.navigate([path], { skipLocationChange: false });
  }
  editLocation(obj) {
    var path = '';
    if (this._globals.getUserType() === '1') {
      path = 'superadmin/location/edit';
    } else if (this._globals.getUserType() === '2') {
      path = 'admin/location/edit';
    }
    this.router.navigate([path, obj.locationId], { skipLocationChange: false });
  }
  loadLocations() {
    this._service.get().subscribe((res) => {
      if (res.success) {
        this.dataSource = new MatTableDataSource(res.data);
        this.displayedColumns = ['locationId', 'locationName', 'actions'];
        this.dataSource.paginator = this.paginator;
      } else {
      }
    });
  }

  deleteLocation(obj) {
    this.translate.get('dialog.DeletePosSure').subscribe(
      value => {
        const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
          width: '400px',
          data: { companyId: obj.locationId, Action: false, Mes: value },
          autoFocus: false
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this._service.delete(obj.locationId).subscribe((res) => {
              if (res.success) {
                this.loadLocations();
              }
            });
          }
        });
      }
    );
  }

  ngOnInit() {
  }

}
