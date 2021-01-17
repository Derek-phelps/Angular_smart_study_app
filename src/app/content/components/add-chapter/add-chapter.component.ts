import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UploadInput } from 'ngx-uploader';
import { from, iif, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, take, tap, toArray } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { ConfirmationBoxComponent } from 'src/app/theme/components/confirmation-box/confirmation-box.component';
import { ContentService } from '../../content.service';
import { QuestionService } from '../../question.service';
import { QuestionContainerComponent } from '../question-container/question-container.component';

@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.scss']
})
export class AddChapterComponent implements OnInit {

  private _addChapterForm : FormGroup = this.formBuilder.group({
    chapterName : new  FormControl('', [Validators.required]),
    chapterId : new FormControl('', []),
    courseId : new FormControl(-1, []),
    isOffline : new FormControl(false, []),
    subChapter : new FormArray([]),
    ignoreOrder : new FormControl(false, []),
    questions : new FormArray([]),
  });


  private _openedSubChapter : number = -1;
  private _nextSubChapterId : number = 0;

  private _deleteChaptersOnSave : number[] = [];
  private _deleteQuestionsOnSave : number[] = [];

  private _preventSave : boolean = false;

  private _defaultImage = '/assets/img/theme/add-image.png';

  @ViewChild(QuestionContainerComponent) questionComponent : QuestionContainerComponent;
  @ViewChild(MatTabGroup) tabGroup : MatTabGroup;

  constructor(
    private formBuilder : FormBuilder,
    private translate : TranslateService,
    private globals : Globals,
    private service : ContentService,
    private questionSerivce : QuestionService,
    private router : Router,
    private route : ActivatedRoute,
    public dialog: MatDialog,
  ) {
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;


   }

  ngOnInit(): void {
    if(this.route.snapshot.url[0].path == 'add') {
      this._addChapterForm.patchValue({ courseId: this.route.snapshot.params.id });
      this.addSubChapter();
    }

    else {
      let chapterId : number = this.route.snapshot.params.id;
      this.service.getChapterById(chapterId).pipe(take(1)).subscribe(
        result => {
          this._addChapterForm.patchValue(result.data[0])
          result.data[0]['SubChapter'].forEach(subChap => {
            if(subChap.Sc_index == null) { subChap.Sc_index = this._nextSubChapterId; }
            this.addSubChapter();
            this.subChapter.at(this._openedSubChapter).patchValue(subChap);
            this.subChapter.at(this._openedSubChapter).patchValue({ ChapterTxt : subChap.chapterTxt });
          })
          
          this.questionComponent.chapterId = result.data[0]['chapterId']
          //TODO: fetch questions.
      });
    }
    
  }

  addSubChapter() : void {
    if(!this.checkSubChapters()) { return; }

    this.subChapter.push( this.formBuilder.group({
      subChapterTitle : new FormControl('', [Validators.required]),
      isVideo : new FormControl('3', []),
      ChapterTxt : new FormControl('', [Validators.required]),
      FilePath : new FormControl("", []),
      allowDownload : new FormControl(true, []),
      subChapterId : new FormControl(null, []),
      Sc_index : new FormControl(this._nextSubChapterId, [])
    }));
    this._nextSubChapterId++;
    this._openedSubChapter = this.subChapter.length -1;
  }

  reorder(event : CdkDragDrop<any[]>) : void {
    let draggedSubChapter: FormGroup = this.subChapter.at(event.previousIndex) as FormGroup;
    this.subChapter.removeAt(event.previousIndex);
    this.subChapter.insert(event.currentIndex, draggedSubChapter);

    // apply new indices
    this._fixIndices();
  }

