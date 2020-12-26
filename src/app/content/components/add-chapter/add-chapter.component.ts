import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/common/auth-guard.service';

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
  });

  private _openedSubChapter : number = -1;

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
    this.addSubChapter();
  }

  addSubChapter() : void {

    /* Iterate all existing sub chapters and check if they are valid.
       if all are valid, a new chapter can be added. The check stops at 
       the first invalid sub chapter and opens it. This is fu**king ugly, 
       but FormArrays don't support forEach syntax.
    */
    let index : number = 0;
    for(let subChapter of this.subChapters.controls) {
      subChapter.markAllAsTouched();      
      if(subChapter.invalid) { this._openedSubChapter = index; return; }
      index++;
    }

    this.subChapters.push( this.formBuilder.group({
      subChapterName : new FormControl('', [Validators.required]),
      data : new FormControl('', [Validators.required]),
      //fileAttachement : new FormControl('', [Validators.required])
    }));
    
    this._openedSubChapter = this.subChapters.length -1;
  }


  get addChapterForm() : FormGroup { return this._addChapterForm; }
  get chapterName() : FormControl { return this._addChapterForm.get('chapterName') as FormControl; }
  get subChapters() : FormArray { return this._addChapterForm.get('subChapters') as FormArray; }
  get openedSubChapter() : number { return this._openedSubChapter; }
  get quillModules() : Object {
    return {
      toolbar : [
        [{header : [1, 2, 3] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block'],
        ['video', 'link']
      ]
    }
  }
}
