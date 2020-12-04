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
  selector: 'course-tests',
  templateUrl: './course-tests.component.html',
  styleUrls: ['./course-tests.component.scss']
})
export class CourseTestsComponent implements OnInit {

  @Input() courseData : any;

  @ViewChild('QuestionPaginator', { read: MatPaginator, static: true }) paginatorQuestion: MatPaginator;

  private _dataSourceQuestion : MatTableDataSource<any>;
  private _displayedColumnsQuestion: string[] = [];
  
  private _questionData$ : Observable<any> = null;
  
  constructor(
    private service: AdminCourseService,
    private globals: Globals,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChanges) : void {
    if(changes.courseData) {
      this._loadQuestions();
    }
  }

  private _loadQuestions() {
    this._dataSourceQuestion = new MatTableDataSource();

    this._questionData$ = this.service.getData(this.globals.companyInfo.companyId, this.courseInfo.courseId).pipe(
      tap( (result : any) => {
        this._dataSourceQuestion = new MatTableDataSource(result.data);
        this._displayedColumnsQuestion = ['QuestionImg', 'Question', 'chapterName', 'CorrectAnswerOptionNumber', 'actions'];
        this._dataSourceQuestion.paginator = this.paginatorQuestion;

        this._dataSourceQuestion.filterPredicate = function (data, filter: string) : boolean {
          return (data.CourseId == filter);
        };

        this.dataSourceQuestion.filter = this.courseInfo.courseId;
      })
    )
  }

  addTest() {
    
    var path = "";
    if (this.globals.getUserType() == "1") { path = 'superadmin/test/add/'; } 
    else if (this.globals.getUserType() == "2") { path = 'admin/test/add/'; }
    else if (this.globals.getUserType() == "3") { path = 'trainer/test/add/'; }
    else { path = 'employee/test/add/'; }
    this.router.navigate([path + this.courseInfo.courseId], { skipLocationChange: false });
  }

  editTest(row) {
    var path = "";
    if (this.globals.getUserType() == "1") { path = 'superadmin/test/edit/'; }
    else if (this.globals.getUserType() == "2") { path = 'admin/test/edit/'; } 
    else if (this.globals.getUserType() == "3") { path = 'trainer/test/edit/'; }
    else { path = 'employee/test/edit/'; }
    this.router.navigate([path + row.questionId], { skipLocationChange: false });
  }
 
  deleteTest(row) {
    let confirmDesc = this.translate.instant('dialog.DeleteQuestionSure');
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: row.questionId, Action: false, Mes: confirmDesc },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      this.service.deleteQuestion(row.questionId).pipe(take(1)).subscribe((res) => {
        if (res.success) { this._loadQuestions(); }
      });
    });
  }

  
  get questionData$() { return this._questionData$; }
  get courseInfo() { return this.courseData.courseInfo; }
  get dataSourceQuestion() { return this._dataSourceQuestion; }
  get displayedColumnsQuestion() { return this._displayedColumnsQuestion; }

  get webURL() { return this.globals.WebURL; }
}
