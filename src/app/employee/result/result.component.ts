import { Component, ViewChildren, QueryList, ViewChild, OnInit } from '@angular/core';
import { ResultService } from './result.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'result',
  templateUrl: './result.html'
})
export class Result implements OnInit {
  result_Id = 0;
  displayQustion: any = [];
  Resultscore: any;
  courseId = 0;

  @ViewChild('videoPlayer', { static: true }) videoplayer: any;
  constructor(public router: Router, private route: ActivatedRoute, protected service: ResultService, public _globals: Globals, private spinner: NgxSpinnerService) {
    this.spinner.show();
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      // console.log(params)
      this.result_Id = params.id;
      // setTimeout(function () {
      //   obj.loadResult();
      // }, 100);
      this.loadResult();
    });
  }
  loadResult() {
    var obj = this;
    this.service.getResultdata(this.result_Id).subscribe((res) => {
      // console.log(res);
      if (res.success) {
        this.courseId = res.data.CourseId;
        this.Resultscore = res.data.result;
        if (res.data.AnswerChosen.length > 0) {
          var AnswerChosen = res.data.AnswerChosen;
          for (let i = 0; i < AnswerChosen.length; i++) {
            var Cor = AnswerChosen[i].CorrectAnswerOptionNumber;
            var OptionList = AnswerChosen[i].OptionList;
            var CorrectAnswerOptionNumber = Cor.split("@");
            var CorrectAnswer = [];
            var Answer = false;
            for (var j = 0; j < OptionList.length; j++) {
              if (this.inArray(OptionList[j].QuestionOptionIndex, CorrectAnswerOptionNumber) != -1) {
                CorrectAnswer.push(OptionList[j]);
              }

            }
            var selectOption = AnswerChosen[i].SelectOption.split(",");
            for (var j = 0; j < selectOption.length; j++) {
              if (this.inArray(selectOption[j], CorrectAnswerOptionNumber) != -1) {
                Answer = true;
              }

            }
            this.displayQustion.push({
              "index": i, "QuestionID": AnswerChosen[i].QuestionID,
              "img": AnswerChosen[i].QuestionImg != undefined && AnswerChosen[i].QuestionImg != null && AnswerChosen[i].QuestionImg != "null" && AnswerChosen[i].QuestionImg != "" ? this._globals.WebURL + "/" + AnswerChosen[i].QuestionImg : null,
              "Question": AnswerChosen[i].Question,
              "Explanation": AnswerChosen[i].Explanation != "NULL" ? AnswerChosen[i].Explanation : "",
              "CorrectAnswerOptionNumber": CorrectAnswerOptionNumber, "Answer": Answer, "CorrectAnswer": CorrectAnswer
            });
          }
        }
      }
      obj.spinner.hide();
    });
  }
  inArray(value, arr): any {
    var no = -1;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == value) {
        no++;
      }
    }
    return no;
  }

}