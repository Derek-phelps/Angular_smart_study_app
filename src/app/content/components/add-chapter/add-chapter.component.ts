import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinner, Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { UploadInput } from 'ngx-uploader';
import { from, iif, Observable, of, Subscription, timer } from 'rxjs';
import { map, mergeMap, switchMap, take, tap, toArray } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { QuestionContainerComponent } from 'src/app/core/components/question-container/question-container.component';
import { QuestionService } from 'src/app/core/services/question.service';
import { ConfirmationBoxComponent } from 'src/app/theme/components/confirmation-box/confirmation-box.component';
import { ContentService } from '../../content.service';
import { ComponentCanDeactivate, PendingChangesGuardGuard } from '../../pending-changes-guard.guard';
import { FILE_TYPE_UTILS } from '../../../common/utils';

@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.scss']
})
export class AddChapterComponent implements OnInit, OnDestroy, PendingChangesGuardGuard {

  private _addChapterForm: FormGroup = this.formBuilder.group({
    title: new FormControl('', [Validators.required]),
    id: new FormControl('', []),
    courseId: new FormControl(-1, []),
    courseName: new FormControl('', []),
    subChapters: new FormArray([]),
    ignoreOrder: new FormControl(false, []),
    questions: new FormArray([]),
    index: new FormControl('', []),
  });


  private _openedSubChapter: number = -1;
  private _nextSubChapterId: number = 0;

  private _deleteChaptersOnSave: number[] = [];
  private _deleteQuestionsOnSave: number[] = [];

  private _preventSave: boolean = false;
  private _defaultImage = 'assets/img/theme/upload.png';

  private _saveInterval: number = 30000;
  private _saveSubscription: Subscription = null;



