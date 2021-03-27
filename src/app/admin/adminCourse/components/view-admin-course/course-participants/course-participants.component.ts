import { state, style, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { DialogForwardUserDialog } from 'src/app/forward-user/dialog-forward-user-dialog';
import { AdminCourseService } from '../../../adminCourse.service';
import { VACUtils } from '../view-admin-course-utils';

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
  groups : Group[],
  email : string,
  courseStatus : number,
  globalStatus : number,
  departments : Department[],
  finishInfo : CourseFinishInfo[],
}

@Component({
  selector: 'course-participants',
  templateUrl: './course-participants.component.html',
  styleUrls: ['./course-participants.component.scss'],
  animations: VACUtils.componentAnimations
})
export class CourseParticipantsComponent implements OnInit {

  @Input() courseData: any;
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
    private globals: Globals,
    private translate: TranslateService,
    private dialog: MatDialog,
    private service: AdminCourseService,
    private snackbar: MatSnackBar,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.courseData) {
      this._setupTable(this.courseData);
      this._setupData(this.courseData);
      this.changeDetector.detectChanges();
    }
  }

  private _setupTable(data: any): void {
    console.log(data.userStatus);
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
  }

  private _setupData(data: any): void {
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
            this.snackbar.open(this.translate.instant('course.PassEmpSuccess'), '', { duration: 3000 });
            this.updateData.next();
          }
        },
          err => {
            console.error(err); // TODO: Handle error
          })
      }
    });
  }

  get userInfo() { return this.globals.userInfo; };
  get userStatusTable() { return this._userStatusTable; };
  get userDisplayedColumns(): string[] { return ['status', 'LASTNAME', 'FIRSTNAME', 'email', 'editDelete']; }

  get courseUsersOverdue(): number { return this._courseUsersOverdue; }
  get courseUsersOpen(): number { return this._courseUsersOpen; }
  get courseInfo(): any { return this.courseData.courseInfo; }
}
