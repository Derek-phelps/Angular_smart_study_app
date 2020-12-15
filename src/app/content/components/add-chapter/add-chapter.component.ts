import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.scss']
})
export class AddChapterComponent implements OnInit {

  private _addChapterForm : FormGroup = this.formBuilder.group({
    chapterName : new  FormControl('', [Validators.required]),
    course : new FormControl('', [Validators.required]),
    subChapters : new FormArray([]),
    subModels : new FormArray([]),
    
  })
  constructor(
    private formBuilder : FormBuilder,
  ) { }

  ngOnInit(): void {
  }

}
