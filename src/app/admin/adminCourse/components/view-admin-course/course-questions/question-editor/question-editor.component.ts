import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { Question } from "src/app/admin/adminCourse/adminCourse.service";

@Component({
    selector: 'question-editor',
    templateUrl: './question-editor.component.html',
    styleUrls: ['./question-editor.component.scss']
  })
  export class QuestionEditorComponent implements OnInit {

      @Input() question: Question;
      @Output() save = new EventEmitter<Question>();
      @Output() cancel = new EventEmitter();

      form = this.fb.group({
        questionText: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
        questionType: [null, Validators.required],
        mandatory: [false],
        min: [null, Validators.required],
        max: [null, Validators.required],
        textFirst: [null],
        textLast: [null],
      });
    
      constructor(private fb: FormBuilder) {}

      ngOnInit() {
        this.form.patchValue({ 
            questionText: this.question.questionText,
            questionType: this.question.questionType,
            mandatory: this.question.mandatory === '1',
            min: this.question.questionSettings?.min,
            max: this.question.questionSettings?.max,
            textFirst: this.question.questionSettings?.textFirst,
            textLast: this.question.questionSettings?.textLast,
        });
        this.onQuestionTypeChange(this.question.questionType);
      }

      onQuestionTypeChange(type: string) {
        this.question.questionType = type;

        if (type === 'scale') {
            this.form.controls['min'].enable();
            this.form.controls['max'].enable();
        } else {
            this.form.controls['min'].disable();
            this.form.controls['max'].disable();
        }
      }
    
      onSave() {
        const {value} = this.form;
        
        this.question.questionText = value.questionText;
        this.question.questionType = value.questionType;
        this.question.mandatory = value.mandatory ? '1' : '0';
        
        if (value.questionType === 'text') {
            delete this.question.questionSettings; // no settings
        } else if (value.questionType === 'scale') {
            this.question.questionSettings = {
                min: value.min,
                max: value.max,
                textFirst: value.textFirst,
                textLast: value.textLast,
            };
        }
        
        this.save.next(this.question);
      }

  }