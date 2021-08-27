import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GroupsService } from '../../groups.service';
import { Globals } from '../../../common/auth-guard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-modify-group',
  templateUrl: './modify-group.component.html',
  styleUrls: ['./modify-group.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class ModifyGroupComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'LASTNAME', 'FIRSTNAME'];
  displayedColumnsPermissions: string[] = ['LASTNAME', 'FIRSTNAME', 'view', 'admin'];
  selection = new SelectionModel(true, []);
  selectionView = new SelectionModel(true, []);
  selectionAdmin = new SelectionModel(true, []);

  groupForm: FormGroup;

  memberList: any;
  permissionList: any;
  bUserListLoaded = false;

  categoryList: any;
  bCategoryListLoaded = false;

  bShowCategories = false;

  saveSuccessfullyFinished = 0;

  groupId = undefined;
  bGroupDataLoaded = false;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  constructor(private route: ActivatedRoute, private spinner: NgxSpinnerService, protected service: GroupsService, private formBuilder: FormBuilder,
    private translate: TranslateService, public _globals: Globals, private _location: Location, private snackbar: MatSnackBar, public router: Router) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.route.params.subscribe(params => {
      if (params.id != undefined) {
        this.groupId = params.id;
      }
    });

    this.memberList = new MatTableDataSource();
    this.permissionList = new MatTableDataSource();

    this.setDefaultFormValues();

    this.spinner.hide();
  }

  ngOnInit() {
    if (this.groupId != undefined) {
      this.loadGroup();
    } else {
      this.bGroupDataLoaded = true;
    }

    this.loadCategories();
    this.loadUserList();
  }

  ngAfterViewInit() {
    this.memberList.paginator = this.paginator.toArray()[0];
    this.memberList.sort = this.sort.toArray()[0];

    this.permissionList.paginator = this.paginator.toArray()[1];
    this.permissionList.sort = this.sort.toArray()[1];

    var obj = this;
    this.memberList.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter);
    }
    this.permissionList.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter);
    };
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

  setDefaultFormValues() {
    var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    this.groupForm = this.formBuilder.group({
      id: [this.groupId],
      name: ['', Validators.required],
      color: [randomColor, Validators.required],
      categories: [[]]
    });
  }

  loadGroup() {
    if (!this.groupId) {
      return;
    }

    this.bGroupDataLoaded = false;
    this.service.getGroup(this.groupId, undefined).subscribe(data => {
      if (data.success) {
        this.groupForm.setValue(data.groupData);

        data.memberList.forEach(member => {
          this.selection.select(member.userId);
        });

        data.permissionList.forEach(permission => {
          if (Number(permission.permission)) {
            if (Number(permission.permission) == 1) {
              this.selectionView.select(permission.userId);
            } else if (Number(permission.permission) == 2) {
              this.selectionAdmin.select(permission.userId);
            }
          }
        });

        this.bGroupDataLoaded = true;
      }
    }, err => {
      // TODO: Handle error!!
      console.error("Not loaded!!");
      console.error(err);
    });
  }

  loadUserList() {
    this.bUserListLoaded = false;
    this.service.getUserList(this._globals.companyInfo.companyId).subscribe(data => {
      if (data.success) {
        this.memberList.data = data.data;
        this.permissionList.data = data.data;
      } else {
        this.memberList.data = [];
        this.permissionList.data = [];
      }
      this.bUserListLoaded = true;
    }, err => {
      // TODO: Handle error!!
      console.error("Not loaded!!");
      console.error(err);
    });
  }

  loadCategories() {
    this.bCategoryListLoaded = false;
    this.service.getGroupCategories().subscribe(data => {
      if (data.success && data.data && data.data.length > 0) {
        this.categoryList = data.data;
      } else {
        this.categoryList = [];
      }
      this.bCategoryListLoaded = true;
    }, err => {
      // TODO: Handle error!
      console.error("Not loaded!!");
      console.error(err);
    });
  }

  saveGroup() {
    this.spinner.show();
    if (this.groupId) {
      this.service.updateGroup(this.groupForm.value).subscribe(data => {
        if (data.success) {
          this.updateMemberAndRights(this.groupId);
        }
      }, err => {
        // TODO: Handle error!
        console.error("Not updated!!");
        console.error(err);
      });
    } else {
      this.service.addGroup(this.groupForm.value).subscribe(data => {
        if (data.success && data.groupId) {
          this.updateMemberAndRights(data.groupId);
        } else {
          // TODO: Handle error!
        }
      }, err => {
        // TODO: Handle error!
        console.error("Not loaded!!");
        console.error(err);
      });
    }
  }

  updateMemberAndRights(groupId) {
    // if (this.selection.selected.length > 0) {
    this.service.updateGroupMember(groupId, this.selection.selected).subscribe(data => {
      if (data.success) {
        this.checkIfUploadFinished(groupId);
      } else {
        // TODO: Handle error!
      }
    }, err => {
      // TODO: Handle error!
      console.error("Not loaded!!");
      console.error(err);
    });
    // } else {
    //   this.checkIfUploadFinished();
    // }
    // if (this.selectionView.selected.length > 0 || this.selectionAdmin.selected.length > 0) {
    this.service.updateGroupRights(groupId, this.selectionView.selected, this.selectionAdmin.selected).subscribe(data => {
      if (data.success) {
        this.checkIfUploadFinished(groupId);
        // TODO: Open new group view...
      } else {
        // TODO: Handle error!
      }
    }, err => {
      // TODO: Handle error!
      console.error("Not loaded!!");
      console.error(err);
    });
    // } else {
    //   this.checkIfUploadFinished();
    // }
  }

  checkIfUploadFinished(groupId) {
    this.saveSuccessfullyFinished = this.saveSuccessfullyFinished + 1;
    if (this.saveSuccessfullyFinished == 2) {
      this.spinner.show();
      if (this.groupId) {
        this.snackbar.open(this.translate.instant('group.EditSuccess'), '', { duration: 3000 });
        this._location.back();
      } else {
        this.snackbar.open(this.translate.instant('group.AddSuccess'), '', { duration: 3000 });
        //this._location.back();
        var userType = this._globals.getUserType();
        if (userType == "1") {
          this.router.navigate(['./superadmin/groups', groupId], { skipLocationChange: false });
        } else if (userType == "2") {
          this.router.navigate(['./admin/groups', groupId], { skipLocationChange: false });
        } else if (userType == "3") {
          // this.router.navigate(['./employee/department', data.departmentId], { skipLocationChange: false });
        } else {
          // this.router.navigate(['./employee/department', data.departmentId], { skipLocationChange: false });
        }
      }
    }
  }

  cancel() {
    this._location.back();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.memberList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.memberList.data.forEach(row => this.selection.select(row.UserId));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedView() {
    const numSelected = this.selectionView.selected.length;
    const numRows = this.permissionList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleView() {
    this.selectionAdmin.clear();
    this.isAllSelectedView() ?
      this.selectionView.clear() :
      this.permissionList.data.forEach(row => this.selectionView.select(row.UserId));
  }

  toggleView(event, row) {
    if (event.checked) {
      this.selectionAdmin.deselect(row);
    }
    this.selectionView.toggle(row);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedAdmin() {
    const numSelected = this.selectionAdmin.selected.length;
    const numRows = this.permissionList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleAdmin() {
    this.selectionView.clear();
    this.isAllSelectedAdmin() ?
      this.selectionAdmin.clear() :
      this.permissionList.data.forEach(row => this.selectionAdmin.select(row.UserId));
  }

  toggleAdmin(event, row) {
    if (event.checked) {
      this.selectionView.deselect(row);
    }
    this.selectionAdmin.toggle(row);
  }

  applyFilterGroupMember(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.memberList.filter = filterValue;

    if (this.memberList.paginator) {
      this.memberList.paginator.firstPage();
    }
  }

  applyFilterPermissions(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.permissionList.filter = filterValue;

    if (this.permissionList.paginator) {
      this.permissionList.paginator.firstPage();
    }
  }
}
