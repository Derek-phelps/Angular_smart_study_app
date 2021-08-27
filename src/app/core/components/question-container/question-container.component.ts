import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take, tap } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { ConfirmationBoxComponent } from 'src/app/theme/components/confirmation-box/confirmation-box.component';



export function atLeastOneCorrectValidator() : ValidatorFn {
  return function validate(answers : FormArray) {
    for(let answer of answers.controls) {
      let isCorrect : boolean = answer.get('isCorrect').value;
      if(isCorrect) { return null; }
    }

    return { atLeastOneCorrectRequired : true }
  }
}

@Component({
  selector: 'question-container',
  templateUrl: './question-container.component.html',
  styleUrls: ['./question-container.component.scss']
})
export class QuestionContainerComponent implements OnInit {

  private _parentFormGroup : FormGroup = null;
  @Output() questionDeleted : EventEmitter<number> = new EventEmitter<number>();

  private _openedQuestion : number = -1;
  private _nextQuestionId : number = 0;

  constructor(
    private formBuilder : FormBuilder,
    private controlContainer : ControlContainer,
    private translate: TranslateService,
    private globals: Globals,
    public dialog: MatDialog,
  ) {
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;
   }

  ngOnInit(): void {
    this._parentFormGroup = this.controlContainer.control as FormGroup;
  }

  public patchValue(questions : Array<any>) : void {
    questions.forEach(q => {
      this.addQuestion(false);
      q.answers.forEach(a => {
        this.addAnswer(this._openedQuestion);
      })
    });
    this.questions.patchValue(questions);
  }

  public closeQuestions() : void {
    this._openedQuestion = -1;
  }

  addQuestion(validate : boolean = true) : void {
    if(validate && !this.checkQuestions()) { return; }

    this.questions.push( this.formBuilder.group({
      id : new FormControl(null, []),
      text : new FormControl('', [Validators.required]),
      imagePath : new FormControl('', []),
      explanation : new FormControl('', []),
      index : new FormControl(this._nextQuestionId, []),
      answers : new FormArray([], [atLeastOneCorrectValidator()]),
      deleteOptions : new FormControl([], [])
    }));
    
    this._openedQuestion = this.questions.length -1;
  }

  deleteQuestion($event, pos : number) {
    $event.stopPropagation();

    let description: string = this.translate.instant('question.DeleteDesc');
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { Action: false, Mes: description },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      take(1),
      tap( result => {
        if(result) {
          let questionId : number = this.questions.at(pos).get('id').value;
          if( questionId != null) { this.questionDeleted.emit(questionId); }
          this.questions.removeAt(pos);
          this._fixIndices();
          this.parentForm.markAsDirty();
        }
      })
    ).subscribe(
      res => true
    );
  }

  private _fixIndices() : void {
    let newIndex : number = 0;
    for(let subChapter of this.questions.controls) {     
      subChapter.get('index').setValue(newIndex);
      newIndex++;
    }
    this._nextQuestionId = newIndex; 
  }

  createAnswer() : FormGroup {
    return this.formBuilder.group({
      text : new FormControl('', [Validators.required]),
      imagePath : new FormControl('', []),
      isCorrect : new FormControl(false, []),
      id : new FormControl(null, []),
      index : new FormControl(0, []),
    });
  }

  checkQuestions() : boolean {
    /* Iterate all existing questions and check if they are valid.
       if all are valid, a new question can be added. The check stops at 
       the first invalid question and opens it. This is fu**king ugly, 
       but FormArrays don't support forEach syntax.
    */
   let index : number = 0;
   for(let question of this.questions.controls) {
     question.markAllAsTouched();      
     if(question.invalid) { this._openedQuestion = index; return false; }
     index++;
   }
   return true;
  }

  addAnswer(pos : number) {
    this.answersForQuestion(pos).push(this.createAnswer());
  }

  reorder(event : CdkDragDrop<any[]>) : void {
    const draggedSubChapter: FormGroup = this.questions.at(event.previousIndex) as FormGroup;
    this.questions.removeAt(event.previousIndex);
    this.questions.insert(event.currentIndex, draggedSubChapter);

    this._fixIndices();
    this.parentForm.markAsDirty();
  }

  answersForQuestion(pos : number) : FormArray {
    return this.questions.at(pos).get('answers') as FormArray;
  }

  setOpenedPanel(pos : number) {
    this._openedQuestion = pos;
  }

  checkPanelClosed(pos : number) {
    if(this._openedQuestion == pos) { this._openedQuestion = -1;}
  }

  get openedQuestion() : number { return this._openedQuestion; }
  get parentForm() : FormGroup { return this._parentFormGroup; }
  get ignoreOrder() : FormControl { return this.parentForm.get('ignoreOrder') as FormControl; }
  get questions() : FormArray { return this.parentForm.get('questions') as FormArray; }

}
