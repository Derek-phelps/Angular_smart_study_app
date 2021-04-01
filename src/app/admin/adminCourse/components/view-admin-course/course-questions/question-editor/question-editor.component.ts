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
            min: this.question.questionSettings?.min,
            max: this.question.questionSettings?.max,
            textFirst: this.question.questionSettings?.textFirst,
            textLast: this.question.questionSettings?.textLast,
        });
      }

      onQuestionTypeChange(type: string) {
          this.question.questionType = type;
      }
    
      onSave() {
        const {value} = this.form;
        
        this.question.questionText = value.questionText;
        this.question.questionType = value.questionType;
        
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