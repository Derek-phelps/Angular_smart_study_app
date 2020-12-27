import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/common/auth-guard.service';
import { ImageChangedEvent } from '../image-chooser/image-chooser.component';



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

  @Input() form : FormGroup = this.formBuilder.group({});
  @Input() questions : FormArray = new FormArray([]);

  private _openedQuestion : number = -1;

  constructor(
    private formBuilder : FormBuilder,
    private translate: TranslateService,
    private globals: Globals
  ) {
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;
   }

  ngOnInit(): void {
    //this.createQuestion();
  }

  createQuestion() : void {
    if(!this.checkQuestions()) { return; }

    this.questions.push( this.formBuilder.group({
      text : new FormControl('', [Validators.required]),
      image : new FormControl('', []),
      answers : new FormArray([this.createAnswer()], [atLeastOneCorrectValidator()]),
    }));
    
    this._openedQuestion = this.questions.length -1;
  }

  createAnswer() : FormGroup {
    return this.formBuilder.group({
      text : new FormControl('', [Validators.required]),
      image : new FormControl('', []),
      isCorrect : new FormControl(false, []),
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
  }

  answersForQuestion(pos : number) : FormArray {
    return this.questions.at(pos).get('answers') as FormArray;
  }

  questionImageChanged(question : number, event : ImageChangedEvent) : void {
    this.questions.at(question).get('image').setValue(event.data);
  }

  answerImageChanged(question : number, answer : number, event : ImageChangedEvent) : void {
    let answerArray : FormArray = this.questions.at(question).get('answers') as FormArray;
    answerArray.at(answer).get('image').setValue(event.data);
  }

  get openedQuestion() : number { return this._openedQuestion; }

}
