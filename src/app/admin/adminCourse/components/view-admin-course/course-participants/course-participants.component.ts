import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { FilterMatchMode, FilterService } from 'primeng/api';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { DialogForwardUserDialog } from 'src/app/forward-user/dialog-forward-user-dialog';
import { AdminCourseService } from '../../../adminCourse.service';
import { VACUtils } from '../view-admin-course-utils';
import { Translation } from 'primeng/api/translation';
import { DialogService } from 'primeng/dynamicdialog';
import { ParticipantsExportDialogComponent } from './participants-export-dialog/participants-export-dialog.component';


// interface CourseFinishInfo {
//  date : Date
// }

export interface Department {
  id: number,
  name: string
}

export interface Group {
  id: number,
  name: string
}

export interface TableData {
  id: number,
  lastName: string,
  firstName: string,
  fullName: string,
  email: string,
  groups: Group[],
  departments: Department[],
  courseStatus: number,
  globalStatus: number,
  finishInfo: Date[],
  finished: Date,
}

@Component({
  selector: 'course-participants',
  templateUrl: './course-participants.component.html',
  styleUrls: ['./course-participants.component.scss'],
  animations: VACUtils.componentAnimations,
  providers: [DialogService]
})
export class CourseParticipantsComponent implements OnInit, AfterViewInit {

  private _tableData: TableData[] = [];
  private _filteredData: TableData[] = [];
  private _filterCriteria: any = {};
  private _availableDepartments: Department[] = [];
  private _availableGroups: Group[] = [];

  private _courseData: any = {};
  private _statuses: any[] = [
    { label: this._translate.instant('course.Done'), value: 1 },
    { label: this._translate.instant('course.Open'), value: 0 },
    { label: this._translate.instant('course.Overdue'), value: -1 },
  ];

  @Input()
  set courseData(data: any) {
    this._courseData = data;
    this._setupTable(data);
    this.changeDetector.detectChanges();
  }

  @Output() updateData: EventEmitter<void> = new EventEmitter<void>();

  private _courseUsersOverdue: number = -1;
  private _courseUsersOpen: number = -1;

  constructor(
    private _globals: Globals,
    private _translate: TranslateService,
    private dialog: MatDialog,
    private service: AdminCourseService,
    private snackbar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private filterService: FilterService,
    public dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
    this.filterService.register(
      'arrayFilter',
      (value, filter): boolean => {
        if (filter == null || filter == undefined || filter.length == 0) { return true; }
        if (value == null || value == undefined || value.length == 0) { return false; }
        return value.filter(element => { return filter.find(f => f.id == element.id) != undefined; }).length > 0;
      }
    );
  }

  ngAfterViewInit(): void {
  }

  public passUser(participant: TableData) {
    const dialogRef = this.dialog.open(DialogForwardUserDialog, {
      data: { name: participant.fullName, course: this.courseInfo.courseName, hasCertificate: this.courseInfo.hasCertificate }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result == 1 || result == 2) {
        let pass: string = (result == 1 ? '1' : '0');
        this.service.passUserCourse(participant.id, this.courseInfo.courseId, pass).pipe(take(1)).subscribe(data => {
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

  public onFiltered($event): void {
    this._filterCriteria = $event.filters;
    this._filteredData = $event.filteredValue;
  }

  public export(): void {
    const ref = this.dialogService.open(ParticipantsExportDialogComponent, {
      header: 'Export',
      width: '50%',
      data: {
        'filtered': this._filteredData,
        'original': this._tableData,
        'courseName': this.courseInfo['courseName'],
        'filterCriteria': this._filterCriteria,
        'statuses': this._statuses,

      }
    });
  }


  private _setupTable(data: any): void {
    this._tableData = [];
    this._availableDepartments = [];

    data.userStatus.forEach(entry => {
      let groups: Group[] = [];
      let departments: Department[] = [];
      let finishInfo: Date[] = [];
      let finished: Date = undefined;
      entry.groups.forEach(group => { groups.push({ id: group.groupId, name: group.name }); });
      entry.departments.forEach(dep => { departments.push({ id: dep.departmentId, name: dep.departmentName }); });
      entry.courseFinished.forEach(fin => { finishInfo.push(moment(fin.dateFinished, "YYYY-MM-DD hh:mm:ss").toDate()); });
      if (finishInfo.length > 0) { finished = finishInfo[0]; }
      this._tableData.push({
        id: entry.empId,
        firstName: entry.FIRSTNAME,
        lastName: entry.LASTNAME,
        fullName: entry.FULLNAME,
        email: entry.EmailID,
        groups: groups,
        departments: departments,
        finishInfo: finishInfo,
        finished: finished,
        courseStatus: entry.courseStatus,
        globalStatus: entry.globalStatus
      });

      this._availableDepartments.push(...departments);
      this._availableGroups.push(...groups);
    });

    // remove duplicates
    this._availableDepartments = this._availableDepartments.filter((d, index, a) => a.findIndex(d2 => d2.id == d.id) === index);
    this._availableGroups = this._availableGroups.filter((d, index, a) => a.findIndex(d2 => d2.id == d.id) === index);

    this._filteredData = this._tableData;
    this._courseUsersOverdue = VACUtils.calcCourseUsersOverdue(data.userStatus);
    this._courseUsersOpen = VACUtils.calcCourseUsersOpen(data.userStatus);
  }


  get userInfo() { return this._globals.userInfo; };

  get courseUsersOverdue(): number { return this._courseUsersOverdue; }
  get courseUsersOpen(): number { return this._courseUsersOpen; }
  get courseInfo(): any { return this._courseData.courseInfo; }
  get tableData(): TableData[] { return this._tableData; }
  get statuses(): any[] { return this._statuses; }
  get availableDepartments(): Department[] { return this._availableDepartments; }
  get availableGroups(): Department[] { return this._availableGroups; }


}
