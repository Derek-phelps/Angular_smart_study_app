import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { Globals } from '../common/auth-guard.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseAssignmentService } from './course-assignment.service';
import { CourseAssignmentModule } from './course-assignment.module';
import { Location } from '@angular/common';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, Subject } from 'rxjs';

const moment = _rollupMoment || _moment;

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MM.YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MM.YYYY',
  },
};

@Component({
  selector: 'app-course-assignment',
  templateUrl: './course-assignment.component.html',
  styleUrls: ['./course-assignment.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ]),
    trigger('openedChanged', [
      state('shown', style({ height: '*' })),
      state('hidden', style({ height: 0 })),
      transition('* => *', animate(200))
    ])
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    }
  ]
})
export class CourseAssignmentComponent implements OnInit {
  public courseSingleFilterCtrl: FormControl = new FormControl();
  public filteredCourseList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  protected _onDestroy = new Subject<void>();

  bLoaded = false;
  assignmentType = 0;
  params: any;

  startDate: any = undefined;
  bIsMandatory = true;
  timeSpan = 60;
  endDate: any = undefined;
  bCatchUp = false;
  bForceSeries = true;

  bIncludeSubDeps = false;

  courseList: any = [];
  bCourseListLoaded = false;
  selectedCourse: any = undefined;
  selectedUser: any = undefined;
  selectedDepartment: any = undefined;
  selectedGroup: any = undefined;

  groupNameList = [];
  bGroupNameListLoaded = false;

  empNameList = [];
  bEmpNameListLoaded = false;

  bIsRecurring = false;
  recurringSpan = 1;
  recurringMY = 'year';

  constructor(private _changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute, private spinner: NgxSpinnerService, private translate: TranslateService,
    private _globals: Globals, private service: CourseAssignmentService, private _location: Location, private snackbar: MatSnackBar) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    //console.log(this.route);

    this.route.params.subscribe(params => {
      //console.log(params);
      this.params = params;
      if (this.params.groupId) {
        this.assignmentType = 1;
        this.selectedGroup = this.params.groupId;
      } else if (this.params.departmentId) {
        this.assignmentType = 2;
        this.selectedDepartment = this.params.departmentId;
      } else if (this.params.userId) {
        this.assignmentType = 0;
        this.selectedUser = this.params.userId;
      }
    });

    this.startDate = new FormControl();
    this.endDate = new FormControl();

    this.spinner.hide();
  }

  ngOnInit() {
    this.courseSingleFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCourseSingle();
      });

    if (this.params.assId) {
      this.loadCourseAssignment();
    } else {
      this.bLoaded = true;
    }

    this.loadCourseList();
    this.loadGroups();
    this.loadEmployees();
  }

  protected filterCourseSingle() {
    if (!this.courseList) {
      return;
    }
    // get the search keyword
    let search = this.courseSingleFilterCtrl.value;
    if (!search) {
      this.filteredCourseList.next(this.courseList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the leaders
    var obj = this;
    this.filteredCourseList.next(
      this.courseList.filter(course => (course.courseName.toLowerCase().indexOf(search) > -1))
    );
  }

  loadCourseAssignment() {
    this.bLoaded = false;
    this.service.getCourseAssignment(this.params.assId).subscribe(data => {
      if (data.success) {
        this.bIsRecurring = data.data.isSeries == '1';
        this.bIsMandatory = data.data.mandatory == '1';
        this.startDate.setValue(moment(data.data.startDate));
        this.bCatchUp = data.data.catchUp == '1';
        this.selectedCourse = data.data.courseId;
        this.selectedDepartment = data.data.departmentId;
        if (data.data.endDate) {
          this.endDate.setValue(moment(data.data.endDate));
        }
        this.bForceSeries = data.data.forceSeries == '1';
        this.selectedGroup = data.data.groupId;
        if (data.data.repeatSpan) {
          this.recurringSpan = Number(data.data.repeatSpan);
        }
        if (data.data.repeatUnit) {
          this.recurringMY = data.data.repeatUnit;
        }
        this.timeSpan = Number(data.data.timeToComplete);
        this.selectedUser = data.data.userId;
        this.bIncludeSubDeps = data.data.applyToSubDeps == '1';

        //console.warn(this.selectedCourse);


        // TODO: set stuff

        //console.log(data.data);
        this.bLoaded = true;
      }
    }, err => {
      // TODO: Handle error
      console.error(err);
    })
  }

  loadCourseList() {
    this.bCourseListLoaded = false;
    this.courseList = [];
    this.service.getMyAssignmentCourseList().subscribe(data => {
      if (data.success) {
        this.courseList = data.data;
        this.bCourseListLoaded = true;
      } else {
        this.courseList = [];
      }
      this.filterCourseSingle();
    }, err => {
      console.error(err);
    });
  }

  loadGroups() {
    this.bGroupNameListLoaded = false;
    this.groupNameList = [];
    this.service.loadGroups(this.params.groupId, this.params.departmentId).subscribe(data => {
      if (data.success) {
        this.groupNameList = data.data;
        this.bGroupNameListLoaded = true;
      }
    }, err => {
      console.error(err);
    });
  }

  loadEmployees() {
    this.bEmpNameListLoaded = false;
    this.empNameList = [];
    this.service.getEmployees(this.params.userId).subscribe(data => {
      if (data.success) {
        this.empNameList = data.data;
        this.bEmpNameListLoaded = true;
      }
    }, err => {
      // TODO: Handle error
      console.error(err);
    });
  }

  saveAssignment() {
    this.spinner.show();
    var start = this.startDate.value ? this.startDate.value.format('YYYY-MM-DD') : null;
    var end = this.endDate.value ? this.endDate.value.format('YYYY-MM-DD') : null;
    this.timeSpan = Math.max(this.timeSpan, 1);
    if (this.params.userId && !this.bIsRecurring) {
      end = null;
    }
    this.service.addOrUpdateCourseAssignment(this.params.assId, this.selectedCourse, this.selectedUser, this.selectedGroup, this.selectedDepartment,
      this.bIsMandatory, start, this.timeSpan, this.bIsRecurring, this.recurringSpan, this.recurringMY, end, this.bCatchUp, this.bForceSeries, this.bIncludeSubDeps).subscribe(data => {
        if (data.success) {
          if (this.params.assId) {
            this.snackbar.open(this.translate.instant('assignment.EditSuccess'), '', { duration: 3000 });
          } else {
            this.snackbar.open(this.translate.instant('assignment.AssignSuccess'), '', { duration: 3000 });
          }
          this._location.back();
        } else {
          // TODO: Handle error
        }
      }, err => {
        // TODO: Handle error
        console.error(err);
        this.spinner.hide();
      });
  }

  checkValid() {
    if (this.selectedCourse && this.startDate.value && (this.timeSpan > 0 || !this.bIsMandatory)) {
      if (this.bIsRecurring && !this.recurringSpan) {
        return false;
      }
      if (this.bIsRecurring && this.endDate && this.endDate.value && !moment(this.startDate.value).isSameOrBefore(this.endDate.value, 'day')) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  cancel() {
    this._location.back();
  }

  onValueChange() {
    this._changeDetectorRef.detectChanges();
  }
}
