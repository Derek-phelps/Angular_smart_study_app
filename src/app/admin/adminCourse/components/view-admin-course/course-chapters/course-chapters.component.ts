import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { ConfirmationBoxComponent } from 'src/app/theme/components/confirmation-box/confirmation-box.component';
import { AdminCourseService } from '../../../adminCourse.service';

@Component({
  selector: 'course-chapters',
  templateUrl: './course-chapters.component.html',
  styleUrls: ['./course-chapters.component.scss']
})
export class CourseChaptersComponent implements OnInit {

  @Input() courseData : any;
  
  private _dataSourceChapter: any;
  private _displayedColumnsChapter: string[] = [];

  @ViewChild('ContentPaginator', { read: MatPaginator, static: true }) paginatorChapter: MatPaginator;

  private _chapterData$ : Observable<any> = null;

  constructor(
    private globals : Globals,
    private translate: TranslateService,
    private router: Router,
    private service: AdminCourseService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes : SimpleChanges) : void {
    if(changes.courseData) {
      this._loadChapters();
    }
  }

  _loadChapters() : void {
    this._chapterData$ = this.service.getChapterByCourseId(this.courseInfo.courseId).pipe(
      tap((res : any) => {
        if (res.success) {
          this._dataSourceChapter = new MatTableDataSource(res.data);
          this._displayedColumnsChapter = ['chapterId', 'chapterName', 'actions'];
          this._dataSourceChapter.paginator = this.paginatorChapter;
        }
        this.filterChapterByCourse();
    }));
  }

  addChapter() {
    var path = "";
    if ( this.globals.getUserType() == "1") { path = 'superadmin/content/add'; } 
    else if (this.globals.getUserType() == "2") { path = 'admin/content/add'; }
    else if (this.globals.getUserType() == "3") { path = 'trainer/content/add'; } 
    else { path = 'employee/content/add'; }
    this.router.navigate([path, this.courseInfo.courseId], { skipLocationChange: false });
  }

  editChapter(row) {
    var path = "";
    if (this.globals.getUserType() == "1") { path = 'superadmin/content/edit'; }
    else if (this.globals.getUserType() == "2") { path = 'admin/content/edit'; } 
    else if (this.globals.getUserType() == "3") { path = 'trainer/content/edit'; }
    else { path = 'employee/content/edit'; }
    this.router.navigate([path, row.chapterId], { skipLocationChange: false });
  }

  deleteChapter(row) {
    let confirmDesc : string = this.translate.instant('dialog.DeleteContentSure');
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: row.chapterId, Action: false, Mes: confirmDesc },
      autoFocus: false
    });
    
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.service.deleteChapter(row.chapterId).pipe(take(1)).subscribe(res => {
          if (res.success) {
            this._loadChapters();
          }
        });
      }
    });
  }
  
  filterChapterByCourse() {
    this._dataSourceChapter.filterPredicate = function (data, filter: string): boolean {
      return (data.courseId == filter);
    };
    this._dataSourceChapter.filter = this.courseData.courseId;
  }

  get chapterData$() { return this._chapterData$; }
  get userInfo() { return this.globals.userInfo; };
  get webURL() { return this.globals.WebURL; }
  get companyInfo() { return this.globals.companyInfo; };

  get courseInfo() { return this.courseData.courseInfo; }
  get dataSourceChapter() { return this._dataSourceChapter; }
  get displayedColumnsChapter() { return this._displayedColumnsChapter; }

  
}
