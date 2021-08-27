import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { FinelExamService } from './finelExam.service';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Routes } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'finelExam',
  templateUrl: './finelExam.html',
  styleUrls: ['./finelExam.scss']
})
export class FinelExam implements OnInit {
  myForm: FormGroup;
  ChapterId = 0;
  empCourseId = undefined;
  CurrentQus = 0;
  currentChpInfo: any;
  selectedItem: any;
  indexNo = 0;
  QustionList: any = [];
  selectIndex: any;
  nextSub = 0;
  time: string;
  totalTime: number = 0;
  foundVal = 0;
  isDisable: boolean = false;
  id: any;

  constructor(public _globals: Globals, private builder: FormBuilder, private spinner: NgxSpinnerService, private route: ActivatedRoute,
    public router: Router, protected service: FinelExamService, private formBuilder: FormBuilder) {

    this.spinner.show();
    this.myForm = builder.group({
      'Ans': this.builder.array([
      ])
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
  ngOnInit() {
    this.route.params.subscribe(params => {

      //console.log(params)
      this.empCourseId = params.empCourseId;
      this.ChapterId = params.id;
      // setTimeout(function () {
      //   obj.loadExamQus();
      // }, 100);
      this.loadExamQus();
    });
  }
  ngOnDestroy() {
    clearInterval(this.id);
    window.onbeforeunload = undefined;
  }
  loadExamQus() {
    var obj = this;
    this.service.getQusBycourseId(this.ChapterId, this.empCourseId).subscribe((data) => {
      if (data.success) {
        this.currentChpInfo = data.ChapterInfo;
        obj.time = obj.millisToMinutesAndSeconds(obj.currentChpInfo.duration);
        obj.totalTime = obj.currentChpInfo.duration;
        this.QustionList = data.ChapQus.map(i => ({
          ...i,
          selectedAns: [],
        }))
        this.selectIndex = this.QustionList[0];
        this.selectIndex.AnsList.forEach(function (value) {
          obj.addNewAns();
        });
        this.selectedItem = data.subChapterInfo;

        this.id = setInterval(function () {
          if (obj.currentChpInfo.duration == 0) {
            obj.SubmitQus();
            clearInterval(obj.id);
          } else {
            obj.time = obj.millisToMinutesAndSeconds(obj.currentChpInfo.duration);
            obj.currentChpInfo.duration = obj.currentChpInfo.duration - 1;
          }
        }, 1000);

      }
      obj.spinner.hide();
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
    var obj = this;
    if (obj.QustionList.length > this.indexNo) {
      let Data = obj.myForm.value;
      obj.QustionList[this.indexNo].selectedAns = Data;

      obj.indexNo = obj.indexNo + 1;
      for (var i = Data.Ans.length - 1; i >= 0; i--) {
        obj.removedAns(i);
      }

      obj.selectIndex = obj.QustionList[obj.indexNo];
      obj.selectIndex.AnsList.forEach(function (value) {
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
    this.selectIndex.AnsList.forEach(function (value) {
      obj.addNewAns();
    });
  }
  SubmitQus() {
    this.isDisable = true;
    let Data = this.myForm.value;

    this.QustionList[this.indexNo].selectedAns = Data;
    this.service.SaveQustionResult(this.QustionList, this.ChapterId, this.currentChpInfo, 0).subscribe((data) => {
      if (data.success) {
        this.router.navigate(['./result/', this.empCourseId, data.insert_id], { skipLocationChange: false });

      }
      this.isDisable = false;
    });
  }
  millisToMinutesAndSeconds(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
  }
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
