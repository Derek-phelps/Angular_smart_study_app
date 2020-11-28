import { state, style, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/common/auth-guard.service';
import { VACUtils } from '../view-admin-course-utils';

@Component({
  selector: 'course-participants',
  templateUrl: './course-participants.component.html',
  styleUrls: ['./course-participants.component.scss'],
  animations: VACUtils.componentAnimations
})
export class CourseParticipantsComponent implements OnInit {

  @Input() courseData : any;

  private _userStatusTable = new MatTableDataSource();

  @ViewChild('userPaginator') set userPaginator(paginator: MatPaginator) {
    this._userStatusTable.paginator = paginator;
  }

  @ViewChild('userSort') set userSort(sort: MatSort) {
    this._userStatusTable.sort = sort;
  }

  private _courseUsersOverdue : number = -1;
  private _courseUsersOpen : number = -1;
  
  constructor(
    private globals : Globals,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes) {
    if(changes.courseData) {
      this._setupTable(this.courseData);
      this._setupData(this.courseData);
    }
  }

  private _setupTable(data : any) : void {
    this._userStatusTable.data = data.userStatus;
    this._userStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return this.filterFunction(
        data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter) || 
        this.filterFunction(data.EmailID, filter);
    }
    
    this._userStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'email': { return item.EmailID; }
        case 'status': { return item.courseStatus; }
        default: { return item[property]; }
      }
    };
  }

  private _setupData(data : any) : void {
    this._courseUsersOverdue = VACUtils.calcCourseUsersOverdue(data.userStatus);
    this._courseUsersOpen = VACUtils.calcCourseUsersOpen(data.userStatus);
  }

  applyMemberFilter(event: Event) : void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userStatusTable.filter = filterValue;

    if (this.userStatusTable.paginator) { this.userStatusTable.paginator.firstPage(); }
  }

  get userInfo() { return this.globals.userInfo; };
  get userStatusTable() { return this._userStatusTable; };
  get userDisplayedColumns() : string[] { return ['status', 'LASTNAME', 'FIRSTNAME', 'email', 'editDelete']; }

  get courseUsersOverdue() : number { return this._courseUsersOverdue; }
  get courseUsersOpen() : number { return this._courseUsersOpen; }
  get courseInfo() : any { return this.courseData.courseInfo; }



}
