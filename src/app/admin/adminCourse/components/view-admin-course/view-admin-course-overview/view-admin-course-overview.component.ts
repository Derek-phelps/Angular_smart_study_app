import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { AdminCourseService } from '../../../adminCourse.service';

@Component({
  selector: 'view-admin-course-overview',
  templateUrl: './view-admin-course-overview.component.html',
  styleUrls: ['./view-admin-course-overview.component.scss'],
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
export class ViewAdminCourseOverviewComponent implements OnInit {

  @Input() courseId : number = -1;
  @Output() tabId : EventEmitter<number> = new EventEmitter<number>();

  private _courseData$ : Observable<any>;
  private _userStatusTable = new MatTableDataSource();
  private _groupStatusTable = new MatTableDataSource();
  private _departmentStatusTable = new MatTableDataSource();

  @ViewChild('userPaginator') set userPaginator(paginator: MatPaginator) {
    this._userStatusTable.paginator = paginator;
  }
  @ViewChild('groupPaginator') set groupPaginator(paginator: MatPaginator) {
    this._groupStatusTable.paginator = paginator;
  }
  @ViewChild('depPaginator') set depPaginator(paginator: MatPaginator) {
    this._departmentStatusTable.paginator = paginator;
  }

  @ViewChild('userSort') set userSort(sort: MatSort) {
    this._userStatusTable.sort = sort;
  }
  @ViewChild('groupSort') set groupSort(sort: MatSort) {
    this._groupStatusTable.sort = sort;
  }
  @ViewChild('depSort') set depSort(sort: MatSort) {
    this._departmentStatusTable.sort = sort;
  }

  constructor(
    private service: AdminCourseService,
    private globals : Globals
  ) { }

  ngOnInit(): void {
    this._initStatusTables();
    this._courseData$ = this.service.getCourseData(this.courseId).pipe(
      tap((data : any) => {
        this._userStatusTable.data = data.userStatus;
        this._departmentStatusTable.data = data.departmentStatus;
        this._groupStatusTable.data = data.groupStatus;

        // this._userStatusTable.data.forEach((stat: any) => {
        //   if (userStat.courseStatus == -1) {
        //     this.courseUserOverdue = this.courseUserOverdue + 1;
        //   } else if (userStat.courseStatus == 0) {
        //     this.courseUserOpen = this.courseUserOpen + 1;
        //   } else {
        //     this.courseUserDone = this.courseUserDone + 1;
        //   }
        // });
      })
    );
  }

  private _initStatusTables() : void {
    this._userStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(
        data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter) || 
        this.filterFunction(data.EmailID, filter);
    }
    this._departmentStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(data.departmentName, filter);
    }
    this._groupStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(data.name, filter);
    }

    this._userStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'email': { return item.EmailID; }
        case 'status': { return item.courseStatus; }
        default: { return item[property]; }
      }
    };

    this.departmentStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'name': { return item.departmentName; }
        case 'status': { return item.departmentCourseStatus; }
        default: { return item[property]; }
      }
    };

    this.groupStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'status': { return item.groupCourseStatus; }
        default: { return item[property]; }
      }
    };
  }

  openPartList() {
    this.tabId.emit(1);
  }

  get userInfo() { return this.globals.userInfo; };
  get courseData$() { return this._courseData$; };
  get userStatusTable() { return this._userStatusTable; };
  get groupStatusTable() { return this._groupStatusTable; };
  get departmentStatusTable() { return this._departmentStatusTable; };

  get departmentDisplayedColumns() : string[] { return ['status', 'name'] };

}
