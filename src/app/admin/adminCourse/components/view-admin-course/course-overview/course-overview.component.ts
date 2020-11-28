import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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

@Component({
  selector: 'course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss'],
  animations: VACUtils.componentAnimations
})
export class CourseOverviewComponent implements OnInit {

  @Input() courseId : number = -1;
  @Input() courseData : any;
  
  @Output() tabId : EventEmitter<number> = new EventEmitter<number>();
  
  private _groupStatusTable = new MatTableDataSource();
  private _departmentStatusTable = new MatTableDataSource();
  
  private _courseChartData : MultiDataSet = [];
  private _courseChartLabels : Label[] = [];
  private _courseChartColors = [];

  
  @ViewChild('groupPaginator') set groupPaginator(paginator: MatPaginator) {
    this._groupStatusTable.paginator = paginator;
  }

  @ViewChild('depPaginator') set depPaginator(paginator: MatPaginator) {
    this._departmentStatusTable.paginator = paginator;
  }

  @ViewChild('groupSort') set groupSort(sort: MatSort) {
    this._groupStatusTable.sort = sort;
  }

  @ViewChild('depSort') set depSort(sort: MatSort) {
    this._departmentStatusTable.sort = sort;
  }

  constructor(
    private globals : Globals,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChanges) {
    if(changes.courseData) {
      this._setupTables(this.courseData);
      this._setupChart(this.courseData);
    }
  }

  private _setupTables(data : any) : void {
    this._departmentStatusTable.data = data.departmentStatus;
    this._groupStatusTable.data = data.groupStatus;

    this._departmentStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(data.departmentName, filter);
    }
    this._groupStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(data.name, filter);
    }

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

  private _setupChart(data) : void {
    this._courseChartData = [[VACUtils.calcCourseUsersDone(data.userStatus), 
                              VACUtils.calcCourseUsersOpen(data.userStatus), 
                              VACUtils.calcCourseUsersOverdue(data.userStatus)]];

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

  openPartList() {
    this.tabId.emit(1);
  }

  get userInfo() { return this.globals.userInfo; };
  
  get groupStatusTable() { return this._groupStatusTable; };
  get departmentStatusTable() { return this._departmentStatusTable; };

  get departmentDisplayedColumns() : string[] { return ['status', 'name']; }
  get groupDisplayedColumns(): string[] { return ['status', 'name']; }

  get courseChartData() : MultiDataSet { return this._courseChartData; }
  get courseChartLabels() : Label[] { return this._courseChartLabels; }
  get courseChartColors() { return this._courseChartColors };
}
