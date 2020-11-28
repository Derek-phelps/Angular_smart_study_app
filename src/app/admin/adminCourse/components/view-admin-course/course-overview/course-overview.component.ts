import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { hexToRgbaString } from 'src/app/helper-functions';
import { AdminCourseService } from '../../../adminCourse.service';

@Component({
  selector: 'course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss'],
  animations: [
    trigger('headerAnimation', [
      state('shown', style({ opacity: 1, height: '*' })),
      state('hidden', style({ opacity: 0, height: 0 })),
      transition('* => *', animate(200))
    ]),
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(500))
    ]),
    trigger('openedChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(1000))
    ])
  ]
})
export class CourseOverviewComponent implements OnInit {

  @Input() courseId : number = -1;
  @Output() tabId : EventEmitter<number> = new EventEmitter<number>();

  private _courseData$ : Observable<any>;
  
  //private _userStatusTable = new MatTableDataSource();
  private _groupStatusTable = new MatTableDataSource();
  private _departmentStatusTable = new MatTableDataSource();
  
  private _courseChartData : MultiDataSet = [];
  private _courseChartLabels : Label[] = [];
  private _courseChartColors = [];

  // @ViewChild('userPaginator') set userPaginator(paginator: MatPaginator) {
  //   this._userStatusTable.paginator = paginator;
  // }
  @ViewChild('groupPaginator') set groupPaginator(paginator: MatPaginator) {
    this._groupStatusTable.paginator = paginator;
  }

  @ViewChild('depPaginator') set depPaginator(paginator: MatPaginator) {
    this._departmentStatusTable.paginator = paginator;
  }

  // @ViewChild('userSort') set userSort(sort: MatSort) {
  //   this._userStatusTable.sort = sort;
  // }

  @ViewChild('groupSort') set groupSort(sort: MatSort) {
    this._groupStatusTable.sort = sort;
  }

  @ViewChild('depSort') set depSort(sort: MatSort) {
    this._departmentStatusTable.sort = sort;
  }

  constructor(
    private service: AdminCourseService,
    private globals : Globals,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this._courseData$ = this.service.getCourseData(this.courseId).pipe(
      tap((data : any) => {
        this._setupTables(data);
        this._setupChart(data);
      })
    );
  }

  private _setupTables(data : any) : void {

    console.log(data);
    //this._userStatusTable.data = data.userStatus;
    this._departmentStatusTable.data = data.departmentStatus;
    this._groupStatusTable.data = data.groupStatus;

    // this._userStatusTable.filterPredicate = function (data: any, filter: string): boolean {
    //   return this.filterFunction(
    //     data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter) || 
    //     this.filterFunction(data.EmailID, filter);
    // }
    this._departmentStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(data.departmentName, filter);
    }
    this._groupStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(data.name, filter);
    }

    // this._userStatusTable.sortingDataAccessor = (item: any, property) => {
    //   switch (property) {
    //     case 'email': { return item.EmailID; }
    //     case 'status': { return item.courseStatus; }
    //     default: { return item[property]; }
    //   }
    // };

    this._departmentStatusTable.sortingDataAccessor = (item: any, property) => {
      console.log(property);
      switch (property) {
        case 'name': { return item.departmentName; }
        case 'status': { return item.departmentCourseStatus; }
        default: { return item[property]; }
      }
    };

    this._groupStatusTable.sortingDataAccessor = (item: any, property) => {
      console.log(property);
      switch (property) {
        case 'status': { return item.groupCourseStatus; }
        default: { return item[property]; }
      }
    };
  }

  openPartList() {
    this.tabId.emit(1);
  }

  private _setupChart(data) : void {
    let courseUserOverdue : number = 0;
    let courseUserOpen : number = 0;
    let courseUserDone : number = 0;
        
    data.userStatus.forEach((userStat: any) => {
      if (userStat.courseStatus == -1) { courseUserOverdue += 1; } 
      else if (userStat.courseStatus == 0) { courseUserOpen += 1; }
      else { courseUserDone += 1; }
    });

    this._courseChartData = [[courseUserDone, courseUserOpen, courseUserOverdue]];

    this._courseChartLabels = [this.translate.instant('course.Done'), 
                               this.translate.instant('course.Open'), 
                               this.translate.instant('course.Overdue')];

    let opacity : number = 0.8;
    let style : CSSStyleDeclaration = getComputedStyle(document.body);
    let strDanger : string = hexToRgbaString(style.getPropertyValue('--myDanger'), opacity);
    let strWarning : string = hexToRgbaString(style.getPropertyValue('--myWarning'), opacity);
    let strSuccess : string = hexToRgbaString(style.getPropertyValue('--mySuccess'), opacity);
    this._courseChartColors = [{ backgroundColor: [strSuccess, strWarning, strDanger] }];

  }

  get userInfo() { return this.globals.userInfo; };
  get courseData$() { return this._courseData$; };
  
  //get userStatusTable() { return this._userStatusTable; };
  get groupStatusTable() { return this._groupStatusTable; };
  get departmentStatusTable() { return this._departmentStatusTable; };

  //get userDisplayedColumns() : string[] { return ['status', 'LASTNAME', 'FIRSTNAME', 'email', 'editDelete']; }
  get departmentDisplayedColumns() : string[] { return ['status', 'name']; }
  get groupDisplayedColumns(): string[] { return ['status', 'name']; }

  get courseChartData() : MultiDataSet { return this._courseChartData; }
  get courseChartLabels() : Label[] { return this._courseChartLabels; }
  get courseChartColors() { return this._courseChartColors };

}