  deleteSubChapter(index : number) : void {
    let description: string = this.translate.instant('chapter.DeleteSubChapterDesc');
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { Action: false, Mes: description },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      take(1),
      tap( result => {
        let subChapterId : number = this.subChapter.at(index).get('subChapterId').value;
        if( subChapterId != null) { this._deleteChaptersOnSave.push(subChapterId); }
        this.subChapter.removeAt(index);
        this._fixIndices();

      })
    ).subscribe(
      res => true
    );
  }

  private _fixIndices() : void {
    let newIndex : number = 0;
    for(let subChapter of this.subChapter.controls) {     
      subChapter.get('Sc_index').setValue(newIndex);
      newIndex++;
    }
    this._nextSubChapterId = newIndex; 
  }

  saveChapter() : void {
    if(!this.checkSubChapters()) { this.tabGroup.selectedIndex = 0; return; }
    if(!this.questionComponent.checkQuestions()) { this.tabGroup.selectedIndex = 1; return; }
    if(!this.addChapterForm.valid) { return; }

    

    let operation : Observable<any> = null;
    if(this.route.snapshot.url[0].path == 'add') { 
      
      operation = this.service.add(this._addChapterForm.value).pipe(
        take(1),
        tap(response => this.questionComponent.chapterId = response['insert_id']),
        switchMap( result => from(this.questions.value)),
        //TODO:  upload images
        //tap(question => this.questionSerivce.add(questions)),
        tap(question => console.log(question)),
        toArray(),
      ); 
    }
    else { 
      operation = this.service.edit(this._addChapterForm.value).pipe(
        take(1),
        switchMap( result => from(this._deleteChaptersOnSave)),
        mergeMap( id => this.service.deleteSubchapter(id)),
        tap( result => console.log(result)),
        toArray(),
        switchMap( result => from(this.questions.value)),
        //TODO:  upload images
        //tap(question => this.questionSerivce.edit(question, {})),
        tap(question => console.log(question)),
        toArray(),
        ); 
    }

    let description: string = this.translate.instant('chapter.SaveChapterDesc');
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { Action: false, Mes: description },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(
      res => {
        if(res == false) { return; }
        operation.subscribe(
          _ => {
            let path : string = "";
            if (this.globals.getUserType() == "1") { path = 'superadmin/course/view'; } 
            else if (this.globals.getUserType() == "2") { path = 'admin/course/view'; }
            else if (this.globals.getUserType() == "3") { path = 'trainer/course/view'; }
            else { path = 'employee/course/view'; }
            
            this.router.navigate([path, this._addChapterForm.value.courseId, 2], { skipLocationChange: false });
          });
      });
  }

  checkSubChapters() : boolean {
    /* Iterate all existing sub chapters and check if they are valid.
      if all are valid, a new chapter can be added. The check stops at 
      the first invalid sub chapter and opens it. This is fu**king ugly, 
      but FormArrays don't support forEach syntax.
    */
    let index : number = 0;
    for(let subChapter of this.subChapter.controls) {
      subChapter.markAllAsTouched();      
      if(subChapter.invalid) { this._openedSubChapter = index; return false; }
      index++;
    }

    return true;
  }

  setOpenedPanel(pos : number) {
    this._openedSubChapter = pos;
  }

  checkPanelClosed(pos : number) {
    if(this._openedSubChapter == pos) { this._openedSubChapter = -1;}
  }

  deleteQuestion(id : number) {
    this._deleteQuestionsOnSave.push(id);
  }

  imgUploaded(event, i : number) {
    console.log(event);
    this.preventSave = false;
    // if (e.success) {
    //   this.EmpForm.controls['courseImg'].setValue(e.UserImg);
    // } else {
    //   this.profile = "";
    // }

    // this.DisableButton = false;
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

  get uploaderOptions() : UploadInput {
    return  {
      type: 'uploadAll',
      url: this.globals.APIURL + 'Company/userImgUpload?folderName=Course',
      method: 'POST',
      data: {}
    };
  }

  get addChapterForm() : FormGroup { return this._addChapterForm; }
  get chapterName() : FormControl { return this._addChapterForm.get('chapterName') as FormControl; }
  get subChapter() : FormArray { return this._addChapterForm.get('subChapter') as FormArray; }
  get openedSubChapter() : number { return this._openedSubChapter; }
  get questions() : FormArray { return this._addChapterForm.get('questions') as FormArray; }
  get defaultImage() : string { return this._defaultImage; }
  get preventSave() : boolean { return this._preventSave; }
  set preventSave(v : boolean) { this._preventSave = v; }
  
}
