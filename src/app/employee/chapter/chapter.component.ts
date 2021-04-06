import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input, OnInit, AfterViewInit } from '@angular/core';
import { ChapterService } from './chapter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { download } from '../../download/download.component';
import { CourseFeedbackQuestion, CourseFeedbackResponse } from 'src/app/core/models/course-feedback-question';
import { array2map, map2array } from 'src/app/common/map_utils';

//import { $ } from 'protractor';

// @Pipe({ name: 'safe' })
// export class SafePipe implements PipeTransform {
//   constructor(private sanitizer: DomSanitizer) { }
//   transform(url) {
//     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }
// }
@Component({
  selector: 'chapter',
  templateUrl: './chapter.html',
  styleUrls: ['./chapter.scss']
})
export class Chapter implements OnInit, AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;

  Array = Array;

  state = false;

  public CourseList = [];
  courseId = 0;
  isActive = 1;
  last_Read = 0;
  selectChap = 0;
  QustionCount = 0;
  courseProgress = null;
  sumTodoTotal = 0;
  sumTodoComp = 0;
  public courseInfo: any = {
    "courseName": '',
    "courseImg": '',
    'courseId': '',
    "startDate": '',
    "emp_courseId": '',
    "EndTime": '',
    "countComp": 0,
    "countChapter": 0,
    "CourseResult": 0,
    "isOffine": "0",
    "isScormCourse": "0",
    "isCompleted": "0"
  };
  public playScorm = false;

  trainer = null;

  playFireworks = false;
  isFeedbackFormVisible = false;
  feedbackQuestions: CourseFeedbackQuestion[];
  feedbackResponses = {} as any;

  // SCORM values:
  // ===========================================
  //courseUrl = this._globals.WebURL+'/API/courses/scorm_courses/Windows_10_Essential_SCORM/course/index.html?type=scorm';
  //courseUrl = '/assets/courses/course1/course/index.html?type=scorm';
  //courseUrl = '';
  // courseUrl = './src/app/employee/chapter/courses/Windows_10_Essential_SCORM/course/index.html?type=scorm';

  // debugScorm = false;
  // lastError = 0;
  // lastErrorString = "";
  // End of SCORM values
  // ===========================================
  constructor(public _globals: Globals, public router: Router, private route: ActivatedRoute, protected service: ChapterService,
    private formBuilder: FormBuilder, private translate: TranslateService, private spinner: NgxSpinnerService, private _snackBar: MatSnackBar,
    private componentFactoryResolver: ComponentFactoryResolver) {
    this.spinner.show();
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.state = this._globals.openCourseState;
    this._globals.openCourseState = false;

    this.initialize();

    //this.service.accessControl().subscribe(() => {});
  }
  initialize() {
    // TODO: Read out scorm version!? => This is for 1.2
    //this.setupScormApi();

    //var obj = this;
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
      if (params['chapterId']) {
        this.selectChap = params['chapterId'];
      }
      // setTimeout(() => {
      //   obj.CourseList = [];
      //   obj.loadCourseById();
      // }, 300);

    });
  }
  ngOnInit() {
    this.loadCourseById();
  }
  ngAfterViewInit() {
    // if (this._globals.errorScormSave) {
    //   this._globals.errorScormSave = false;
    //   alert(this.translate.instant('course.ErrorScormSave'));
    // }
  }
  loadCourseById() {
    this.CourseList = [];
    var obj = this;
    this.service.getCourseById(this.courseId, this.state).subscribe((data) => {
      //console.log(data);
      if (data.success) {
        obj.courseInfo = data.data;
        // console.log(obj.courseInfo);
        if (obj.courseInfo.justFinished) {
          setTimeout(() => {
            obj.playFireworks = true;
            setTimeout(() => {
              obj.playFireworks = false;
            }, 2000);
          }, 500);
        }
        obj.QustionCount = data.QustionCount;
        obj.courseInfo.countComp = data.compQuery.countComp;
        obj.trainer = data.Trainer;

        obj.loadCertificater();
      }
    });
  }
  saveEmpChapData(obj, cour) {
    this.spinner.show();
    this.service.setMarkAttendance(obj.empSubChapId, this.courseInfo.emp_courseId, obj.subChapterId).subscribe((data) => {
      this.loadCourseById();
    });
  }
  loadCertificater() {
    this.CourseList = [];
    var obj = this;
    this.service.getChapterListByCourse(this.courseInfo.emp_courseId).subscribe((data) => {
      if (data.success) {
        var subIndex = 0;
        var a = 0;
        var hasProgress = false;
        var progress = 0;
        obj.CourseList = data.data.map(e => {
          if (e.SubChapId && obj.last_Read == 0 && e.sumCompChap < e.sumSubChap) {
            obj.last_Read = e.SubChapId;
          }

          if (obj.selectChap != e.chapterId) {
            subIndex = a;
          }
          if (e.scormInfo) {
            var scormInfo = JSON.parse(e.scormInfo);
            if (scormInfo["cmi.core.score.raw"] != undefined) {
              if (scormInfo["cmi.core.score.min"] != undefined && scormInfo["cmi.core.score.max"] != undefined) {
                progress = 100 / (scormInfo["cmi.core.score.max"] - scormInfo["cmi.core.score.min"]) * scormInfo["cmi.core.score.raw"];
              } else {
                progress = scormInfo["cmi.core.score.raw"];
              }
              hasProgress = true;
            }
          }
          var sumTotal = Number(e.sumSubChap);
          var sumCompTotal = Number(e.sumCompChap);
          if (e.conQus > 0) {
            sumTotal += 1;
            if (e.TestResult != null) {
              sumCompTotal += 1;
            }
          }
          obj.sumTodoTotal += sumTotal;
          obj.sumTodoComp += sumCompTotal;
          a++;
          return {
            ...e,
            "subChap": [],
            "isActive": 0,
            "isRead": e.TestResult != null ? true : false,
            "hasProgress": hasProgress,
            "progress": progress,
            "sumTotal": sumTotal,
            "sumCompTotal": sumCompTotal
          };
        });
        if (obj.selectChap != 0) {
          obj.OpenSubChap(obj.CourseList[subIndex]);
        }
        if (obj.last_Read == 0) {
          //console.log(this.CourseList[0]);
          obj.last_Read = obj.CourseList[0].SubChapId;
        }

        // console.log(obj.CourseList);

        // for (var i = 0; i < this.CourseList.length; ++i) {

        // }

        // for (var i = 0; i < this.CourseList.length; ++i) {
        //   var chapterInfo = this._doScormSubChapterCountRecursive(this.CourseList[i].chapterId);
        //   this.CourseList[i].sumSubChap = chapterInfo.sumSubChap;
        //   this.CourseList[i].sumCompChap = chapterInfo.sumCompChap;
        // }
      } else {
        obj.CourseList = [];
      }

      if (this._globals.errorScormSave) {
        this._globals.errorScormSave = false;
        alert(this.translate.instant('course.ErrorScormSave'));
      }
      obj.spinner.hide();
    });
  }
  OpenLastView() {
    // TODO: Check if this is an offline chapter!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    this.router.navigate(['./read', this.courseInfo.emp_courseId, this.last_Read], { skipLocationChange: false });
  }
  OpenSubChap(obj) {
    if (obj.isActive == 1) {
      obj.isActive = 0
    } else {
      //console.log(obj);
      if (obj.subChap.length == 0) {
        this.service.getSubChapterByChapId(obj.chapterId, this.courseInfo.emp_courseId).subscribe((data) => {
          if (data.success) {
            var subChap = [];
            var da = data.currentData.split(" ");
            var daVal = da[0].split("/");
            var monthNumber = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"].indexOf(daVal[1].toLowerCase());

            var serverDate = new Date(parseInt(daVal[2]), monthNumber, parseInt(daVal[0]));


            for (var i = 0; i < data.data.length; i++) {
              subChap.push({
                "ChapterId": data.data[i].ChapterId,
                "FilePath": data.data[i].FilePath,
                "IsVideo": data.data[i].IsVideo,
                "TName": data.data[i].TName,
                "chapterTxt": data.data[i].chapterTxt,
                "empSubChapId": data.data[i].empSubChapId,
                "markAttendance": data.data[i].markAttendance,
                "subChapterId": data.data[i].subChapterId,
                "subChapterTitle": data.data[i].subChapterTitle,
                "trainerId": data.data[i].trainerId,
                "trainingConfirmdEndTime": data.data[i].trainingConfirmdEndTime,
                "trainingConfirmdStartTime": data.data[i].trainingConfirmdStartTime,
                "trainingDate": data.data[i].trainingDate,
                "trainingEndTime": data.data[i].trainingEndTime,
                "trainingPlace": data.data[i].trainingPlace,
                "trainingstartTime": data.data[i].trainingstartTime,
                "isConfirmed": false
              });
              var trainingDate = new Date(data.data[i].trainingDate);
              var StartTime = data.data[i].trainingConfirmdStartTime.split(":");
              var EndTime = data.data[i].trainingConfirmdEndTime.split(":");
              var ConfirmdStartTime = new Date(serverDate.getFullYear(), serverDate.getMonth(), serverDate.getDate(), StartTime[0], StartTime[1], 0);
              var ConfirmdEndTime = new Date(serverDate.getFullYear(), serverDate.getMonth(), serverDate.getDate(), EndTime[0], EndTime[1], 0);
              var ServerStr = serverDate.getDate() + "/" + (serverDate.getMonth() + 1) + "/" + serverDate.getFullYear();
              var trainingDateStr = trainingDate.getDate() + "/" + (trainingDate.getMonth() + 1) + "/" + trainingDate.getFullYear();
              var cuttent_Time = new Date();
              var configTime = new Date(serverDate.getFullYear(), serverDate.getMonth(), serverDate.getDate(), cuttent_Time.getHours(), cuttent_Time.getMinutes(), 0);
              if (ServerStr == trainingDateStr) {
                if (ConfirmdStartTime < configTime && ConfirmdEndTime > configTime) {

                  subChap[subChap.length - 1].isConfirmed = true;
                }
              }
            }
            obj.subChap = subChap;
          } else {
            obj.subChap = [];
          }
        });
      }
      obj.isActive = 1
    }
  }
  OpenSubChapView(obj) {
    //console.log(obj);
    if (parseInt(obj.IsVideo) != 0) {
      this.router.navigate(['./read', this.courseInfo.emp_courseId, obj.subChapterId], { skipLocationChange: false });
    }
  }
  OpenTextExam(obj) {
    this.router.navigate(['./exam', this.courseInfo.emp_courseId, obj.chapterId], { skipLocationChange: false });
  }
  OpenExam() {
    this.router.navigate(['./finelExam', this.courseInfo.emp_courseId, this.courseId], { skipLocationChange: false });
  }

  OpenScormChapter(obj) {
    //window.open('/assets/courses/' + this.courseInfo.scormPath + '/' + this.CourseList[0].scormPath, "HELLO", 'toolbar=no');
    if (parseInt(obj.is_offline) == 2 && obj.scormPath != "404") {
      this.router.navigate(['./readScorm', this.courseInfo.emp_courseId, obj.chapterId], { skipLocationChange: false });
    }
  }
  ProceedCourse() {
    if (this.CourseList.length == 1 && parseInt(this.CourseList[0].is_offline) == 2 && this.CourseList[0].scormPath != "404") {
      this.router.navigate(['./readScorm', this.courseInfo.emp_courseId, this.CourseList[0].chapterId], { skipLocationChange: false });
    }
  }
  copyToClipboard(value, displayText) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    // this._snackBar.openFromComponent(SnackBarComponent, {
    //   duration: 3000,
    // });

    var obj = this;
    this.translate.get(displayText).subscribe(value => { obj._snackBar.open(value, '', { duration: 3000 }) });
  }
  contactTrainer(mode) {
    if (mode == 'mail') {
      location.href = 'mailto:' + this.trainer.EmailID;
    } else if (mode == 'phone') {
      location.href = 'tel:' + this.trainer.MOBILEPHONE;
    }
  }
  courseImgError(event) {
    if (this._globals.companyInfo.companyLogo != null && this._globals.companyInfo.companyLogo != '') {
      event.target.src = this._globals.WebURL + '/' + this._globals.companyInfo.companyLogo;
    } else {
      //event.target.src = this._globals.WebURL + "/assets/img/logoakt.png";
      event.target.src = "assets/img/logoakt.png";
    }
  }
  openCertificate() {
    // console.log(this._globals.currentCertificateDownloadWindow);
    // console.log("======");
    // if (this._globals.currentCertificateDownloadWindow) {
    //   this._globals.currentCertificateDownloadWindow.close();
    // }
    // var url = this._globals.WebURL + '/#/pdf/' + this.courseInfo.CourseId + '/emp/' + this._globals.getEmpId() + '/' + this._globals.userInfo.userLang;
    // this._globals.currentCertificateDownloadWindow = window.open(url,"Smart-Study",'width=700,height=600');
    // console.log(this._globals.APIURL);
    // console.log(this._globals);
    // this._globals.certificaterCourseId = this.courseInfo.CourseId;
    // this._globals.certificaterEmpId = undefined;
    // const factory = this.componentFactoryResolver.resolveComponentFactory(download);
    // this.viewContainerRef.clear();
    // const ref = this.viewContainerRef.createComponent(factory);
    // ref.changeDetectorRef.detectChanges();
    if (this._globals.currentCertificateDownloadWindow) {
      this._globals.currentCertificateDownloadWindow.close();
    }
    var url = this._globals.WebURL + '/API/index.php/createpdf/view/' + this.courseInfo.CourseId;
    var width = window.innerHeight > 500 ? window.innerHeight * 3 / 4 : 500;
    var height = window.innerHeight > 600 ? window.innerHeight - 100 : window.innerHeight;
    var strWindowSettings = 'menubar=no,toolbar=no,status=no,channelmode=yes,top=0,left=0';
    strWindowSettings += ',width=' + width + ',height=' + height;
    this._globals.currentCertificateDownloadWindow = window.open(url, "Smart-Study", strWindowSettings);
  }
  async onFeedbackFormOpened() {
    this.isFeedbackFormVisible = true;
    this.feedbackQuestions = await this.service.getCourseFeedbackQuestions(this.courseInfo.CourseId);
  }
  onFeedbackFormClosed() {
    delete this.feedbackQuestions;
    this.isFeedbackFormVisible = false;
  }
  validateFeedbackResponses() {
    if (!this.feedbackQuestions?.length) {
      return true;
    }

    for (const question of this.feedbackQuestions) {
      if (question.mandatory === '1' && this.feedbackResponses[question.feedbackId] == null) {
        return true;
      }
    }
    return false;
  }
  submitFeedbackResponses() {
    const questionsById = array2map(this.feedbackQuestions, x => x.feedbackId, x => x);
    
    const responses = 
      map2array(this.feedbackResponses, 
        (key, value) => ({
          feedbackId: key,
          questionText: questionsById[key].questionText,
          questionType: questionsById[key].questionType,
          response: value,
        } as CourseFeedbackResponse))
      .filter(x => x.response);

    this.service.setCourseFeedbackResponses(this.courseInfo.CourseId, responses);
  }
  ngOnDestroy() {
    if (this._globals.currentCertificateDownloadWindow) {
      this._globals.currentCertificateDownloadWindow.close();
    }
  }
}

@Component({
  selector: 'snack-bar-component-copy',
  template: '<span style="text-align: center;">{{displayText}}</span>',
  // styles: [`
  //   .example-pizza-party {
  //     color: hotpink;
  //   }
  // `],
})
export class SnackBarComponent {
  @Input('displayText') displayText: string;
}
