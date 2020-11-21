import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Globals } from '../common/auth-guard.service';
import { GroupsService } from './groups.service';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ConfirmationBoxComponent } from '../theme/components/confirmation-box/confirmation-box.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class GroupsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['status', 'color', 'name', 'sumMember', 'sumCourses', 'editDelete'];
  isExtendedRow = (index, item) => item.extend;

  bLoading = true;

  bCategoryView = undefined;

  groupList: any;
  categoryList: any;
  bGroupEntriesFound = true;
  breakTiles = undefined;

  bShowCategories = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public globals: Globals, private spinner: NgxSpinnerService, private service: GroupsService, private translate: TranslateService,
    public router: Router, public dialog: MatDialog, private snackbar: MatSnackBar) {

    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;

    if (localStorage.getItem('bCategoryView') === null) {
      localStorage.setItem('bCategoryView', 'false');
    }
    this.bCategoryView = localStorage.getItem('bCategoryView') == 'true';

    this.groupList = new MatTableDataSource();

    var obj = this;
    this.groupList.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.name, filter);
    }

    this.spinner.hide();
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

  ngOnInit() {
    this.breakTiles = Math.round(window.innerWidth / 500);
    this.loadData();
  }

  ngAfterViewInit() {
    this.groupList.paginator = this.paginator;
    this.groupList.sort = this.sort;
  }

  loadData() {
    var obj = this;
    this.service.getGroupCategories().subscribe((data) => {
      //console.log(data);
      if (data) {
        if (data.success && data.data && data.data.length > 0) {
          this.categoryList = data.data;
        } else {
          this.categoryList = [];
        }
        this.groupList.data = [];
        obj.service.getGroups().subscribe((data) => {
          //console.log(data);
          if (data) {
            if (data.success && data.data && data.data.length > 0) {
              this.groupList.data = data.data;
              //this.groupList.paginator = this.paginator;
              this.bGroupEntriesFound = true;
            } else {
              var text = [
                { name: this.translate.instant('group.NoGroupFound'), extend: true }
              ];
              this.groupList.data = text;
              this.bGroupEntriesFound = false;
            }
            this.bLoading = false;
          }
        });
      }
    });
  }

  applyGroupFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.groupList.filter = filterValue;

    if (this.groupList.paginator) {
      this.groupList.paginator.firstPage();
    }
  }

  toggleView() {
    this.bCategoryView = !this.bCategoryView;
    if (localStorage.getItem('bCategoryView') == 'true') {
      localStorage.setItem('bCategoryView', 'false');
    } else {
      localStorage.setItem('bCategoryView', 'true');
    }
  }

  addGroup() {
    var userType = this.globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/groups/add'], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/groups/add'], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/groups/add'], { skipLocationChange: false });
    } else {
      console.error("ACCESS DENIED");
    }
  }

  viewGroup(group) {
    if (group.groupId) {
      this.spinner.show();
      var userType = this.globals.getUserType();
      if (userType == "1") {
        this.router.navigate(['./superadmin/groups', group.groupId], { skipLocationChange: false });
      } else if (userType == "2") {
        this.router.navigate(['./admin/groups', group.groupId], { skipLocationChange: false });
      } else if (userType == "3") {
        this.router.navigate(['./trainer/groups', group.groupId], { skipLocationChange: false });
      } else {
        this.router.navigate(['./employee/groups', group.groupId], { skipLocationChange: false });
      }
    }
  }

  editGroup(group) {
    this.spinner.show();
    var userType = this.globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/groups/edit', group.groupId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/groups/edit', group.groupId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/groups/edit', group.groupId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./employee/groups/edit', group.groupId], { skipLocationChange: false });
    }
  }

  deleteGroup(group) {
    if (!this.globals.userInfo.isAdmin) {
      return;
    }

    var strHead = this.translate.instant('dialog.DeleteGroup');
    var strMessage = this.translate.instant('dialog.DelGroupSure', { name: group.name });

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this.globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner.show();

        this.service.deleteUserGroup(group.groupId).subscribe(data => {
          if (data.success) {
            this.bLoading = true;
            this.spinner.hide();
            this.snackbar.open(this.translate.instant('dialog.DelGroupSuccess'), '', { duration: 3000 });
            this.loadData();
          } else {
            this.spinner.hide();
            alert("Unknown error");
          }
        }, err => {
          this.spinner.hide();
          alert("Unknown error");
          // TODO: handle error
          console.error(err);
        });
      }
    });
  }

  openCategory(category) {
    //console.log(category);
  }

  onResizeTiles(event) {
    this.breakTiles = Math.round(event.target.innerWidth / 500);
  }
}


// class GroupDataSource implements DataSource<any> {

//   data = new BehaviorSubject<any>([]);

//   constructor(initial: any[]) {
//     this.data.next(initial);
//   }

//   /** Simple stream */
//   connect() {
//     return this.data;
//   }

//   /** Noop */
//   disconnect() { }
// }