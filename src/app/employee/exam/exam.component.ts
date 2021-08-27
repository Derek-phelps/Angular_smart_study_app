import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { ExamService } from './exam.service';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Routes } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import { GlobalService } from '../../theme/services/global.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'exam',
  templateUrl: './exam.html',
  styleUrls: ['./exam.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(1000))
    ])
  ]
})
export class Exam implements OnInit {

  myForm: FormGroup;
  ChapterId = 0;
  CurrentQus = 0;
  currentChpInfo: any;
  //selectedItem: any;
  indexNo = 0;
  QustionList: any = [];
  selectIndex: any;
  nextSub = 0;
  foundVal = 0;
  // isAns = false;
  currentCourseId = 0;
  public emp_courseId: string;
  public PAGES_Sub_MENU = [];
  public sidebarToggle = true;
  public DivWidth = "";
  public Divheight = "";
  fadeIn = false;
  strMokEx = "";

  // @ViewChildren(MatCheckbox) checkBoxes = new QueryList<MatCheckbox>();

  constructor(public _globalService: GlobalService, public _globals: Globals, private builder: FormBuilder, private route: ActivatedRoute,
    public router: Router, protected service: ExamService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private translate: TranslateService) {

    this.spinner.show();
    this._globals.isEmpReading = true;

    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.sidebarToggle = this._globals.sidebarToggle;

    this.translate.get('course.MockTest').subscribe(value => { this.strMokEx = value; });
    var obj = this;
    this.myForm = builder.group({
      'Ans': this.builder.array([
      ])
    });

    if (this.sidebarToggle) {
      this.DivWidth = (window.innerWidth - 250) + "px";
    } else {
      this.DivWidth = window.innerWidth + "px";
    }
    this.Divheight = (window.innerHeight - 80) + "px";
    this.fadeIn = true;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {

      // console.log(params)
      this.ChapterId = params.id;
      this.emp_courseId = params.empCourseId;
      // setTimeout(function () {
      //   obj.loadExamQus();
      //   obj._sidebarToggle();
      // }, 100);
      this.loadExamQus();
      this._sidebarToggle();

    });
  }
  public _sidebarToggle() {

    this._globalService.data$.subscribe(data => {
      if (data.ev === 'sidebarToggle') {
        this.sidebarToggle = data.value;
        if (this.sidebarToggle) {
          this.DivWidth = (window.innerWidth - 250) + "px";
        } else {
          this.DivWidth = window.innerWidth + "px";
        }
      }
    }, error => {
      // console.log('Error: ' + error);
    });

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
    this._globals.isEmpReading = false;
    window.onbeforeunload = undefined;
  }
  onCorrectAnswer() {
    if (!this.QustionList[this.indexNo].isAns) {
      var cur = this.selectIndex.CorrectAnswerOptionNumber.toString().split("@");
      var Data = this.myForm.value;
      if (Data.Ans.length == 0) {
        for (var i = 0; i < this.selectIndex.AnsList.length; i++) {
          // console.log(this.selectIndex.AnsList[i].QuestionOptionIndex);
          if (this.inArray(this.selectIndex.AnsList[i].QuestionOptionIndex, cur) != -1) {
            this.selectIndex[i].isAns = 1;
          }
        }
      } else {
        var selectOption = [];
        for (var q = 0; q < Data.Ans.length; q++) {
          if (Data.Ans[q].SelectIndex) {
            selectOption.push(this.selectIndex.AnsList[q].QuestionOptionIndex);
          }
        }
        for (let i = 0; i < this.selectIndex.AnsList.length; i++) {
          if (this.inArray(this.selectIndex.AnsList[i].QuestionOptionIndex, selectOption) != -1) {
            if (this.inArray(this.selectIndex.AnsList[i].QuestionOptionIndex, cur) != -1) {
              this.selectIndex.AnsList[i].isAns = 1;
            } else {
              this.selectIndex.AnsList[i].isAns = 2;
            }
          }
          if (this.inArray(this.selectIndex.AnsList[i].QuestionOptionIndex, cur) != -1) {
            this.selectIndex.AnsList[i].isAns = 1;
          }
        }
      }
      this.QustionList[this.indexNo].isAns = true;
    }
    //  else {
    //   this.isAns = false;
    // }
  }
  inArray(value, arr): any {
    var no = -1;
    // console.log(arr);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == value) {
        no++;
      }
    }
    return no;
  }
  loadExamQus() {
    var obj = this;
    this.PAGES_Sub_MENU = [];
    var isOk = 0;
    this.service.getQusByChapId(obj.ChapterId).subscribe((data) => {
      if (data.success) {
        data.ChapterInfo.forEach(function (value) {
          if (value.chapterId == obj.ChapterId) {
            obj.emp_courseId = value.emp_courseId;
            obj.currentCourseId = value.courseId;
          }
          if (value.is_offline != "true") {
            var page = {
              title: value.chapterName,
              icon: 'paint-brush',
              toggle: 'off',
              children: []
            };
            for (var i = 0; i < value.children.length; i++) {
              if (value.is_offline != "true") {
                page.children.push({
                  path: '../../../read/' + obj.emp_courseId + '/' + value.children[i].subChapterId,
                  title: value.children[i].subChapterTitle
                });
              }
            }
            if (value.QusCount > 0) {
              page.children.push({
                path: '../../../exam/' + obj.emp_courseId + '/' + value.chapterId,
                title: obj.strMokEx,
                icon: 'clock'
              });
            }
            if (value.chapterId == obj.ChapterId) {
              page.toggle = 'on';
            }
            obj.PAGES_Sub_MENU.push(page);
            if (isOk == 1) {
              obj.nextSub = value.children[0].subChapterId;
              isOk = 0;
            }
            if (value.chapterId == obj.ChapterId) {
              isOk = 1;
            }
          }
        });

        this.QustionList = data.ChapQus.map(i => ({
          ...i,
          selectedAns: [],
          isAns: false
        }))
        this.selectIndex = this.QustionList[0];
        this.selectIndex.hasImage = this.selectIndex.QuestionImg && this.selectIndex.QuestionImg != 'null' && this.selectIndex.QuestionImg != '';
        this.selectIndex.AnsList.forEach(function (value) {
          obj.addNewAns();
        });
      }
      this.spinner.hide();
    });
  }
  initAns() {
    return this.builder.group({
      'SelectIndex': false,
    });
  }
  public addNewAns() {
    const control = <FormArray>this.myForm.controls['Ans'];
    control.push(this.initAns());
  }
  public removedAns(i: number) {
    // remove address from the list
    const control = <FormArray>this.myForm.controls['Ans'];
    control.removeAt(i);
  }
  NextQus() {
    if (!this.QustionList[this.indexNo].isAns) {
      this.onCorrectAnswer();
    } else {
      var obj = this;
      // this.isAns = false;
      let Data = this.myForm.value;
      this.QustionList[this.indexNo].selectedAns = Data;

      this.indexNo = this.indexNo + 1;
      for (var i = Data.Ans.length - 1; i >= 0; i--) {
        this.removedAns(i);
      }

      this.selectIndex = this.QustionList[this.indexNo];
      this.selectIndex.hasImage = this.selectIndex.QuestionImg && this.selectIndex.QuestionImg != 'null' && this.selectIndex.QuestionImg != '';
      this.selectIndex.AnsList.forEach(function (value) {
        obj.addNewAns();
      });
    }

  }
  BackQus() {
    var obj = this;
    let Data = this.myForm.value;

    this.QustionList[this.indexNo].selectedAns = Data;
    for (var i = Data.Ans.length - 1; i >= 0; i--) {
      this.removedAns(i);
    }
    this.indexNo = this.indexNo - 1;
    this.selectIndex = this.QustionList[this.indexNo];
    this.selectIndex.hasImage = this.selectIndex.QuestionImg && this.selectIndex.QuestionImg != 'null' && this.selectIndex.QuestionImg != '';
    this.selectIndex.AnsList.forEach(function (value) {
      obj.addNewAns();
    });
  }
  SubmitQus() {
    if (!this.QustionList[this.indexNo].isAns) {
      this.onCorrectAnswer();
    } else {
      var obj = this;
      // this.isAns = false;
      let Data = this.myForm.value;
      this.QustionList[this.indexNo].selectedAns = Data;
      if (this.QustionList.length > 0) {
        this.service.SaveQustionResult(this.QustionList, this.emp_courseId, 0).subscribe((data) => {
          if (data.success) {
            this.service.updateCourseIfCompleted(this.currentCourseId, obj.emp_courseId).subscribe((data) => {
              if (data.success) {
                if (this.nextSub == 0) {
                  var path = "";
                  if (this._globals.getUserType() == "1") {
                    path = 'superadmin/mycourses';
                  } else if (this._globals.getUserType() == "2") {
                    path = 'admin/mycourses';
                  } else if (this._globals.getUserType() == "3") {
                    path = 'trainer/mycourses';
                  } else {
                    path = 'employee/mycourses';
                  }
                  this.router.navigate([path, this.currentCourseId], { skipLocationChange: false });
                  // this.router.navigate(['./employee/mycourses/', this.currentCourseId], { skipLocationChange: false });
                } else {
                  this.router.navigate(['./read', this.emp_courseId, this.nextSub], { skipLocationChange: false });
                }
              } else {
                // TODO: Report error?
              }
            })
          }
        });
      } else {
        alert("No question available");
      }

    }
  }
  // checkAnswer(event, index = undefined) {
  //   if (index != undefined) {
  //     this.checkBoxes.toArray()[index].;
  //   }
  //   event.stopPropagation();
  // }
  getAnswerBackground(isAnswer) {
    switch (isAnswer) {
      case 1:
        return '#71f442D9';
      case 2:
        return '#f44141D9';
      default:
        break;
    }
  }
}
