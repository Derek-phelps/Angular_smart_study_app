import { Component, ViewChild } from '@angular/core';
import { QuestionService } from '../../question.service';
import { UploadInput } from 'ngx-uploader';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
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
  selector: 'questionEdit',
  templateUrl: './questionEdit.html',
  styleUrls: ['../../question.component.scss']
})
export class QuestionEdit {
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
  private qustionImg: File;
  public strQuestionImage = "";
  public DisableButton = false;
  deleteOptions = [];

  constructor(public _globals: Globals, public router: Router, private route: ActivatedRoute, protected service: QuestionService, private translate: TranslateService, private formBuilder: FormBuilder) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.route.params.subscribe(params => {
      this.translate.get('question.Image').subscribe(value => { this.strQuestionImage = value; });
      this.loadEditQuestion(params['id']);
      // In a real app: dispatch action to load the details here.
    });
    this.service.getCourse(this._globals.companyInfo.companyId)
      .subscribe(Product => this.loadCourseAns(Product), error => this.errorMessage = <any>error);

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
  loadEditQuestion(QusId) {
    this.service.getByQuestionById(QusId)
      .subscribe(data => this.setValue(data), error => this.errorMessage = <any>error);
  }
  setValue(data) {
    this.service.getChaptersBYCourseId(data.data[0].CourseId)
      .subscribe(Chapter => this.loadChapterAns(Chapter), error => this.errorMessage = <any>error);
    var Opt = [];
    for (var i = 0; i < data.data[0].QuestionOption.length; i++) {
      this.addNewAns();

      var res = data.data[0].CorrectAnswerOptionNumber.split("@");
      Opt.push({
        "QuestionOptionID": data.data[0].QuestionOption[i].QuestionOptionId,
        "CurAns": res.includes(data.data[0].QuestionOption[i].QuestionOptionIndex),
        "ans": data.data[0].QuestionOption[i].QuestionOptionName
      });
    }
    this.QusForm.setValue({
      'CourceId': data.data[0].CourseId,
      'ChapterId': data.data[0].chapterId,
      'IsTraning': data.data[0].IsTraning,
      'qustionText': data.data[0].Question,
      'qustionImg': data.data[0].QuestionImg,
      'Explanation': data.data[0].Explanation,
      'answers': Opt,
      'questionId': data.data[0].questionId
    });
    if (data.data[0].QuestionImg && data.data[0].QuestionImg != "") {
      //this.defaultPicture = this._globals.WebURL + '/' + data.data[0].QuestionImg;
      this.profile = this._globals.WebURL + '/' + data.data[0].QuestionImg;
    }

  }
  loadCourseAns(Product) {
    this.CourseOpt = Product.data;
  }
  getChangeProduct() {
    this.service.getChaptersBYCourseId(this.QusForm.value.CourceId)
      .subscribe(Chapter => this.loadChapterAns(Chapter), error => this.errorMessage = <any>error);
  }
  loadChapterAns(Chapter) {
    var arr: Array<any> = [];
    if (Chapter.success) {
      this.ChapterOpt = Chapter.data;
    } else {
      this.ChapterOpt = [];
    }
  }
  ngOnInit() {
    this.QusForm = this.formBuilder.group({
      'CourceId': ["", Validators.required],
      'ChapterId': [""],
      'IsTraning': ["1"],
      'qustionText': [null, Validators.required],
      'qustionImg': [null],
      'Explanation': [null],
      'answers': this.formBuilder.array([], validateAnswers),
      'questionId': [null, Validators.required]
    })
  }
  public addNewAns() {
    const control = <FormArray>this.QusForm.controls['answers'];
    control.push(this.initAddress());
  }
  removeOption(i) {
    const control = <FormArray>this.QusForm.controls['answers'];
    if (control.at(i).value.QuestionOptionID != null) {
      this.deleteOptions.push(control.at(i).value.QuestionOptionID);
    }
    control.removeAt(i);
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

    this.service.edit(this.QusForm.value, this.deleteOptions).subscribe((data) => {
      if (data.success) {
        this.translate.get('alert.SaveQuestionSuccess').subscribe(value => { alert(value); });
        // this.questionImg.removePicture();

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
        // TODO: Message something to user here
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