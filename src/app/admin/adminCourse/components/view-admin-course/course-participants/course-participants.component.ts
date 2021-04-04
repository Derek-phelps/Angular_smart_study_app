import { state, style, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { FilterMatchMode, PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { DialogForwardUserDialog } from 'src/app/forward-user/dialog-forward-user-dialog';
import { AdminCourseService } from '../../../adminCourse.service';
import { VACUtils } from '../view-admin-course-utils';
import { Translation } from 'primeng/api/translation';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

interface CourseFinishInfo {
 date : Date
}

interface Department {
  id : number,
  name : string
}

interface Group {
  id : number,
  name : string
}

interface TableData {
  id : number,
  lastName : string,
  firstName : string,
  fullName : string,
  email : string,
  groups : Group[],
  courseStatus : number,
  globalStatus : number,
  departments : Department[],
  finishInfo : CourseFinishInfo[],
}

enum EViewMode {
  Compact,
  Full
}

@Component({
  selector: 'course-participants',
  templateUrl: './course-participants.component.html',
  styleUrls: ['./course-participants.component.scss'],
  animations: VACUtils.componentAnimations,
})
export class CourseParticipantsComponent implements OnInit, AfterViewInit {
  
  public EViewMode = EViewMode;

  private _breakpoint$ : Observable<BreakpointState> = new Observable;
  private _viewMode : EViewMode = EViewMode.Full;
  private _filterMode : string = "row";
  private _tableData : TableData[] = [];
  private _courseData : any = {};
  private _statuses : any[] = [
    { label : this._translate.instant('course.Done'), value : 1 },
    { label : this._translate.instant('course.Open'), value : 0 },
    { label : this._translate.instant('course.Overdue'), value : -1 },
  ];

  @Input() 
  set courseData(data : any) {
    this._courseData = data;
    this._setupTable(data);
      this.changeDetector.detectChanges();
  }

  @Output() updateData: EventEmitter<void> = new EventEmitter<void>();

  private _userStatusTable = new MatTableDataSource();

  @ViewChild('userPaginator') set userPaginator(paginator: MatPaginator) {
    this._userStatusTable.paginator = paginator;
  }

  @ViewChild('userSort') set userSort(sort: MatSort) {
    this._userStatusTable.sort = sort;
  }

  private _courseUsersOverdue: number = -1;
  private _courseUsersOpen: number = -1;

  constructor(
    private _globals: Globals,
    private _translate: TranslateService,
    private dialog: MatDialog,
    private service: AdminCourseService,
    private snackbar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private config: PrimeNGConfig,
    private _breakPointObserver : BreakpointObserver
  ) {
    this._translate.get('primeng').pipe(take(1)).subscribe(res => this.config.setTranslation(res));
   }

  ngOnInit(): void {
  }

  ngAfterViewInit() : void {
    this._breakpoint$ = this._breakPointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
      tap(change => {
        if(change.matches) { 
          this._viewMode = EViewMode.Compact;
          this._filterMode = 'menu'; 
          this.changeDetector.detectChanges();
        }
        else { 
          this._viewMode = EViewMode.Full; 
          this._filterMode = 'row'; 
          this.changeDetector.detectChanges();
        }
        
      })
    )
  }

  private _setupTable(data: any): void {
    this._userStatusTable.data = data.userStatus;
    let obj = this;
    this._userStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(
        data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter) ||
        obj.filterFunction(data.EmailID, filter);
    }

    this._userStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'email': { return item.EmailID; }
        case 'status': { return item.courseStatus; }
        default: { return item[property]; }
      }
    };


    this._tableData = [];
    
    data.userStatus.forEach(entry => {

      let groups : Group[] = [];
      let departments : Department[] = [];
      let finishInfo : CourseFinishInfo[] = [];
      entry.groups.forEach(group => { groups.push({ id : group.groupId, name : group.name }); });
      entry.departments.forEach(dep => { departments.push({ id : dep.departmentId, name : dep.departmentName }); });
      entry.courseFinished.forEach(fin => { finishInfo.push({ date : moment(fin.dateFinished, "YYYY-MM-DD hh:mm:ss").toDate()  }); });

      this._tableData.push( {
        id : entry.empId,
        firstName : entry.FIRSTNAME,
        lastName : entry.LASTNAME,
        fullName : entry.FULLNAME,
        email : entry.EmailID,
        groups : groups,
        departments : departments,
        finishInfo : finishInfo,
        courseStatus : entry.courseStatus,
        globalStatus : entry.globalStatus
      });
    });

    this._courseUsersOverdue = VACUtils.calcCourseUsersOverdue(data.userStatus);
    this._courseUsersOpen = VACUtils.calcCourseUsersOpen(data.userStatus);
  }

  filterFunction(name: string, filter: string) {
    let bMatch = true;
    let trimLowerFilter = filter.trim().toLowerCase().replace(/\s+/g, ' ');
    let splitFilter = trimLowerFilter.split(" ");
    splitFilter.forEach(filterPred => {
      if (!name.toLowerCase().includes(filterPred)) {
        bMatch = false;
      }
    });

    return bMatch;
  }

  applyMemberFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userStatusTable.filter = filterValue;

    if (this.userStatusTable.paginator) { this.userStatusTable.paginator.firstPage(); }
  }

  passUser(employee: any) {
    const dialogRef = this.dialog.open(DialogForwardUserDialog, {
      data: { name: employee.FULLNAME, course: this.courseInfo.courseName, hasCertificate: this.courseInfo.hasCertificate }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result == 1 || result == 2) {
        let pass: string = (result == 1 ? '1' : '0');
        this.service.passUserCourse(employee.empId, this.courseInfo.courseId, pass).pipe(take(1)).subscribe(data => {
          if (data.success) {
            this.snackbar.open(this._translate.instant('course.PassEmpSuccess'), '', { duration: 3000 });
            this.updateData.next();
          }
        },
          err => {
            console.error(err); // TODO: Handle error
          })
      }
    });
  }

  get filterMode() : string { return this._filterMode; }

  get viewMode() : EViewMode { return this._viewMode; }
  get breakpoint$() : Observable<BreakpointState> { return this._breakpoint$; }
  get userInfo() { return this._globals.userInfo; };
  get userStatusTable() { return this._userStatusTable; };
  get userDisplayedColumns(): string[] { return ['status', 'LASTNAME', 'FIRSTNAME', 'email', 'editDelete']; }

  get courseUsersOverdue(): number { return this._courseUsersOverdue; }
  get courseUsersOpen(): number { return this._courseUsersOpen; }
  get courseInfo() : any { return this._courseData.courseInfo; }
  get tableData() : TableData[] { return this._tableData; } 
  get statuses() : any[] { return this._statuses; }


}
