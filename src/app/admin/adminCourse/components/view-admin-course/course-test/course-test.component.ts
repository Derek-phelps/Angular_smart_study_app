import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { QuestionContainerComponent } from 'src/app/core/components/question-container/question-container.component';
import { QuestionService } from 'src/app/core/services/question.service';

@Component({
  selector: 'course-test',
  templateUrl: './course-test.component.html',
  styleUrls: ['./course-test.component.scss']
})
export class CourseTestComponent implements OnInit {

  private _courseData : any = null;
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
      questions => this.questionComponent.patchValue(questions)
    )
    this.ignoreOrder.setValue(this.courseData['ignore_ordering']);
  }

  public deleteQuestion($event) : void {
    console.log($event)
  }

  get courseData() : any { return this._courseData; }
  get courseTestForm() : FormGroup { return this._courseTestForm; }
  get ignoreOrder() : FormControl { return this._courseTestForm.get('ignoreOrder') as FormControl}

}
