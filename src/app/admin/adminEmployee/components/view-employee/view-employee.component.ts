import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit, Inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminEmployeeService } from '../../adminEmployee.service';
import { Globals } from '../../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SelectionModel } from '@angular/cdk/collections';

import { ConfirmationBoxComponent } from '../../../../theme/components/confirmation-box/confirmation-box.component';
import { DialogForwardUserDialog } from '../../../../forward-user/dialog-forward-user-dialog';
//import { extractEffectiveCourseAssignments, calculateAndAddEventDates } from '../../../../helper-functions';
// import moment from 'moment';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { take } from 'rxjs/operators';

export interface DialogData {
  empId: number;
  name: string;
}

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class ViewEmployeeComponent implements OnInit, AfterViewInit {
  isDarkenedRow = (index, item) => ((item.active == -1 && item.completed == 1) || !item.effective);

  //private bLoading = true;

  empId = undefined;
  empInfo: any = undefined;
  bEmpDataLoaded = false;

  bGroupListLoaded = false;

  bUpdatingMemberStatus = true;
  bUpdatingCourseAssignmentList = true;

  numberOverdue = 0;
  numberCurrent = 0;

  selectionView = new SelectionModel(true, []);
  selectionAdmin = new SelectionModel(true, []);
  selectionDepAdmin = new SelectionModel(true, []);

  courseAssignmentList: any;
  displayedColumnsAssignments: string[] = ['status', 'courseName', 'lastFinished', 'firstEvent', 'nextEvent', 'recurrence', 'assignedBy', 'editDelete'];

  selection = [];
  depGroupActiveLists = [];
  depGroupOpenStates = [];
  depGroupAddOpenState = [];
  depGroupDisplayedColumns = [];
  depGroupToAdd = [];

  indexer = [0, 1];

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  constructor(private route: ActivatedRoute, private spinner: NgxSpinnerService, protected service: AdminEmployeeService, private formBuilder: FormBuilder,
    private translate: TranslateService, public _globals: Globals, /*private _location: Location,*/ private snackbar: MatSnackBar, public router: Router,
    public dialog: MatDialog) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.route.params.subscribe(params => {
      if (params.id) {
        this.empId = params.id;
      }
    });

    //this.bLoading = false;

    this.selection.push(new SelectionModel(true, []));
    this.selection.push(new SelectionModel(true, []));

    this.depGroupActiveLists.push(new MatTableDataSource());
    this.depGroupActiveLists.push(new MatTableDataSource());

    this.courseAssignmentList = new MatTableDataSource();

    this.depGroupOpenStates.push(false);
    this.depGroupOpenStates.push(false);

    this.depGroupAddOpenState.push(false);
    this.depGroupAddOpenState.push(false);

    var departmentColumns = ['status', 'departmentName', 'delete'];
    var groupColumns = ['status', 'name', 'delete'];
    this.depGroupDisplayedColumns.push(departmentColumns);
    this.depGroupDisplayedColumns.push(groupColumns);

    this.depGroupToAdd.push(undefined);
    this.depGroupToAdd.push(undefined);

    this.spinner.hide();
  }

  ngOnInit() {
    if (this.empId != undefined) {
      this.loadEmployee();
    } else {
      this.bEmpDataLoaded = false;
    }

    // TODO: load group list
    this.bGroupListLoaded = true;
  }

  ngAfterViewInit() {
    // TODO: Set paginators, sorts and sorting data accessor and maybe filter function
    this.depGroupActiveLists[0].paginator = this.paginator.toArray()[0];
    this.depGroupActiveLists[0].sort = this.sort.toArray()[0];

    this.depGroupActiveLists[1].paginator = this.paginator.toArray()[1];
    this.depGroupActiveLists[1].sort = this.sort.toArray()[1];

    var obj = this;
    this.depGroupActiveLists[0].filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.departmentName, filter);
    }
    this.depGroupActiveLists[1].filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.name, filter);
    }

    this.courseAssignmentList.paginator = this.paginator.toArray()[2];
    this.courseAssignmentList.sort = this.sort.toArray()[2];
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

  applyFilterActiveDepGroup(event: Event, i) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.depGroupActiveLists[i].filter = filterValue;

    if (this.depGroupActiveLists[i].paginator) {
      this.depGroupActiveLists[i].paginator.firstPage();
    }
  }

  loadEmployee() {
    if (!this.empId) {
      return;
    }

    this.numberCurrent = 0;
    this.numberOverdue = 0;

    this.service.getById(this.empId, true, true).subscribe(data => {
      if (data.success) {
        this.empInfo = data.data;
        //console.log(this.empInfo);
        this.depGroupActiveLists[0].data = data.data.departmentIds;
        this.depGroupActiveLists[1].data = data.data.groupIds;
        this.bUpdatingMemberStatus = false;

        this.selection[0].clear();
        this.selection[1].clear();

        this.empInfo.departmentIds.forEach(dep => {
          this.selection[0].select(dep.departmentId);
        });
        this.empInfo.groupIds.forEach(group => {
          this.selection[1].select(group.groupId);
        });

        this.selectionView.clear();
        this.selectionAdmin.clear();
        this.selectionDepAdmin.clear();

        this.empInfo.groupRights.forEach(permission => {
          if (Number(permission.permission)) {
            if (Number(permission.permission) == 1) {
              this.selectionView.select(permission);
            } else if (Number(permission.permission) == 2) {
              this.selectionAdmin.select(permission);
            }
          }
        });

        this.empInfo.departmentRights.forEach(permission => {
          if (Number(permission.permission)) {
            if (Number(permission.permission) == 1) {
              //this.selectionDepView.select(permission);
            } else if (Number(permission.permission) == 2) {
              this.selectionDepAdmin.select(permission);
            }
          }
        });

        // this.courseAssignmentList.data = data.data.courseAssignmentList;
        // calculateAndAddEventDates(this.courseAssignmentList.data, this.translate);

        //this.bEmpDataLoaded = true;
        this.service.loadEmpCourseData(this.empInfo.userId, this.empId).subscribe(data => {
          if (data.success) {
            data.courseAssignments = data.courseAssignments ? data.courseAssignments : [];
            //calculateAndAddEventDates(this.courseAssignmentList.data, this.translate);
            this.bUpdatingCourseAssignmentList = false;

            var courseLastFinishedMap = new Map();

            var effectiveCourseAssignments = data.effectiveCourseAssignments ? data.effectiveCourseAssignments : [];
            effectiveCourseAssignments.forEach(courseInfo => {
              courseLastFinishedMap.set(courseInfo.courseId, courseInfo.lastFinished);

              if (courseInfo.overallStatus == -1) {
                this.numberOverdue = this.numberOverdue + 1;
              } else if (courseInfo.overallStatus == 0) {
                this.numberCurrent = this.numberCurrent + 1;
              }
              courseInfo.effectiveSeries.forEach(series => {
                //this.effectiveAssignmentsInfoMap.set(series.courseAssId, series.completed);
                data.courseAssignments.forEach(courseAss => {
                  if (courseAss.courseAssId == series.courseAssId) {
                    courseAss.completed = series.completed;
                    courseAss.effective = true;

                    courseAss.nextEventStart = series.nextEventStart;
                    courseAss.nextEvent = series.nextEvent;
                    courseAss.sortNextEvent = series.sortNextEvent;
                    courseAss.currentlyActive = series.currentlyActive;
                  }
                });
              });
              courseInfo.fixedDates.forEach(fixedDate => {
                //this.effectiveAssignmentsInfoMap.set(fixedDate.courseAssId, fixedDate.completed);
                data.courseAssignments.forEach(courseAss => {
                  if (courseAss.courseAssId == fixedDate.courseAssId) {
                    courseAss.completed = fixedDate.completed;
                    courseAss.effective = true;

                    courseAss.nextEventStart = fixedDate.nextEventStart;
                    courseAss.nextEvent = fixedDate.nextEvent;
                    courseAss.sortNextEvent = fixedDate.sortNextEvent;
                    courseAss.currentlyActive = fixedDate.currentlyActive;
                  }
                });
              });
            });

            var effectiveCourseAssList = [];
            data.courseAssignments.forEach(courseAss => {
              courseAss.lastFinished = courseLastFinishedMap.get(courseAss.courseId);
              if (courseAss.effective || courseAss.userId) {
                effectiveCourseAssList.push(courseAss);
              }
            });

            this.courseAssignmentList.data = effectiveCourseAssList;

            this.bEmpDataLoaded = true;

            //console.log(this.courseAssignmentList.data);
          }
        }, err => {
          // TODO: Handle error
          console.log(err);
        });
      } else {
        this.bEmpDataLoaded = false;
      }
    }, err => {
      // TODO: handle error
      console.error(err);
    });
  }

  openEditView() {
    this.spinner.show();
    var userType = this._globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/employees/edit', this.empId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/employees/edit', this.empId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/employees/edit', this.empId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./trainer/employees/edit', this.empId], { skipLocationChange: false });
    }
  }

  addDepGroup(i) {
    var groupId = undefined;
    var departmentId = undefined;
    if (i == 0) {
      departmentId = this.depGroupToAdd[0];
    } else {
      groupId = this.depGroupToAdd[1];
    }
    if (!groupId && !departmentId) {
      return false;
    }

    this.bUpdatingMemberStatus = true;
    this.bUpdatingCourseAssignmentList = true;
    this.service.addUserGroupDep(this.empInfo.userId, groupId, departmentId).subscribe(data => {
      if (data.success) {
        this.depGroupToAdd[0] = undefined;
        this.depGroupToAdd[1] = undefined;
        this.snackbar.open(this.translate.instant('employees.AddedSuccess'), '', { duration: 3000 });
        this.loadEmployee();
      }
    }, err => {
      // TODO: Handle error
      console.error(err);
    });
  }

  deleteFromDepGroup(depGroup, i) {
    var bIsDep = i == 0;

    var groupId = undefined;
    var departmentId = undefined;
    if (bIsDep) {
      departmentId = depGroup.departmentId;
    } else {
      groupId = depGroup.groupId;
    }

    if (!groupId && !departmentId) {
      return false;
    }

    var strHead = bIsDep ? this.translate.instant('dialog.DeleteDepAss') : this.translate.instant('dialog.DeleteGroupAss');
    var strMessage = "";
    if (bIsDep) {
      strMessage = this.translate.instant('dialog.EmpDelDepSure', { name: this.empInfo.FULLNAME, depName: depGroup.departmentName });
    } else {
      strMessage = this.translate.instant('dialog.EmpDelGroupSure', { name: this.empInfo.FULLNAME, groupName: depGroup.name });
    }

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this._globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bUpdatingMemberStatus = true;
        this.service.deleteUserGroupDep(this.empInfo.userId, groupId, departmentId).subscribe(data => {
          if (data.success) {
            this.snackbar.open(this.translate.instant('employees.RemoveSuccess'), '', { duration: 3000 });
            this.loadEmployee();
          }
        }, err => {
          // TODO: Handle error!
          console.error(err);
        });
      }
    });
  }

  addCourse() {
    this.spinner.show();
    var userType = this._globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/employees', this.empInfo.userId, 'assigncourse'], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/employees', this.empInfo.userId, 'assigncourse'], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/employees', this.empInfo.userId, 'assigncourse'], { skipLocationChange: false });
    } else {
      this.router.navigate(['./trainer/employees', this.empInfo.userId, 'assigncourse'], { skipLocationChange: false });
    }
  }

  deleteAssignment(ass) {
    var strHead = this.translate.instant('assignment.DeleteCourseAssQ');
    var strMessage = this.translate.instant('assignment.DeleteDirectCourseAssFull', { course: ass.courseName, name: this.empInfo.FULLNAME });

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this._globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bUpdatingCourseAssignmentList = true;
        this.service.deleteCourseAssignment(ass.courseAssId).subscribe(data => {
          if (data.success) {
            this.loadEmployee();
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
    if (userType == "1") {
      this.router.navigate(['./superadmin/employees', this.empInfo.userId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/employees', this.empInfo.userId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/employees', this.empInfo.userId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./trainer/employees', this.empInfo.userId, 'assigncourse', ass.courseAssId], { skipLocationChange: false });
    }
  }

  openGroupDep(courseAss) {
    var routeUrl = './';
    var userType = this._globals.getUserType();
    if (userType == "1") {
      routeUrl += 'superadmin/';
    } else if (userType == "2") {
      routeUrl += 'admin/';
    } else if (userType == "3") {
      routeUrl += 'trainer/';
    } else {
      return;
    }

    if (courseAss.groupId) {
      this.spinner.show();
      routeUrl += 'groups/' + courseAss.groupId;
    } else if (courseAss.departmentId) {
      this.spinner.show();
      routeUrl += 'department/' + courseAss.departmentId;
    }

    if (courseAss.groupId || courseAss.departmentId) {
      this.router.navigate([routeUrl], { skipLocationChange: false });
    }
  }

  viewCourse(course) {
    var userType = this._globals.getUserType();
    this.spinner.show();
    if (userType == "1") {
      this.router.navigate(['./superadmin/course/view', course.courseId, 0], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/course/view', course.courseId, 0], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/course/view', course.courseId, 0], { skipLocationChange: false });
    } else {
      this.router.navigate(['./trainer/course/view', course.courseId, 0], { skipLocationChange: false });
    }
  }

  deleteEmployee() {
    this.translate.get('dialog.DeleteEmpSure').pipe(take(1)).subscribe(value => {
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: this.empId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
        if (result) {
          this.spinner.show();
          this.service.delete(this.empId).pipe(take(1)).subscribe((res) => {
            if (res.success) {
              let userType = this._globals.getUserType();
              this.snackbar.open(this.translate.instant('employees.RemoveSuccess'), '', { duration: 3000 });
              if (userType == "1") {
                this.router.navigate(['./superadmin/employees'], { skipLocationChange: false });
              } else if (userType == "2") {
                this.router.navigate(['./admin/employees'], { skipLocationChange: false });
              } else if (userType == "3") {
                this.router.navigate(['./trainer/employees'], { skipLocationChange: false });
              } else {
                this.router.navigate(['./trainer/employees'], { skipLocationChange: false });
              }
            }
            this.spinner.hide();
          });
        }
      });
    });
  }
  toggleEmpActivation() {
    var bActivate = this.empInfo.inactive != 0;
    let message = bActivate ? this.translate.instant('dialog.ReactivateEmpSure') : this.translate.instant('dialog.DeactivateEmpSure');
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this.empId, Action: false, Mes: message },
      autoFocus: false
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.service.setActivation(this.empId, bActivate).pipe(take(1)).subscribe(res => {
          if (res.success) {
            this.bEmpDataLoaded = false;
            this.loadEmployee();
          }
        });
      }
    });
  }
  passUser(course) {
    const dialogRef = this.dialog.open(DialogForwardUserDialog, {
      data: { name: this.empInfo.FULLNAME, course: course.courseName, hasCertificate: course.certificaterId }
    });

    var obj = this;
    dialogRef.afterClosed().subscribe(result => {
      if (result && (result == 1 || result == 2)) {
        var justPass = (result == 1 ? '1' : '0');
        obj.service.passUserCourse(obj.empInfo.empId, course.courseId, justPass).subscribe(data => {
          if (data.success) {
            this.snackbar.open(this.translate.instant('course.PassEmpSuccess'), '', { duration: 3000 });
            this.bEmpDataLoaded = false;
            this.loadEmployee();
          } else {
            console.error("UNKNOWN ERROR");
          }
        }, err => {
          // TODO: Handle error
          console.error(err);
        })
      }
    });
  }

  downloadCertificate(course) {
    if (!course.certificaterId) {
      return;
    }
    if (this._globals.currentCertificateDownloadWindow) {
      this._globals.currentCertificateDownloadWindow.close();
    }
    var url = this._globals.WebURL + '/API/index.php/createpdf/view/' + course.courseId + '/' + this.empId;
    var width = window.innerHeight > 500 ? window.innerHeight * 3 / 4 : 500;
    var height = window.innerHeight > 600 ? window.innerHeight - 100 : window.innerHeight;
    var strWindowSettings = 'menubar=no,toolbar=no,status=no,channelmode=yes,top=0,left=0';
    strWindowSettings += ',width=' + width + ',height=' + height;
    this._globals.currentCertificateDownloadWindow = window.open(url, "Smart-Study", strWindowSettings);
  }

  createAndSendNewPassword() {
    var strHead = this.translate.instant('employees.ReGenPass');
    var strMessage = this.translate.instant('employees.ReGenPassSure', { name: this.empInfo.FULLNAME, mail: this.empInfo.EmailID });

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this._globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.bUpdatingMemberStatus = true;
        this.service.generateNewPw(this.empInfo.userId).subscribe(data => {
          if (data.success) {
            this.snackbar.open(this.translate.instant('employees.NewPWSuccess'), '', { duration: 3000 });
          } else {
            this.snackbar.open(this.translate.instant('employees.NewPWFail'), '', { duration: 3000 });
          }
        }, err => {
          this.snackbar.open(this.translate.instant('employees.NewPWFail'), '', { duration: 3000 });
          // TODO: Handle error!
          console.error(err);
        });
      }
    });
  }

  openCertificateDialog() {
    this.dialog.open(CertificateDialog, {
      maxWidth: '600px',
      width: '100vw',
      // minHeight: 'calc(100vh - 100px)',
      height: 'auto',
      autoFocus: false,
      data: {
        empId: this.empId,
        name: this.empInfo.FULLNAME
      }
    })
  }
}


@Component({
  selector: 'view-employee-component-dialog',
  templateUrl: 'view.employee.component-dialog.html',
  styleUrls: ['./view-employee.component-dialog.scss']
})
export class CertificateDialog implements OnInit {
  bViewInit = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.bViewInit = true;
  }
}

