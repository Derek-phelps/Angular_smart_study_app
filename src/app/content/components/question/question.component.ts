import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/common/auth-guard.service';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  
  private _parentFormGroup: FormGroup = null;
  private _nextAnswerIndex = 0;

  constructor(
    private formBuilder : FormBuilder,
    private controlContainer : ControlContainer,
    private translate: TranslateService,
    private globals: Globals,
  ) { 
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;
  }

  ngOnInit(): void {
    this._parentFormGroup = this.controlContainer.control as FormGroup;
  }

  addAnswer() : void {
    this.answers.push(this.formBuilder.group({
      text : new FormControl('', [Validators.required]),
      imagePath : new FormControl('', []),
      isCorrect : new FormControl(false, []),
      id : new FormControl(null, []),
      index : new FormControl(this._nextAnswerIndex++, []),
    }));

    this._fixIndices();
  }

  private _fixIndices() : void {
    let newIndex : number = 0;
    for(let answer of this.answers.controls) {     
      answer.get('index').setValue(newIndex);
      newIndex++;
    }
    this._nextAnswerIndex = newIndex; 
  }

  

  get parentForm() : FormGroup { return this._parentFormGroup; }
  get answers() : FormArray { return this.parentForm.get('answers') as FormArray; }
}
