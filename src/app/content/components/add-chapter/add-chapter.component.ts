import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/common/auth-guard.service';
import { QuestionContainerComponent } from '../question-container/question-container.component';

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
    questions : new FormArray([])
  });

  private _openedSubChapter : number = -1;

  @ViewChild(QuestionContainerComponent) questionComponent : QuestionContainerComponent;
  @ViewChild(MatTabGroup) tabGroup : MatTabGroup;

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
    if(!this.checkSubChapters()) { return; }

    this.subChapters.push( this.formBuilder.group({
      subChapterName : new FormControl('', [Validators.required]),
      data : new FormControl('', [Validators.required]),
      //fileAttachement : new FormControl('', [Validators.required])
    }));
    
    this._openedSubChapter = this.subChapters.length -1;
  }

  reorder(event : CdkDragDrop<any[]>) : void {
    const draggedSubChapter: FormGroup = this.subChapters.at(event.previousIndex) as FormGroup;
    this.subChapters.removeAt(event.previousIndex);
    this.subChapters.insert(event.currentIndex, draggedSubChapter);
  }

  saveChapter() : void {
    if(!this.checkSubChapters()) { this.tabGroup.selectedIndex = 0; return; }
    if(!this.questionComponent.checkQuestions()) { this.tabGroup.selectedIndex = 1; return; }

    let raw = this._addChapterForm.getRawValue();
    console.log(raw)
  }

  checkSubChapters() : boolean {
    /* Iterate all existing sub chapters and check if they are valid.
      if all are valid, a new chapter can be added. The check stops at 
      the first invalid sub chapter and opens it. This is fu**king ugly, 
      but FormArrays don't support forEach syntax.
    */
    let index : number = 0;
    for(let subChapter of this.subChapters.controls) {
      subChapter.markAllAsTouched();      
      if(subChapter.invalid) { this._openedSubChapter = index; return false; }
      index++;
    }

    return true;
  }


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

  get addChapterForm() : FormGroup { return this._addChapterForm; }
  get chapterName() : FormControl { return this._addChapterForm.get('chapterName') as FormControl; }
  get subChapters() : FormArray { return this._addChapterForm.get('subChapters') as FormArray; }
  get openedSubChapter() : number { return this._openedSubChapter; }
  get questions() : FormArray { return this._addChapterForm.get('questions') as FormArray; }
  
}
