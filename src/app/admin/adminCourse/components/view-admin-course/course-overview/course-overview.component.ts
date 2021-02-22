import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { hexToRgbaString } from 'src/app/helper-functions';
import { AdminCourseService } from '../../../adminCourse.service';
import { VACUtils } from '../view-admin-course-utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../../../../../theme/components/confirmation-box/confirmation-box.component';

@Component({
  selector: 'course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss'],
  animations: [
    VACUtils.componentAnimations,
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
export class CourseOverviewComponent implements OnInit {
  isDarkenedRow = (index, item) => (item.active == -1 || item.effective == false);

  @Input() courseId: number = -1;
  @Input() courseData: any;

  @Output() tabId: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateData: EventEmitter<void> = new EventEmitter<void>();

  private _groupStatusTable = new MatTableDataSource();
  private _departmentStatusTable = new MatTableDataSource();

  private _courseChartData: MultiDataSet = [];
  private _courseChartLabels: Label[] = [];
  private _courseChartColors = [];


  private _updatingCourseAssignments = true;
  private _companyAssignmentTable = new MatTableDataSource();


  @ViewChild('groupPaginator') set groupPaginator(paginator: MatPaginator) {
    this._groupStatusTable.paginator = paginator;
  }

  @ViewChild('depPaginator') set depPaginator(paginator: MatPaginator) {
    this._departmentStatusTable.paginator = paginator;
  }

  @ViewChild('companyAssPaginator') set globalAssPaginator(paginator: MatPaginator) {
    this._companyAssignmentTable.paginator = paginator;
  }

  @ViewChild('groupSort') set groupSort(sort: MatSort) {
    this._groupStatusTable.sort = sort;
  }

  @ViewChild('depSort') set depSort(sort: MatSort) {
    this._departmentStatusTable.sort = sort;
  }

  @ViewChild('companyAssSort') set globalAssSort(sort: MatSort) {
    this._companyAssignmentTable.sort = sort;
  }

  constructor(
    private globals: Globals,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog,
    private service: AdminCourseService,
    private changeDetector : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.courseData) {
      this._setupTables(this.courseData);
      this._setupChart(this.courseData);
      this.changeDetector.detectChanges();
    }
  }

  private _setupTables(data: any): void {
    this._departmentStatusTable.data = data.departmentStatus;
    this._groupStatusTable.data = data.groupStatus;
    this._setupGlobalAssTable(data);

    this._departmentStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(data.departmentName, filter);
    }
    this._groupStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(data.name, filter);
    }

    this._departmentStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'name': { return item.departmentName; }
        case 'status': { return item.departmentCourseStatus; }
        default: { return item[property]; }
      }
    };

    this._groupStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'status': { return item.groupCourseStatus; }
        default: { return item[property]; }
      }
    };

    this._companyAssignmentTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'nextEvent': {
          if (item.nextEvent) {
            return item.sortNextEvent;
          } else {
            return "z";
          }
        }
        case 'recurrence': {
          if (item.repeatSpan) {
            return Number(item.repeatSpan) * (item.repeatUnit == 'year' ? 12 : 1);
          } else {
            return "z"
          }
        }
        default: {
          return item[property];
        }
      }
    };

    this._updatingCourseAssignments = false;
  }

  private _setupGlobalAssTable(data): void {
    data.compAss.forEach(assignment => {
      if (Number(assignment.isSeries) == 1) {
        assignment.effective = false;
        data.compAssEffective.forEach(effectiveAssignment => {
          if (effectiveAssignment == assignment.courseAssId) {
            assignment.effective = true;
          }
        });
      } else {
        assignment.effective = true;
      }
    });

    this._companyAssignmentTable.data = data.compAss;
  }

  private _setupChart(data): void {
    this._courseChartData = [[VACUtils.calcCourseUsersDone(data.userStatus),
    VACUtils.calcCourseUsersOpen(data.userStatus),
    VACUtils.calcCourseUsersOverdue(data.userStatus)]];

    this._courseChartLabels = [this.translate.instant('course.Done'),
    this.translate.instant('course.Open'),
    this.translate.instant('course.Overdue')];

    let opacity: number = 0.8;
    let style: CSSStyleDeclaration = getComputedStyle(document.body);
    let strDanger: string = hexToRgbaString(style.getPropertyValue('--myDanger'), opacity);
    let strWarning: string = hexToRgbaString(style.getPropertyValue('--myWarning'), opacity);
    let strSuccess: string = hexToRgbaString(style.getPropertyValue('--mySuccess'), opacity);
    this._courseChartColors = [{ backgroundColor: [strSuccess, strWarning, strDanger] }];
  }

  openPartList() {
    this.tabId.emit(1);
  }

  addCourseAssignment() {
    this.spinner.show();
    var userType = this.globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/course/assigncourse', this.courseData.courseInfo.courseId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/course/assigncourse', this.courseData.courseInfo.courseId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./employee/course/assigncourse', this.courseData.courseInfo.courseId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./employee/course/assigncourse', this.courseData.courseInfo.courseId], { skipLocationChange: false });
    }
  }

  editAssignment(ass) {
    this.spinner.show();
    var userType = this.globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/course/assigncourse', this.courseData.courseInfo.courseId, ass.courseAssId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/course/assigncourse', this.courseData.courseInfo.courseId, ass.courseAssId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./employee/course/assigncourse', this.courseData.courseInfo.courseId, ass.courseAssId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./employee/course/assigncourse', this.courseData.courseInfo.courseId, ass.courseAssId], { skipLocationChange: false });
    }
  }

  deleteAssignment(ass) {
    var strHead = this.translate.instant('assignment.DeleteCourseAssQ');
    var strMessage = this.translate.instant('assignment.DeleteGlobalAssFull', { course: ass.courseName });

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this.globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._updatingCourseAssignments = true;
        this.service.deleteCourseAssignment(ass.courseAssId).subscribe(data => {
          if (data.success) {
            //this.loadGroup(true);
            this.updateData.next();
          }
        }, err => {
          // TODO: Handle error!
          console.error("Not deleted!!");
          console.error(err);
        });
      }
    });
  }

  get userInfo() { return this.globals.userInfo; };

  get groupStatusTable() { return this._groupStatusTable; };
  get departmentStatusTable() { return this._departmentStatusTable; };
  get companyAssignmentTable() { return this._companyAssignmentTable; };

  get departmentDisplayedColumns(): string[] { return ['status', 'name']; };
  get groupDisplayedColumns(): string[] { return ['status', 'name']; };
  get companyAssDisplayedColumns(): string[] { return ['courseName', 'firstEvent', 'nextEvent', 'recurrence', 'endDate', /*'status',*/ 'editDelete']; };

  get courseChartData(): MultiDataSet { return this._courseChartData; };
  get courseChartLabels(): Label[] { return this._courseChartLabels; };
  get courseChartColors() { return this._courseChartColors };

  get updatingCourseAssignments(): boolean { return this._updatingCourseAssignments; };
}
