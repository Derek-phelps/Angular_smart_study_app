import { Component, ViewChild, ElementRef, Pipe, PipeTransform, NgZone, OnInit } from '@angular/core';
import { ReadingScormService } from './readingScorm.service';
import { Routes } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import { GlobalService } from '../../theme/services/global.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, state, style, transition, animate } from '@angular/animations';
// import { BehaviorSubject } from 'rxjs';
// import { Http } from '@angular/http';

declare var API: any;

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
@Component({
  selector: 'readingScorm',
  templateUrl: './readingScorm.html',
  styleUrls: ['./readingScorm.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(1000))
    ])
  ]
})
export class ReadingScorm implements OnInit {
  @ViewChild('iframe', { static: true }) iframe: ElementRef;
  public PAGES_Sub_MENU: Array<any>;
  public CourseList = [];
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
    "isScormCourse": "0"
  };
  scormInfo = {};
  empScormChapterId = undefined;
  courseId = 0;
  empCourseId = undefined;
  ChapterId = 0;
  DivWidth = "";
  DivHeight = "";
  InnerDivHeight = "";
  iframeHeight = "0";
  backSubChapId = 0;
  nextSubChapId = 0;
  public sidebarToggle = true;
  public fullScreen = false;
  finishedLoading = false;

  fadeIn = false;

  bIsInternetExplorer = false;

  // SCORM variables:
  // ===========================================
  courseUrl = '';
  debugScorm = false;
  lastError = 0;
  lastErrorString = "";
  classPointer = this;
  last_Read = 0;
  currentChapter: any;
  suspendedData = "";
  suspendedDataLength = 0;
  winClose: any;

  //private endScorm = false;
  observableEndScorm: any;

  constructor(public _globalService: GlobalService, public _globals: Globals, public router: Router, private route: ActivatedRoute,
    protected service: ReadingScormService, private formBuilder: FormBuilder, private translate: TranslateService, private zone: NgZone,
    private spinner: NgxSpinnerService) {

    var obj = this;
    function goodbye() {
      obj.service.accessControl().subscribe(() => { });
    }
    window.onbeforeunload = goodbye;

    var ua = navigator.userAgent;
    this.bIsInternetExplorer = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

    var scale = 'scale(1)';
    document.body.style.webkitTransform = scale;
    document.body.style.transform = scale;
    document.body.style.zoom = "1.0";

    this._globals.isEmpReading = true;

    this.spinner.show();
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.sidebarToggle = this._globals.sidebarToggle;

    var obj = this;
    this.winClose = window.close;
    if (!this.bIsInternetExplorer) {
      window.close = function () {
        obj.zone.run(() => obj.router.navigate([obj._getUserTypeString('mycourses'), obj.courseId], { skipLocationChange: false }));
      };
    }

    if (this.sidebarToggle) {
      this.DivWidth = (window.innerWidth - 250) + "px";
    } else {
      this.DivWidth = window.innerWidth + "px";
    }
    this.DivHeight = (window.innerHeight - 80) + "px";
    this.InnerDivHeight = (window.innerHeight - 81) + "px";
    this.iframeHeight = (window.innerHeight - 110 - 56) + "px";

    //this.observableEndScorm = new BehaviorSubject< Boolean >(this.endScorm);
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fadeIn = false;
      // console.log(params)
      this.ChapterId = params.id;
      this.empCourseId = params.empCourseId;

      this._sidebarToggle();
      this.loadData();
      this.fadeIn = true;
    });
  }
  ngOnDestroy() {
    this._globals.isEmpReading = false;
    if (!this.bIsInternetExplorer) {
      window.close = this.winClose;
    }
    this.service.accessControl().subscribe(() => { });
    window.onbeforeunload = undefined;
  }
  ngAfterViewInit() {
    var obj = this;
    this.iframe.nativeElement.onload = function () {
      obj.spinner.hide();
    };
  }
  public _sidebarToggle() {
    this._globalService.data$.subscribe(data => {
      if (data.ev === 'sidebarToggle') {
        var scale = 'scale(1)';
        document.body.style.webkitTransform = scale;
        document.body.style.transform = scale;
        document.body.style.zoom = "1.0";
        this.sidebarToggle = data.value;
        if (this.fullScreen) {
          this.DivHeight = window.innerHeight + "px";
          this.InnerDivHeight = window.innerHeight + "px";
          this.iframeHeight = (window.innerHeight - 56) + "px";
        } else {
          this.DivHeight = (window.innerHeight - 80) + "px";
          this.InnerDivHeight = (window.innerHeight - 81) + "px";
          this.iframeHeight = (window.innerHeight - 110 - 56) + "px";
        }
        if (this.sidebarToggle && !this.fullScreen && this.CourseList.length != 1) {
          this.DivWidth = (window.innerWidth - 250) + "px";
        } else {
          this.DivWidth = window.innerWidth + "px";
        }
      }
    }, error => {
      console.log('Error: ' + error);
    });

  }
  toggleFullScreen() {
    var scale = 'scale(1)';
    document.body.style.webkitTransform = scale;
    document.body.style.transform = scale;
    document.body.style.zoom = "1.0";
    if (this.fullScreen) {
      if (this.CourseList.length != 1 && this._globals.sidebarToggle) {
        this.DivWidth = (window.innerWidth - 250) + "px";
      } else {
        this.DivWidth = window.innerWidth + "px";
      }
      this.DivHeight = (window.innerHeight - 80) + "px";
      this.InnerDivHeight = (window.innerHeight - 81) + "px";
      this.iframeHeight = (window.innerHeight - 110 - 56) + "px";
    } else {
      this.DivWidth = window.innerWidth + "px";
      this.DivHeight = window.innerHeight + "px";
      this.InnerDivHeight = window.innerHeight + "px";
      this.iframeHeight = (window.innerHeight - 56) + "px";
    }

    this.fullScreen = !this.fullScreen;
    window.scroll(0, 0);
  }
  toCourseOverview() {
    this.spinner.show();
    this.router.navigate([this._getUserTypeString('mycourses'), this.courseId], { skipLocationChange: false });
  }
  private _getUserTypeString(route) {
    var userType = this._globals.getUserType();
    var strUserUrl = './';
    if (userType == "1") {
      strUserUrl += 'superadmin/';
    } else if (userType == "2") {
      strUserUrl += 'admin/';
    } else if (userType == "3") {
      strUserUrl += 'trainer/';
    } else {
      strUserUrl += 'employee/';
    }
    strUserUrl += route;
    return strUserUrl;
  }
  loadData() {
    this.CourseList = [];
    this.PAGES_Sub_MENU = [];
    this.service.getChapterListByCourseWithChapId(this.ChapterId, this.empCourseId).subscribe((data) => {
      if (data.success) {
        this.CourseList = data.data;
        if (this.CourseList.length > 0) {
          this.courseId = this.CourseList[0].courseId;
        }

        if (this.CourseList.length == 1) {
          this.toggleFullScreen();
        }

        this.service.getCourseById(this.courseId).subscribe((data) => {
          if (data.success) {
            this.courseInfo = data.data;
            this.courseInfo.countComp = data.compQuery.countComp;

            var num = 1;
            for (var i = 0; i < this.CourseList.length; ++i) {
              if (!this.CourseList[i].parentChapterId) {
                var page = {
                  path: '../../readScorm/' + this.CourseList[i].chapterId,
                  title: num + " - " + this.CourseList[i].chapterName,
                  icon: 'paint-brush',
                  toggle: 'on',
                  children: []
                };
                if (this.CourseList[i].scormPath == "404") {
                  page.path = '';
                }
                this._addSubChaptersRecursively(this.CourseList[i].chapterId, page.children, num++);
                this.PAGES_Sub_MENU.push(page);
              }
              if (this.CourseList[i].chapterId == this.ChapterId) {
                this.currentChapter = this.CourseList[i];
                this.courseUrl = this._globals.WebURL + '/API/index.php/Serve/serveSCORM';
                // if (this.debugScorm) {
                //   // TODO: Add debug mode for php
                //   this.courseUrl = '/assets/courses/liItQOzC6DukFEecJyH4/course/index.html?type=scorm';
                // } else {
                //   this.courseUrl = this._globals.WebURL + '/API/serveSCORM.php';
                // }
              }
            }

            if (this.CourseList.length == 1) {
              this.PAGES_Sub_MENU[0].title = this.CourseList[0].chapterName;
            }

            this.service.getScormChapterInfo(this.currentChapter.chapterId, this.courseInfo.emp_courseId).subscribe((data) => {
              if (data.success) {
                this.empScormChapterId = data.scormInfo['emp_scormChapterId'];
                if (data.scormInfo['scormInfo'] != null) {
                  this.scormInfo = JSON.parse(data.scormInfo['scormInfo']);
                } else {
                  this.scormInfo = {};
                  this._setupDefaultScormInfo();
                }

                this.setupScormApi();
                this.finishedLoading = true;
              }
            });
          }
        });
      }
    });
  }
  _addSubChaptersRecursively(chapterId, childNodes, num) {
    var newNum = 1;
    for (var i = 0; i < this.CourseList.length; i++) {
      if (this.CourseList[i].parentChapterId == chapterId) {
        var strNewNum = num + "." + newNum++;
        var newChild = {
          path: '../../readScorm/' + this.CourseList[i].chapterId,
          title: strNewNum + " - " + this.CourseList[i].chapterName,
          toggle: 'on',
          children: []
        };
        this._addSubChaptersRecursively(this.CourseList[i].chapterId, newChild.children, strNewNum);
        childNodes.push(newChild);
      }
    }
  }
  BackSubChap() {
    this.router.navigate(['./readScorm', this.courseInfo.emp_courseId, this.backSubChapId], { skipLocationChange: false });
  }
  NextSubChap() {
    this.router.navigate(['./readScorm', this.courseInfo.emp_courseId, this.nextSubChapId], { skipLocationChange: false });
  }

  // SCORM STUFF
  // ===============================================================================================
  // ===============================================================================================
  setupScormApi() {
    // Forward class methods
    API.LMSInitialize = this.LMSInitialize;
    API.LMSGetValue = this.LMSGetValue;
    API.LMSSetValue = this.LMSSetValue;
    API.LMSCommit = this.LMSCommit;
    API.LMSFinish = this.LMSFinish;
    API.LMSGetLastError = this.LMSGetLastError;
    API.LMSGetDiagnostic = this.LMSGetDiagnostic;
    API.LMSGetErrorString = this.LMSGetErrorString;
    // Internal methods
    API._addScormChaptersAndSuspend = this._addScormChaptersAndSuspend;
    API._suspendScormSubChapterStatus = this._suspendScormSubChapterStatus;
    API._unloadScorm = this._unloadScorm;
    //API.initialize = this.initialize;

    // Forward class variables
    //API.playScorm = this.playScorm;
    API.classPointer = this.classPointer;
    API.debugScorm = this.debugScorm;
    API._globals = this._globals;
    API.last_Read = this.last_Read;
    API.currentChapter = this.currentChapter;
    API.courseId = this.courseId;
    API.courseInfo = this.courseInfo;
    API.scormInfo = this.scormInfo;
    API.empScormChapterId = this.empScormChapterId;
    API.suspendedData = this.suspendedData;
    API.suspendedDataLength = this.suspendedDataLength;
    API.CourseList = this.CourseList;
    API.formBuilder = this.formBuilder;
    API.service = this.service;
    API.translate = this.translate;
    API.lastError = this.lastError;
    API.lastErrorString = this.lastErrorString;
  }
  LMSInitialize(initializeInput) {
    if (initializeInput) {
      console.warn("[LMS API] Got unknown initialize input: " + initializeInput);
    }
    return "true";
  }
  LMSGetValue(varname) {
    if (this.scormInfo[varname] != undefined) {
      if (this.debugScorm) {
        console.log("[LMS API] LMSGetValue => returning " + varname + " => " + this.scormInfo[varname]);
      }

      return this.scormInfo[varname];
    } else {
      if (this.debugScorm) {
        console.warn("[LMS API] LMSGetValue: " + varname + " undefined => Returning empty string.");
      }
      return "";
    }
  }
  LMSSetValue(varname, varvalue) {
    if (this.debugScorm) {
      if (this.scormInfo[varname] != undefined) {
        console.log("[LMS API]: LMSSetValue => saving " + varname + " => " + varvalue);
      } else {
        console.log("[LMS API]: LMSSetValue => adding and saving " + varname + " => " + varvalue);
      }
    }
    this.scormInfo[varname] = varvalue;
    return "true";
  }
  LMSCommit(commitInput) {
    if (this.debugScorm) {
      console.log("[LMS API] LMSCommit initiated. Input: " + commitInput)
    }
    this.service.saveScormChapterInfo(JSON.stringify(this.scormInfo), this.currentChapter.chapterId, this.currentChapter.courseId, this.courseInfo.emp_courseId, this.empScormChapterId).subscribe((data) => {
      if (data.success) {
        this.empScormChapterId = data.id;
        if (this.debugScorm) {
          console.log("[LMS API] LMSCommit worked. Input: " + commitInput)
        }
      } else {
        if (data.code == 1) {
          this.classPointer.spinner.show();
          //alert(this.translate.instant('course.ErrorScormSave'));
          this._globals.errorScormSave = true;
          this.classPointer.toCourseOverview();
        }
        if (this.debugScorm) {
          console.error("[LMS API] LMSCommit failed!!! Input: " + commitInput)
        }
      }
    });

    return "true";
  }
  LMSFinish(finishInput) {
    // TODO: Maybe save something here?
    //console.warn("[LMS API] LMSFinish: " + finishInput)
    //this.router.navigate(['employee/chapter/'+this.courseId]);
    this._unloadScorm();

    this.LMSCommit("");

    if (this.debugScorm) {
      console.log("[LMS API] LMSFinish called with input: " + finishInput)
    }

    return "true";
  }
  LMSGetLastError() {
    // this.displayLog("LMSGetLastError: ");
    if (this.lastError != 0 && this.debugScorm) {
      console.error("[LMS API] Returning last error: " + this.lastError.toString());
    }
    return this.lastError.toString();
  }
  LMSGetDiagnostic(errorCode) {
    // TODO: not implemented yet
    //this.displayLog("LMSGetDiagnostic: " + errorCode);
    if (this.debugScorm) {
      console.warn("[LMS API] NOT IMPLEMENTED YET!");
    }
    return "info[at]smart-study.at";
  }
  LMSGetErrorString(errorCode) {
    if (errorCode != 0 && this.debugScorm) {
      console.error("[LMS API] Returning last error string: " + this.lastErrorString);
    }
    //this.displayLog("LMSGetErrorString: " + errorCode);
    return this.lastErrorString;
  }
  _addScormChaptersAndSuspend(subChapterList) {
    var strSubChapterStatusList = subChapterList.split(",");
    var oAddScormSubChaptersForm: FormGroup = this.formBuilder.group({
      chapter: [this.currentChapter.chapterId],
      numSubChapters: [strSubChapterStatusList.length]
    });
    this.service.addScormSubChaptersToCourse(oAddScormSubChaptersForm.value).subscribe((data) => {
      if (!data.success) {
        console.error("[LMS API] SHOULD NOT HAPPEN!!!");
        console.error(data);
      } else {
        this._suspendScormSubChapterStatus(subChapterList);
      }
    });
  }
  _suspendScormSubChapterStatus(subChapterList) {
    var oSuspendScormSubChapterStatusForm: FormGroup = this.formBuilder.group({
      courseId: [this.courseId],
      chapter: [this.currentChapter.chapterId],
      subChapterList: [subChapterList]
    });
    this.service.suspendScormSubChapterStatusToCourse(oSuspendScormSubChapterStatusForm.value, this.empCourseId).subscribe((data) => {
      if (!data.success) {
        console.error("[LMS API] SHOULD NOT HAPPEN!!!");
        console.error(data);
      }
    });

    // TODO: Return false here?
  }
  _unloadScorm() {
    //this.router.navigate(['employee/chapter/'+this.courseId]);
    // TODO: navigate back somehow
    // HINT: BehaviorSubject
  }
  _setupDefaultScormInfo() {
    this.scormInfo["cmi.core.student_name"] = this._globals.userInfo.EmpName;
    // this.scormInfo["cmi.core.student_id"] = this._globals.userInfo.empId.toString();
    this.scormInfo["cmi.core.student_id"] = "0";
    this.scormInfo["cmi.core.lesson_mode"] = "normal";
    this.scormInfo["cmi.core.lesson_status"] = "not attempted";
  }

  // END OF SCORM STUFF
  // ===============================================================================================
  // ===============================================================================================
}