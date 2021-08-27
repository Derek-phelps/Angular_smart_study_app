import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit, Input, Output, EventEmitter, Inject, ViewContainerRef, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GroupsService } from '../../groups.service';
import { Globals } from '../../../common/auth-guard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

import { hexToRgbaString } from '../../../helper-functions';

import { ConfirmationBoxComponent } from '../../../theme/components/confirmation-box/confirmation-box.component';
import moment from 'moment';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ]),
    trigger('openedChanged', [
      state('shown', style({ opacity: 1, height: '*' })),
      state('hidden', style({ opacity: 0, height: 0 })),
      transition('* => *', animate(200))
    ])
  ]
})
export class ViewGroupComponent implements OnInit, AfterViewInit {
  public memberSingleFilterCtrl: FormControl = new FormControl();
  public filteredMemberSingle: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  // public memberSingleFilterCtrlRec: FormControl = new FormControl();
  // public filteredLeaderMultiRec: ReplaySubject<[]> = new ReplaySubject<[]>(1);

  isDarkenedRow = (index, item) => (item.active == -1 || item.effective == false);

  allowEdit = false;

  groupChartLabels: Label[] = [];
  groupChartColors = [];
  groupChartData: MultiDataSet = [];

  statusList = [];
  currentListStatus = undefined;

  displayedColumns: string[];
  //displayedColumnsPermissions: string[] = ['FIRSTNAME', 'view', 'admin'];
  displayedColumnsAssignments: string[];
  selection = new SelectionModel(true, []);
  selectionView = new SelectionModel(true, []);
  selectionAdmin = new SelectionModel(true, []);

  numberOverdue = 0;
  numberCurrent = 0;
  numberDone = 0;

  //private groupForm: FormGroup;
  groupInfo: any = {};

  memberList: any;
  permissionList: any;
  activeMemberList: any;
  bUserListLoaded = false;

  courseAssignmentList: any;
  bUpdatingCourseAssignments = true;

  categoryList: any;
  bCategoryListLoaded = false;

  bShowCategories = false;

  saveSuccessfullyFinished = 0;

  groupId = undefined;
  departmentId = undefined;
  bGroupDataLoaded = false;

  isAdmin = false;

  bUpdatingGroupMember = true;

  userToAdd: any = undefined;

  addMemberOpenState = false;
  showMemberOpenState = true;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  @Input() updateGroup: Observable<Number>;
  @Input() isDepartment: boolean = false;

  @Output() onUpdateDepartmentStatus = new EventEmitter();

  constructor(private route: ActivatedRoute, private spinner: NgxSpinnerService, protected service: GroupsService, private formBuilder: FormBuilder,
    private translate: TranslateService, public _globals: Globals, private _location: Location, private snackbar: MatSnackBar, public router: Router,
    public dialog: MatDialog) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    // Init group chart
    this.setChartColors();

    this.isAdmin = Number(this._globals.userInfo.UserType) <= 2;
    this.allowEdit = this.isAdmin;

    this.groupInfo.name = "";

    this.memberList = new MatTableDataSource();
    this.permissionList = new MatTableDataSource();
    this.activeMemberList = new MatTableDataSource();

    this.courseAssignmentList = new MatTableDataSource();

    this.groupChartLabels = [this.translate.instant('course.Done'), this.translate.instant('course.Open'), this.translate.instant('course.Overdue')];
    var obj = this;
    this.translate.onTranslationChange.subscribe(() => {
      this.groupChartLabels = [obj.translate.instant('course.Done'), obj.translate.instant('course.Open'), obj.translate.instant('course.Overdue')];
    });

