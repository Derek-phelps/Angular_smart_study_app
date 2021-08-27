import { Component, ViewChild } from '@angular/core';
import { QuestionService } from '../../question.service';
import { UploadInput } from 'ngx-uploader';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl } from '@angular/forms';

function validateAnswers(c: FormControl) {
  var bCorrectAnswerSet = false;
  c.value.forEach(answer => {
    if (answer.CurAns) {
      bCorrectAnswerSet = true;
    }
  });

  if (!bCorrectAnswerSet) {
    return { 'not-valid': true };
  }

  return null;
}

@Component({
  selector: 'questionAdd',
  templateUrl: './questionAdd.html',
  styleUrls: ['../../question.component.scss']
})
export class QuestionAdd {
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile: String = "";
  public imgPath = ""
  @ViewChild('questionImg', { static: true }) questionImg: any;
  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Question',
    method: 'POST',
    data: {}
  };

  public QusForm: FormGroup;
  errorMessage: string;
  public processingLogin = false;
  public statusMessage = '';
  public CourseOpt: Array<any> = [];
  public ChapterOpt: Array<any> = [];
  public AnsCoun = 1;
  private isAdmin = false;
  public qustionImg: File;
  public strQuestionImage = "";
  public DisableButton = false;

  constructor(public router: Router, private route: ActivatedRoute, protected service: QuestionService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.translate.get('question.Image').subscribe(value => { this.strQuestionImage = value; });

    this.QusForm = this.formBuilder.group({
      'CourceId': ["", Validators.required],
      'ChapterId': [""],
      'IsTraning': ["1"],
      'qustionText': [null, Validators.required],
      'qustionImg': [null],
      'Explanation': [""],
      'answers': this.formBuilder.array([], validateAnswers),
    });

    this.route.params.subscribe(params => {
      this.QusForm.patchValue({ CourceId: params.id });

      this.service.getChaptersBYCourseId(this.QusForm.value.CourceId)
        .subscribe(Chapter => this.loadChapterAns(Chapter), error => this.errorMessage = <any>error);
    });

    // this.service.getCourse(this._globals.companyInfo.companyId)
    //   .subscribe(Product => this.loadCourseAns(Product), error => this.errorMessage = <any>error);

    function goodbye(e) {
      if (!e) e = window.event;
      //e.cancelBubble is supported by IE - this will kill the bubbling process.
      e.cancelBubble = true;
      e.returnValue = undefined; //This is displayed on the dialog

      //e.stopPropagation works in Firefox.
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    window.onbeforeunload = goodbye;
  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
  }
  // loadCourseAns(Product) {
  //   // console.log(Product);
  //   this.CourseOpt = Product.data;
  // }
  // getChangeProduct() {
  //   this.service.getChaptersBYCourseId(this.QusForm.value.CourceId)
  //     .subscribe(Chapter => this.loadChapterAns(Chapter), error => this.errorMessage = <any>error);
  // }
  loadChapterAns(Chapter) {
    var arr: Array<any> = [];
    if (Chapter.success) {
      this.ChapterOpt = Chapter.data;
    } else {
      this.ChapterOpt = [];
    }
  }
  ngOnInit() {
  }
  removeOption(i) {
    const control = <FormArray>this.QusForm.controls['answers'];
    control.removeAt(i);
  }
  public addNewAns() {
    const control = <FormArray>this.QusForm.controls['answers'];
    control.push(this.initAddress());
  }
  initAddress() {
    return this.formBuilder.group({
      'ans': [null, Validators.required],
      'CurAns': [false],
      'QuestionOptionID': [null]
    });
  }
  disableButton() {
    this.DisableButton = true;
  }
  imgUpload(e) {

    if (e.success) {
      this.QusForm.controls['qustionImg'].setValue(e.UserImg);
    } else {
      alert(e.data);
      //this.QusForm.controls['qustionImg'].setValue(e.UserImg);
    }

    this.DisableButton = false;
  }

  submitForm() {

    this.service.add(this.QusForm.value).subscribe((data) => {
      if (data.success) {
        // this.QusForm.reset();
        this.questionImg.removePicture();
        this.translate.get('alert.SaveQuestionSuccess').subscribe(value => { alert(value); });
        //this.router.navigate(['admin/course/view', this.QusForm.value.CourceId, 4], { skipLocationChange: false });
        var path = "";
        if (this._globals.getUserType() == "1") {
          path = 'superadmin/course/view';
        } else if (this._globals.getUserType() == "2") {
          path = 'admin/course/view';
        } else if (this._globals.getUserType() == "3") {
          path = 'trainer/course/view';
        } else {
          path = 'employee/course/view';
        }
        this.router.navigate([path, this.QusForm.value.CourceId, 3], { skipLocationChange: false });
      } else {
        // TODO: Message user something here!
      }
    });
  }
  cancel() {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/course/view';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/course/view';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/course/view';
    } else {
      path = 'employee/course/view';
    }
    this.router.navigate([path, this.QusForm.value.CourceId, 3], { skipLocationChange: false });
  }
}