import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { from, iif, Observable } from 'rxjs';
import { mergeMap, switchMap, take, toArray } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { QuestionContainerComponent } from 'src/app/core/components/question-container/question-container.component';
import { QuestionService } from 'src/app/core/services/question.service';
import { ConfirmationBoxComponent } from 'src/app/theme/components/confirmation-box/confirmation-box.component';
import { AdminCourseService } from '../../../adminCourse.service';

@Component({
  selector: 'course-test',
  templateUrl: './course-test.component.html',
  styleUrls: ['./course-test.component.scss']
})
export class CourseTestComponent implements OnInit {

  private _courseData : any = null;
  private _deleteQuestionsOnSave : Array<number> = [];

  private _courseTestForm : FormGroup = this.formBuilder.group({
    questions : new FormArray([]),
    ignoreOrder : new FormControl(false, [])
  });

  @Input() set courseData(data : any) { this._courseData = data['courseInfo']};
  @ViewChild(QuestionContainerComponent) questionComponent : QuestionContainerComponent;
  
  constructor(
    private formBuilder : FormBuilder,
    private translate : TranslateService,
    private globals : Globals,
    private questionService : QuestionService,
    private adminService: AdminCourseService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { 
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;
  }

  ngOnInit(): void {
    this.questionService.getAllCourseQuestions(this.courseData['courseId']).pipe(take(1)).subscribe(
      questions => {
        this.questionComponent.patchValue(questions);
        this.questionComponent.closeQuestions();
      })

    this.ignoreOrder.setValue(this.courseData['ignore_ordering'] == '1' ? true : false);
  }

  public deleteQuestion(id : number) : void {
    this._deleteQuestionsOnSave.push(id);
  }

  saveQuestions() : void {
    if(!this.questionComponent.checkQuestions()) { return; }

    let operation : Observable<any> = from(this.questions.value).pipe(
      mergeMap( (question : any) => iif( () => question.id === null, 
        this.questionService.addCourseQuestion(this.courseData['courseId'], question),
        this.questionService.editCourseQuestion(this.courseData['courseId'], question))),
      toArray(),
      switchMap( _ => from(this._deleteQuestionsOnSave)),
      mergeMap( id => this.questionService.delete(id)),
      toArray(),
      switchMap( _ => this.adminService.editCourseIgnoreOrder(this.courseData['courseId'], this.ignoreOrder.value))
      ); 

    let description: string = this.translate.instant('question.SaveQuestionsDesc');
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { Action: false, Mes: description },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(
      res => {
        if(res == false) { return; }
        operation.subscribe(
          _ => { 
            localStorage.removeItem('currentCourseQuestions');
            this.courseTestForm.markAsPristine();
            this.questionComponent.closeQuestions();
            this.snackbar.open(this.translate.instant('question.QuestionsSaved'), '', { duration: 3000 })
          });
      });
  }

  get courseData() : any { return this._courseData; }
  get courseTestForm() : FormGroup { return this._courseTestForm; }
  get ignoreOrder() : FormControl { return this._courseTestForm.get('ignoreOrder') as FormControl; }
  get questions() : FormArray { return this.courseTestForm.get('questions') as FormArray; }

}