  @ViewChild(QuestionContainerComponent) questionComponent: QuestionContainerComponent;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private globals: Globals,
    private service: ContentService,
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private spinnerService: NgxSpinnerService
  ) {
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;
  }

  @HostListener('window:beforeunload')
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    if (!this.addChapterForm.pristine) {
      let description: string = this.translate.instant('chapter.PreventCloseDesc');
      this.spinnerService.hide();
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { Action: false, Mes: description },
        autoFocus: false
      });
      return dialogRef.afterClosed().pipe(
        tap(result => {
          if (result) { this.spinnerService.show(); localStorage.removeItem('currentCourse'); }
        })
      );
    }
    else { return true; }
  }

  ngOnInit(): void {
    if (this.route.snapshot.url[0].path == 'add') {
      this._addChapterForm.patchValue({ courseId: this.route.snapshot.params.id });
      let candidateChapter: Object = null;
      try {
        let candidate: string = localStorage.getItem('currentCourse');
        if (candidate === null) { this.addSubChapter(false); }
        else {

          let description: string = this.translate.instant('chapter.LoadPreSavedDesc');
          const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
            width: '400px',
            data: { Action: false, Mes: description },
            autoFocus: false
          });

          dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
            if (result) {
              candidateChapter = JSON.parse(candidate);
              candidateChapter['subChapters'].forEach(_ => this.addSubChapter(false));
              this._addChapterForm.patchValue(candidateChapter);
              this.questionComponent.patchValue(candidateChapter['questions']);
            }
            else { this.addSubChapter(false); }
          });
        }
      }
      catch (err) { localStorage.removeItem('currentCourse') }
    }

    else {
      let chapterId: number = this.route.snapshot.params.id;
      //this.service.getChapterByIdFixed(chapterId).pipe(take(1)).subscribe( res => true );
      this.service.getChapterByIdFixed(chapterId).pipe(
        tap(result => {
          result.subChapters.forEach(_ => this.addSubChapter(false));
          this._addChapterForm.patchValue(result);

          this.subChapters.controls.forEach(subChapter => {
            if (!FILE_TYPE_UTILS.isFileViewable(subChapter.value.filePath)) {
              if (subChapter.value.isDownloadable) { subChapter.get('isDownloadable').disable(); }
            }
          });

          //this._addChapterForm.markAsPristine();
          // result.subChapters.forEach(subChap => {
          //   if(subChap.id == null) { subChap.index = this._nextSubChapterId; }
          //   this.addSubChapter();
          //   this.subChapters.at(this._openedSubChapter).patchValue(subChap);
          //   //this.subChapters.at(this._openedSubChapter).patchValue({ ChapterTxt : subChap.chapterTxt });
          // })

          //this.questionComponent.chapterId = result.id;
          //TODO: fetch questions.
        }),
        switchMap(_ => this.questionService.getAllQuestionsByChapter(this.courseId.value, this.chapterId.value)),
        // tap(questions => console.log(questions)),
        tap(questions => this.questionComponent.patchValue(questions))
      ).pipe(take(1)).subscribe(result => true);
    }

    this._saveSubscription = timer(this._saveInterval, this._saveInterval).pipe(
      tap(_ => localStorage.setItem('currentCourse', JSON.stringify(this._addChapterForm.getRawValue())))
    ).subscribe(
      _ => this.snackbar.open(this.translate.instant('chapter.Saved'), '', { duration: 1000 })
    );
  }

  ngOnDestroy(): void {
    if (this._saveSubscription != null) { this._saveSubscription.unsubscribe() }
  }

  addSubChapter(validate: boolean = true): void {
    if (validate && !this.checkSubChapters()) { return; }

    this.subChapters.push(this.formBuilder.group({
      id: new FormControl(null, []),
      title: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
      chapterId: new FormControl('', []),
      filePath: new FormControl("", []),
      isDownloadable: new FormControl(false, []),
      index: new FormControl(this._nextSubChapterId, [])
    }));
    this._nextSubChapterId++;
    this._openedSubChapter = this.subChapters.length - 1;

    //if(!validate) { this._addChapterForm.markAsPristine(); }
  }

  reorder(event: CdkDragDrop<any[]>): void {
    let draggedSubChapter: FormGroup = this.subChapters.at(event.previousIndex) as FormGroup;
    this.subChapters.removeAt(event.previousIndex);
    this.subChapters.insert(event.currentIndex, draggedSubChapter);

    // apply new indices
    this._fixIndices();
  }

  deleteSubChapter(index: number): void {
    let description: string = this.translate.instant('chapter.DeleteSubChapterDesc');
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { Action: false, Mes: description },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      take(1),
      tap(result => {
        let subChapterId: number = this.subChapters.at(index).get('id').value;
        if (subChapterId != null) { this._deleteChaptersOnSave.push(subChapterId); }
        this.subChapters.removeAt(index);
        this._fixIndices();

      })
    ).subscribe(
      res => true
    );
  }

  private _fixIndices(): void {
    let newIndex: number = 0;
    for (let subChapter of this.subChapters.controls) {
      subChapter.get('index').setValue(newIndex);
      newIndex++;
    }
    this._nextSubChapterId = newIndex;
  }

  saveChapter(): void {
    if (!this.checkSubChapters()) { this.tabGroup.selectedIndex = 0; return; }
    if (!this.questionComponent.checkQuestions()) { this.tabGroup.selectedIndex = 1; return; }
    if (!this.addChapterForm.valid) { return; }

    let operation: Observable<any> = null;
    if (this.route.snapshot.url[0].path == 'add') {

      operation = this.service.addFixed(this._addChapterForm.getRawValue()).pipe(
        tap(response => this.chapterId.setValue(response['insert_id'])),
        switchMap(result => from(this.questions.value)),
        tap(question => console.log(question)),
        mergeMap(question => this.questionService.addChapterQuestion(this.courseId.value, this.chapterId.value, question)),
        toArray(),
      );
    }
    else {
      operation = this.service.editFixed(this._addChapterForm.getRawValue()).pipe(
        switchMap(result => from(this._deleteChaptersOnSave)),
        mergeMap(id => this.service.deleteSubchapter(id)),
        toArray(),
        switchMap(_ => from(this._deleteQuestionsOnSave)),
        mergeMap(id => this.questionService.delete(id)),
        toArray(),
        switchMap(result => from(this.questions.value)),
        mergeMap((question: any) => iif(() => question.id === null,
          this.questionService.addChapterQuestion(this.courseId.value, this.chapterId.value, question),
          this.questionService.editChapterQuestion(this.courseId.value, this.chapterId.value, question))),
        toArray()
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
        if (res == false) { return; }
        operation.subscribe(
          _ => {
            let path: string = "";
            if (this.globals.getUserType() == "1") { path = 'superadmin/course/view'; }
            else if (this.globals.getUserType() == "2") { path = 'admin/course/view'; }
            else if (this.globals.getUserType() == "3") { path = 'trainer/course/view'; }
            else { path = 'employee/course/view'; }

            localStorage.removeItem('currentCourse');
            this.addChapterForm.markAsPristine();
            this.router.navigate([path, this._addChapterForm.value.courseId, 2], { skipLocationChange: false });
          });
      });
  }

  checkSubChapters(): boolean {
    /* Iterate all existing sub chapters and check if they are valid.
      if all are valid, a new chapter can be added. The check stops at 
      the first invalid sub chapter and opens it. This is fu**king ugly, 
      but FormArrays don't support forEach syntax.
    */
    let index: number = 0;
    for (let subChapter of this.subChapters.controls) {
      subChapter.markAllAsTouched();
      if (subChapter.invalid) { this._openedSubChapter = index; return false; }
      index++;
    }

    return true;
  }

  setOpenedPanel(pos: number) {
    this._openedSubChapter = pos;
  }

  checkPanelClosed(pos: number) {
    if (this._openedSubChapter == pos) { this._openedSubChapter = -1; }
  }

  deleteQuestion(id: number) {
    this._deleteQuestionsOnSave.push(id);
  }

  fileUploaded(event, i: number) {
    if (event.success && event.data) { this.subChapters.controls[i].get('filePath').setValue('API/img/Course/' + event.data); }
    else { this.subChapters.controls[i].get('filePath').setValue(''); }

    if (FILE_TYPE_UTILS.isFileViewable(event.data)) {
      this.subChapters.controls[i].get('isDownloadable').setValue(false);
      this.subChapters.controls[i].get('isDownloadable').enable();
    } else {
      this.subChapters.controls[i].get('isDownloadable').setValue(true);
      this.subChapters.controls[i].get('isDownloadable').disable();
    }

    this.preventSave = false;
  }

  get quillModules(): Object {
    return {
      toolbar: [
        [{ header: [1, 2, 3] }],
        [{ 'font': [] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block'],
        ['video', 'link']
      ]
    }
  }

  get uploaderOptions(): UploadInput {
    return {
      type: 'uploadAll',
      url: this.globals.APIURL + 'Chapter/videoUpload',
      method: 'POST',
      data: {}
    };
  }

  get addChapterForm(): FormGroup { return this._addChapterForm; }
  get title(): FormControl { return this._addChapterForm.get('title') as FormControl; }
  get courseId(): FormControl { return this._addChapterForm.get('courseId') as FormControl; }
  get chapterId(): FormControl { return this._addChapterForm.get('id') as FormControl; }
  get subChapters(): FormArray { return this._addChapterForm.get('subChapters') as FormArray; }
  get openedSubChapter(): number { return this._openedSubChapter; }
  get questions(): FormArray { return this._addChapterForm.get('questions') as FormArray; }
  get defaultImage(): string { return this._defaultImage; }
  get preventSave(): boolean { return this._preventSave; }
  set preventSave(v: boolean) { this._preventSave = v; }

}