    this.spinner.hide();
  }

  setChartColors() {
    var opacity = 0.8;
    var style = getComputedStyle(document.body);
    var strDanger = hexToRgbaString(style.getPropertyValue('--myDanger'), opacity);
    var strWarning = hexToRgbaString(style.getPropertyValue('--myWarning'), opacity);
    var strSuccess = hexToRgbaString(style.getPropertyValue('--mySuccess'), opacity);
    var colorObject = { backgroundColor: [strSuccess, strWarning, strDanger] };
    this.groupChartColors = [colorObject, colorObject];
  }



  ngOnInit() {
    this.memberSingleFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMemberSingle();
      });

    // this.memberSingleFilterCtrlRec.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterLeaderMultiRec();
    //   });
    if (!this.isDepartment) {
      this.route.params.subscribe(params => {
        this.resetAll();
        if (params.id) {
          this.groupId = params.id;
          this.loadGroup();
          this.loadCategories();
          this.loadUserList();
        } else {
          this.bGroupDataLoaded = false;
        }
      });
    } else {
      this.updateGroup.subscribe(departmentId => {
        if (departmentId) {
          if (this.departmentId != departmentId) {
            this.resetAll();
            this.departmentId = departmentId;
          }
          this.loadGroup();
          this.loadCategories();
          this.loadUserList();
        } else {
          this.resetAll();
          this.bGroupDataLoaded = false;
        }
      });
    }
  }

  protected filterMemberSingle() {
    if (!this.memberList.data) {
      return;
    }
    // get the search keyword
    let search = this.memberSingleFilterCtrl.value;
    if (!search) {
      // this.filteredMemberSingle.next(this.memberList.data.slice());
      // return;
      search = "";
    } else {
      search = search.toLowerCase();
    }
    // filter the leaders
    var obj = this;
    this.filteredMemberSingle.next(
      this.memberList.data.filter(user => !obj.selection.isSelected(user.UserId) && (user.FIRSTNAME.toLowerCase().indexOf(search) > -1 || user.LASTNAME.toLowerCase().indexOf(search) > -1 || user.FULLNAME.toLowerCase().indexOf(search) > -1))
    );
  }
  // protected filterLeaderMultiRec() {
  //   if (!this.memberList.data) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.memberSingleFilterCtrlRec.value;
  //   if (!search) {
  //     this.filteredLeaderMultiRec.next(this.memberList.data.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the leaders
  //   this.filteredLeaderMultiRec.next(
  //     this.memberList.data.filter(user => (user.FIRSTNAME.toLowerCase().indexOf(search) > -1 || user.LASTNAME.toLowerCase().indexOf(search) > -1 || user.FULLNAME.toLowerCase().indexOf(search) > -1))
  //   );
  // }

  resetAll() {
    this.groupId = undefined;
    this.departmentId = undefined;
    this.bGroupDataLoaded = false;
    this.bUpdatingCourseAssignments = true;
    this.bUserListLoaded = false;
    this.bCategoryListLoaded = false;
    this.bUpdatingGroupMember = true;
    this.allowEdit = false;
  }

  ngAfterViewInit() {
    // const factory = this.r.resolveComponentFactory(DialogListStatusDialog);
    // this.groupContainer.createComponent(factory);

    this.activeMemberList.paginator = this.paginator.toArray()[0];
    this.activeMemberList.sort = this.sort.toArray()[0];

    this.courseAssignmentList.paginator = this.paginator.toArray()[1];
    this.courseAssignmentList.sort = this.sort.toArray()[1];

    this.courseAssignmentList.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'nextEvent': {
          if (item.nextEvent) {
            return item.sortNextEvent;
          } else {
            return "z";
          }
          // if (item.nextEventStart && item.nextEventEnd) {
          //   //console.log(item);
          //   return item.nextEventStart.format('YYYYMMDD') + item.nextEventEnd.format('YYYYMMDD');
          // } else {
          //   return "z";
          // }
        }
        case 'recurrence': {
          if (item.repeatSpan) {
            return Number(item.repeatSpan) * (item.repeatUnit == 'year' ? 12 : 1);
          } else {
            return "z"
          }
        }
        default: {
          //console.log("here3");
          return item[property];
        }
      }
    };

    // this.permissionList.paginator = this.paginator.toArray()[1];
    // this.permissionList.sort = this.sort.toArray()[1];

    var obj = this;
    this.activeMemberList.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter);
    }
    // this.permissionList.filterPredicate = function (data: any, filter: string): boolean {
    //   return obj.filterFunction(data.FIRSTNAME, filter);
    // };
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
    return bMatch;
  }

  loadGroup(updateParent = false) {
    if (!this.groupId && !this.departmentId) {
      return;
    }

    if (this.isDepartment) {
      this.groupId = undefined;
      if (updateParent) {
        this.onUpdateDepartmentStatus.emit();
      }
    }

    //this.bUpdatingGroupMember = true;
    //this.bGroupDataLoaded = false;
    this.service.getGroup(this.groupId, this.departmentId, true).subscribe(data => {
      if (data.success) {
        //this.groupForm.setValue(data.groupData);
        this.groupId = data.groupData.id;
        this.groupInfo = data.groupData;

        //this.memberList.data = data.memberList;
        this.activeMemberList.data = data.memberList;
        this.bUpdatingGroupMember = false;

        this.allowEdit = (data.permission == 2);
        if (this.allowEdit) {
          this.displayedColumns = ['status', 'LASTNAME', 'FIRSTNAME', 'delete'];
          this.displayedColumnsAssignments = ['courseName', 'firstEvent', 'nextEvent', 'recurrence', 'endDate', 'status', 'editDelete']
        } else {
          this.displayedColumns = ['status', 'LASTNAME', 'FIRSTNAME'];
          this.displayedColumnsAssignments = ['courseName', 'firstEvent', 'nextEvent', 'recurrence', 'endDate', 'status'];
        }

        //console.log(this.courseAssignmentList.data);

        //calculateAndAddEventDates(this.courseAssignmentList.data, this.translate);

        this.selection.clear();
        data.memberList.forEach(member => {
          this.selection.select(member.userId);
        });

        this.filterMemberSingle();

        //console.warn(this.selection);

        this.selectionView.clear();
        this.selectionAdmin.clear();

        data.permissionList.forEach(permission => {
          if (Number(permission.permission)) {
            if (Number(permission.permission) == 1) {
              this.selectionView.select(permission);
            } else if (Number(permission.permission) == 2) {
              this.selectionAdmin.select(permission);
            }
          }
        });

        data.courseAssignmentList.forEach(courseAss => {
          courseAss.hasStatus = false;
          courseAss.completed = [];
          courseAss.open = [];
          courseAss.overdue = [];
        });

        this.numberOverdue = 0;
        this.numberCurrent = 0;
        this.numberDone = 0;

        var globalOverdue = 0;
        var globalCurrent = 0;
        var globalDone = 0;

        data.memberList.forEach(member => {
          if (member.groupStatus == -1) {
            this.numberOverdue = this.numberOverdue + 1;
          } else if (member.groupStatus == 0) {
            this.numberCurrent = this.numberCurrent + 1;
          } else {
            this.numberDone = this.numberDone + 1;
          }

          if (member.globalStatus == -1) {
            globalOverdue = globalOverdue + 1;
          } else if (member.globalStatus == 0) {
            globalCurrent = globalCurrent + 1;
          } else {
            globalDone = globalDone + 1;
          }

          member.fullAssStatus.forEach(courseInfo => {
            courseInfo.fixedDates.forEach(fixedDateMember => {
              data.courseAssignmentList.forEach(courseAss => {
                if (courseAss.courseAssId == fixedDateMember.courseAssId) {
                  courseAss.hasStatus = true;
                  if (fixedDateMember.completed == 1) {
                    courseAss.completed.push(member);
                  } else if (fixedDateMember.completed == 0) {
                    courseAss.open.push(member);
                  } else {
                    courseAss.overdue.push(member);
                  }
                }
              });
            });
            courseInfo.effectiveSeries.forEach(seriesMember => {
              data.courseAssignmentList.forEach(courseAss => {
                if (courseAss.courseAssId == seriesMember.courseAssId) {
                  courseAss.hasStatus = true;
                  if (seriesMember.completed == 1) {
                    courseAss.completed.push(member);
                  } else if (seriesMember.completed == 0) {
                    courseAss.open.push(member);
                  } else {
                    courseAss.overdue.push(member);
                  }
                }
              });
            });
          });
        });

        data.courseAssignmentList.forEach(assignment => {
          if (Number(assignment.isSeries) == 1) {
            assignment.effective = false;
            data.effectiveCourseAssignments.forEach(effectiveAssignment => {
              if (effectiveAssignment == assignment.courseAssId) {
                assignment.effective = true;
              }
            });
          } else {
            assignment.effective = true;
          }
        });

        this.courseAssignmentList.data = data.courseAssignmentList;

        this.bGroupDataLoaded = true;
        this.bUpdatingCourseAssignments = false;

        var obj = this;
        setTimeout(() => {
          obj.groupChartData = [[obj.numberDone, obj.numberCurrent, obj.numberOverdue], [globalDone, globalCurrent, globalOverdue]];
        }, 1000);
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
        this.filterMemberSingle();
        this.permissionList.data = data.data;
        //console.warn(this.permissionList.data);
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

  deleteUserFromGroup(user) {
    var strHead = this.translate.instant('dialog.DeleteGroupAss');
    var strMessage = this.translate.instant('dialog.DeleteEmpGroupSure1') + " <b>" + user.FULLNAME + "</b> " +
      this.translate.instant('dialog.DeleteEmpGroupSure2');

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this._globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bUpdatingGroupMember = true;
        this.service.deleteUserFromGroup(user.userId, this.groupId).subscribe(data => {
          if (data.success) {
            this.snackbar.open(this.translate.instant('employees.RemoveSuccess'), '', { duration: 3000 });
            this.loadGroup(true);
          }
        }, err => {
          // TODO: Handle error!
          console.error("Not deleted!!");
          console.error(err);
        });
      }
    });
  }

  addGroupMember() {
    this.bUpdatingGroupMember = true;
    this.service.addUserToGroup(this.userToAdd, this.groupId).subscribe(data => {
      if (data.success) {
        this.userToAdd = undefined;
        this.snackbar.open(this.translate.instant('employees.AddedSuccess'), '', { duration: 3000 });
        this.loadGroup(true);
      }
    }, err => {
      // TODO: Handle error!
      console.error(err);
    });
  }

  addCourse() {
    this.spinner.show();
    var userType = this._globals.getUserType();
    if (this.isDepartment) {
      if (userType == "1") {
        this.router.navigate(['./superadmin/department', this.departmentId, 'assigncourse'], { skipLocationChange: false });
      } else if (userType == "2") {
        this.router.navigate(['./admin/department', this.departmentId, 'assigncourse'], { skipLocationChange: false });
      } else if (userType == "3") {
        this.router.navigate(['./employee/department', this.departmentId, 'assigncourse'], { skipLocationChange: false });
      } else {
        this.router.navigate(['./employee/department', this.departmentId, 'assigncourse'], { skipLocationChange: false });
      }
    } else {
      if (userType == "1") {
        this.router.navigate(['./superadmin/groups', this.groupId, 'assigncourse'], { skipLocationChange: false });
      } else if (userType == "2") {
        this.router.navigate(['./admin/groups', this.groupId, 'assigncourse'], { skipLocationChange: false });
      } else if (userType == "3") {
        this.router.navigate(['./employee/groups', this.groupId, 'assigncourse'], { skipLocationChange: false });
      } else {
        this.router.navigate(['./employee/groups', this.groupId, 'assigncourse'], { skipLocationChange: false });
      }
    }
  }

  openEditView() {
    this.spinner.show();
    var userType = this._globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/groups/edit', this.groupId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/groups/edit', this.groupId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/groups/edit', this.groupId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./employee/groups/edit', this.groupId], { skipLocationChange: false });
    }
  }

  deleteAssignment(ass) {
    var strHead = this.translate.instant('assignment.DeleteCourseAssQ');
    var strMessage = this.translate.instant('assignment.DeleteCourseAssFull', { course: ass.courseName });

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this._globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bUpdatingCourseAssignments = true;
        this.service.deleteCourseAssignment(ass.courseAssId).subscribe(data => {
          if (data.success) {
            this.loadGroup(true);
          }
        }, err => {
          // TODO: Handle error!
          console.error("Not deleted!!");
          console.error(err);
        });
      }
    });
  }

  editAssignment(ass) {
    //console.log(ass);
    this.spinner.show();
    var userType = this._globals.getUserType();
    if (this.isDepartment) {
      if (userType == "1") {
        this.router.navigate(['./superadmin/department', this.departmentId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
      } else if (userType == "2") {
        this.router.navigate(['./admin/department', this.departmentId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
      } else if (userType == "3") {
        this.router.navigate(['./trainer/department', this.departmentId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
      } else {
        this.router.navigate(['./trainer/department', this.departmentId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
      }
    } else {
      if (userType == "1") {
        this.router.navigate(['./superadmin/groups', this.groupId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
      } else if (userType == "2") {
        this.router.navigate(['./admin/groups', this.groupId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
      } else if (userType == "3") {
        this.router.navigate(['./trainer/groups', this.groupId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
      } else {
        this.router.navigate(['./trainer/groups', this.groupId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
      }
    }
  }

  checkIfUploadFinished() {
    this.saveSuccessfullyFinished = this.saveSuccessfullyFinished + 1;
    if (this.saveSuccessfullyFinished == 2) {
      if (this.groupId) {
        this.snackbar.open(this.translate.instant('group.EditSuccess'), '', { duration: 3000 });
        this._location.back();
      } else {
        this.snackbar.open(this.translate.instant('group.AddSuccess'), '', { duration: 3000 });
        this._location.back();
      }
    }
  }

  cancel() {
    this._location.back();
  }

  deleteGroup() {
    var strHead = this.translate.instant('dialog.DeleteGroup');
    var strMessage = this.translate.instant('dialog.DelGroupSure', { name: this.groupInfo.name });

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this._globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner.show();

        this.service.deleteUserGroup(this.groupId).subscribe(data => {
          if (data.success) {
            var userType = this._globals.getUserType();
            this.snackbar.open(this.translate.instant('dialog.DelGroupSuccess'), '', { duration: 3000 });
            if (userType == "1") {
              this.router.navigate(['./superadmin/groups'], { skipLocationChange: false });
            } else if (userType == "2") {
              this.router.navigate(['./admin/groups'], { skipLocationChange: false });
            } else if (userType == "3") {
              this.router.navigate(['./trainer/groups'], { skipLocationChange: false });
            } else {
              this.router.navigate(['./trainer/groups'], { skipLocationChange: false });
            }
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
      this.selectionAdmin.deselect(row.UserId);
    }
    this.selectionView.toggle(row.UserId);
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
      this.selectionView.deselect(row.UserId);
    }
    this.selectionAdmin.toggle(row.UserId);
  }

  applyFilterGroupMember(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.memberList.filter = filterValue;

    if (this.memberList.paginator) {
      this.memberList.paginator.firstPage();
    }
  }

  applyFilterActiveGroupMember(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.activeMemberList.filter = filterValue;

    if (this.activeMemberList.paginator) {
      this.activeMemberList.paginator.firstPage();
    }
  }

  applyFilterPermissions(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.permissionList.filter = filterValue;

    if (this.permissionList.paginator) {
      this.permissionList.paginator.firstPage();
    }
  }

  openEmpView(userId) {
    var empId = undefined;
    // console.log(this.memberList.data);
    this.memberList.data.forEach(emp => {
      if (emp.UserId == userId) {
        empId = emp.empId;
      }
    });
    var userType = this._globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/employees', empId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/employees', empId], { skipLocationChange: false });
    } else if (userType == "3") {
      //this.router.navigate(['./trainer/employees', empId], { skipLocationChange: false });
    } else {
      //this.router.navigate(['./trainer/employees', empId], { skipLocationChange: false });
    }
    // routerLink="../../employees/{{viewUser.userId}}"
  }

  viewCourse(course) {
    var userType = this._globals.getUserType();
    if (userType == "1") {
      this.spinner.show();
      this.router.navigate(['./superadmin/course/view', course.courseId, 0], { skipLocationChange: false });
    } else if (userType == "2") {
      this.spinner.show();
      this.router.navigate(['./admin/course/view', course.courseId, 0], { skipLocationChange: false });
    } else if (userType == "3") {
      //this.router.navigate(['./trainer/course/view', course.courseId, 0], { skipLocationChange: false });
    } else {
      //this.router.navigate(['./trainer/course/view', course.courseId, 0], { skipLocationChange: false });
    }
  }

  setStatusList(list, currentStatus) {
    this.statusList = list;
    this.currentListStatus = currentStatus;
  }
}