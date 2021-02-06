import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable, of } from 'rxjs';
import { mergeMap, take, tap, toArray } from 'rxjs/operators';
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
  
  private _dataSourceChapter : MatTableDataSource<any> = null;
  private _displayedColumnsChapter: string[] = [];
  private _chapterData : Array<any> = [];
  private _showSaveOrderingButton : boolean = false;

  @ViewChild('ContentPaginator', { read: MatPaginator, static: true }) paginatorChapter: MatPaginator;

  private _chapterData$ : Observable<any> = null;

  constructor(
    private globals : Globals,
    private translate: TranslateService,
    private router: Router,
    private service: AdminCourseService,
    private dialog: MatDialog,
  ) { }

  ngOnChanges(changes : SimpleChanges) : void {
    if(changes.courseData) {
      this._loadChapters();
    }
  }

  ngOnInit(): void {
  }

  private _loadChapters() : void {
    this._chapterData$ = this.service.getChapterByCourseId(this.courseInfo.courseId).pipe(
      tap((res : any) => {
        if (res.success) {
          this._chapterData = res['data']
          this._dataSourceChapter = new MatTableDataSource(res.data);
          this._displayedColumnsChapter = ['chapterName', 'actions'];
          this._dataSourceChapter.paginator = this.paginatorChapter;
          this.filterChapterByCourse();
          this._showSaveOrderingButton = false;
        }
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

  reorder(event : CdkDragDrop<any[]>) : void {
    console.log(event);
    let draggesChapter: any = this.chapterData[event.previousIndex];
    this.chapterData.splice(event.previousIndex, 1);
    this.chapterData.splice(event.currentIndex, 0, draggesChapter);

    // // apply new indices
    this._fixIndices();
    this._showSaveOrderingButton = true;
  }

  saveChapter() {
    from(this.chapterData).pipe(
      mergeMap(chapter => this.service.editChapterOrder(chapter)),
      toArray(),
    ).subscribe(result => this._loadChapters())
  }

  private _fixIndices() : void {
    let newIndex : number = 0;
    this.chapterData.forEach( ch => ch['Ch_index'] = newIndex++);
    this._dataSourceChapter = new MatTableDataSource(this.chapterData);
  }

  get chapterData$() { return this._chapterData$; }
  get chapterData() { return this._chapterData; }
  get courseInfo() { return this.courseData.courseInfo; }
  get dataSourceChapter() { return this._dataSourceChapter; }
  get displayedColumnsChapter() { return this._displayedColumnsChapter; }
  get showSaveOrderingButton() : boolean { return this._showSaveOrderingButton; }

  
}
