import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/common/auth-guard.service';

@Component({
  selector: 'question-container',
  templateUrl: './question-container.component.html',
  styleUrls: ['./question-container.component.scss']
})
export class QuestionContainerComponent implements OnInit {

  private _questionnaireForm : FormGroup = this.formBuilder.group({
    questions : new FormArray([]),
  });

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
    this.createQuestion();
  }

  createQuestion() : void {

    /* Iterate all existing questions and check if they are valid.
       if all are valid, a new question can be added. The check stops at 
       the first invalid question and opens it. This is fu**king ugly, 
       but FormArrays don't support forEach syntax.
    */
    let index : number = 0;
    for(let subChapter of this.questions.controls) {
      subChapter.markAllAsTouched();      
      if(subChapter.invalid) { this._openedQuestion = index; return; }
      index++;
    }

    this.questions.push( this.formBuilder.group({
      text : new FormControl('', [Validators.required]),
      image : new FormControl(''),
      answers : this.createAnswer(),
    }));
    
    this._openedQuestion = this.questions.length -1;
  }

  createAnswer() : FormArray {
    let formArray : FormArray = new FormArray([]);
    formArray.push(this.formBuilder.group({
      text : new FormControl('', [Validators.required]),
      isCorrect : new FormControl(false, []),
    }));
    return formArray;
  }

  addAnswer(pos : number) {
    this.answersForQuestion(pos).push(this.createAnswer());
  }

  answersForQuestion(pos : number) : FormArray {
    return this.questions.at(pos).get('answers') as FormArray;
  }

  get questionnaireForm() : FormGroup { return this._questionnaireForm; }
  get questions() : FormArray { return this._questionnaireForm.get('questions') as FormArray; }
  get openedQuestion() : number { return this._openedQuestion; }

}
