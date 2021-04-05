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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver/src/FileSaver.js'
import * as xlsx from 'xlsx'


// interface CourseFinishInfo {
//  date : Date
// }

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
  departments : Department[],
  courseStatus : number,
  globalStatus : number,
  finishInfo : Date[],
  finished : Date,
}

@Component({
  selector: 'course-participants',
  templateUrl: './course-participants.component.html',
  styleUrls: ['./course-participants.component.scss'],
  animations: VACUtils.componentAnimations,
})
export class CourseParticipantsComponent implements OnInit, AfterViewInit {
  
  private _tableData : TableData[] = [];
  private _filteredData : TableData[] = [];
  private _filterCriteria : any = {};

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
  ) {
    this._translate.get('primeng').pipe(take(1)).subscribe(res => this.config.setTranslation(res));
   }

  ngOnInit(): void {
  }

  ngAfterViewInit() : void {
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

  public onFiltered($event) : void {
    this._filterCriteria = $event.filters;
    this._filteredData = $event.filteredValue;
  }
  
  public exportPdf() : void {
    const doc = new jsPDF();
    let tableData = this._getFilteredTableData();
    (doc as any).autoTable({
        head: tableData.head,
        body: tableData.data,
        theme: 'plain',
      });
    
    tableData = this._getFilters();
    
    if(tableData.data.length > 0) {
      (doc as any).autoTable({
        head: tableData.head,
        body: tableData.data,
        theme: 'plain',
      });
    }
    doc.save(this.courseInfo['courseName'] +'.pdf');
  }

  public exportCsv() : void {
    let tableData = this._getFilteredTableData();
    let filters = this._getFilters();
    {
      let csv = tableData.data;
      csv.unshift(tableData.head.join(','));
      let csvArray = csv.join('\r\n');
      let blob = new Blob([csvArray], {type: 'text/csv' })
      saveAs(blob, this.courseInfo['courseName'] +'.csv');
    }
    
    if(filters.data.length > 0) {
      let csv = filters.data;
      csv.unshift(filters.head.join(','));
      let csvArray = csv.join('\r\n');
      let blob = new Blob([csvArray], {type: 'text/csv' })
      saveAs(blob, this.courseInfo['courseName'] +'_filters.csv');
    }
  }

  public exportExcel() : void {
    let tableData = this._getFilteredTableData();
    let filters = this._getFilters();
    let worksheet = xlsx.utils.aoa_to_sheet(tableData.head);
    xlsx.utils.sheet_add_aoa(worksheet, tableData.data, { origin : "A2" } );
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    if(filters.data.length > 0) {
      let worksheet = xlsx.utils.aoa_to_sheet(filters.head);
      xlsx.utils.sheet_add_aoa(worksheet, filters.data, { origin : "A2" } );
      xlsx.utils.book_append_sheet(workbook, worksheet, 'filters');
    }

    const excelData: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

    let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([excelData], { type: type });
    saveAs(data, this.courseInfo['courseName'] + '.xlsx');
  }

  private _getFilteredTableData() : any {
    let head = [[
      this._translate.instant('employees.Surname'), 
      this._translate.instant('employees.Name'), 
      this._translate.instant('employees.Email'),
      this._translate.instant('course.Status'), 
    ]];

    let data = [];
    this._filteredData.forEach(d => data.push([
      d.lastName, 
      d.firstName, 
      d.email,
      this._statuses.find(s => s.value == d.courseStatus).label
      ])
    );

    return { head, data };
  }

  private _getFilters() : any {
    let head = [[
      this._translate.instant('exports.fieldName'),
      this._translate.instant('exports.filterValue'), 
    ]];
    
    let data = [];
      
    Object.keys(this._filterCriteria).forEach(f => {
      let filter : any = this._filterCriteria[f];
      if(filter[0].value != null) {
        let columnName : string = f;
        let value : string = filter[0].value;
        switch(f) {
          case 'lastName': columnName = this._translate.instant('employees.Surname'); break;
          case 'firstName': columnName = this._translate.instant('employees.Name'); break;
          case 'email': columnName = this._translate.instant('employees.Email'); break;
          case 'courseStatus': { 
            columnName = this._translate.instant('course.Status'); 
            value = this._statuses.find(s => s.value == value ).label
          } break;
        }

        data.push([
          columnName,
          value
        ]);
      }
    });

    return { head, data };
  }

  private _setupTable(data: any): void {
    this._tableData = [];
    
    data.userStatus.forEach(entry => {
      let groups : Group[] = [];
      let departments : Department[] = [];
      let finishInfo : Date[] = [];
      let finished : Date = undefined;
      entry.groups.forEach(group => { groups.push({ id : group.groupId, name : group.name }); });
      entry.departments.forEach(dep => { departments.push({ id : dep.departmentId, name : dep.departmentName }); });
      entry.courseFinished.forEach(fin => { finishInfo.push( moment(fin.dateFinished, "YYYY-MM-DD hh:mm:ss").toDate()); });
      if(finishInfo.length > 0) { finished = finishInfo[0]; }
      this._tableData.push( {
        id : entry.empId,
        firstName : entry.FIRSTNAME,
        lastName : entry.LASTNAME,
        fullName : entry.FULLNAME,
        email : entry.EmailID,
        groups : groups,
        departments : departments,
        finishInfo : finishInfo,
        finished : finished,
        courseStatus : entry.courseStatus,
        globalStatus : entry.globalStatus
      });
    });
    
    this._filteredData = this._tableData;
    this._courseUsersOverdue = VACUtils.calcCourseUsersOverdue(data.userStatus);
    this._courseUsersOpen = VACUtils.calcCourseUsersOpen(data.userStatus);
  }


  get userInfo() { return this._globals.userInfo; };

  get courseUsersOverdue(): number { return this._courseUsersOverdue; }
  get courseUsersOpen(): number { return this._courseUsersOpen; }
  get courseInfo() : any { return this._courseData.courseInfo; }
  get tableData() : TableData[] { return this._tableData; } 
  get statuses() : any[] { return this._statuses; }


}
