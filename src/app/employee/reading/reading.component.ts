import { Component, ViewChild, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ReadingService } from './reading.service';
import { Routes } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import { GlobalService } from '../../theme/services/global.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'reading',
  templateUrl: './reading.html',
  styleUrls: ['./reading.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(1000))
    ])
  ]
})
export class Reading implements OnDestroy, OnInit {
  public PAGES_Sub_MENU: Array<any>;
  selectedItem: any = {
    ChapterId: "",
    FilePath: "",
    IsVideo: "",
    chapterTxt: "",
    courseId: "",
    isAudio: "",
    subChapterId: "",
    subChapterTitle: "",
    QusCount: 0
  };
  pdfSrc: string = null;
  ImgSrc: string = null;
  courseId = 0;
  empCourseId = undefined;
  isExam: boolean = false;
  isplayed = true;
  ChapterId = 0;
  DivWidth = "";
  Divheight = "";
  currentChpInfo: any;
  foundVal = 0;
  backSubChapId = 0;
  nextSubChapId = 0;
  strMokEx = "";
  public sidebarToggle = true;
  fadeIn = false;
  // 0 => no file
  // 1 => video
  // 2 => audio
  // 3 => pdf
  // 4 => image
  // -1 => unknown
  fileType = 0;
  fileEnding = "";

  constructor(public _globalService: GlobalService, public _globals: Globals, public router: Router, private route: ActivatedRoute,
    protected service: ReadingService, private spinner: NgxSpinnerService, private translate: TranslateService) {

    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.sidebarToggle = this._globals.sidebarToggle;

    this.translate.get('course.MockTest').subscribe(value => { this.strMokEx = value; });
    this.spinner.show();

    // console.log("++++++++++++++++++");
    // console.log(this.route.url);
    // console.log("++++++++++++++++++");
    if (this.sidebarToggle) {
      this.DivWidth = (window.innerWidth - 250) + "px";
    } else {
      this.DivWidth = window.innerWidth + "px";
    }

    this.Divheight = (window.innerHeight - 80) + "px";

    this._globals.isEmpReading = true;

    this.fadeIn = true;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      //console.log(params);
      this.courseId = params.id;
      this.empCourseId = params.empCourseId;
      // var obj = this;
      // setTimeout(() => {
      //   obj.loadCertificater();
      //   obj._sidebarToggle();
      // }, 100);
      this.loadCertificater();
      this._sidebarToggle();
    });
  }
  ngOnDestroy() {
    this._globals.isEmpReading = false;
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
      console.log('Error: ' + error);
    });

  }
  loadCertificater() {
    var obj = this;
    obj.PAGES_Sub_MENU = [];
    obj.nextSubChapId = 0;
    obj.backSubChapId = 0;
    obj.isExam = false;
    var searching = true;
    this.fileType = 0;
    this.fileEnding = "";
    obj.selectedItem = {
      ChapterId: "",
      FilePath: "",
      IsVideo: "",
      chapterTxt: "",
      courseId: "",
      isAudio: "",
      subChapterId: "",
      subChapterTitle: "",
    };
    obj.service.getChapterBySubChapId(this.courseId, this.empCourseId).subscribe((data) => {
      if (data.success) {
        //console.log(data);
        obj.selectedItem = data.subChapterInfo;
        // console.log(obj.selectedItem);
        data.ChapterInfo.forEach(function (value) {
          if (value.is_offline != "true") {
            var page = {
              title: value.chapterName,
              icon: 'book',
              toggle: 'off',
              children: []
            };
            for (var i = 0; i < value.children.length; i++) {
              if (!searching && obj.nextSubChapId == 0) {
                obj.nextSubChapId = value.children[i].subChapterId;
                if (obj.selectedItem.QusCount > 0 && obj.selectedItem.ChapterId != value.children[i].chapterId) {
                  obj.isExam = true;
                }
              }
              if (value.is_offline != "true") {

                page.children.push({
                  path: '../../../read/' + obj.empCourseId + '/' + value.children[i].subChapterId,
                  title: value.children[i].subChapterTitle
                });
              }
              if (value.children[i].subChapterId == obj.selectedItem.subChapterId) {
                page.toggle = 'on';
                searching = false;
              }
              if (searching) {
                obj.backSubChapId = value.children[i].subChapterId;
              }
            }
            if (value.QusCount > 0) {
              page.children.push({
                path: '../../../exam/' + obj.empCourseId + '/' + value.chapterId,
                title: obj.strMokEx,
                icon: 'clock'
              });
            }
            // console.log(page);
            // console.log(value);
            obj.PAGES_Sub_MENU.push(page);
          }
          if (obj.selectedItem.ChapterId == value.chapterId) {
            obj.selectedItem.QusCount = value.QusCount
          }
        });

        // 0 => no file
        // 1 => video
        // 2 => audio
        // 3 => pdf
        // 4 => image
        // -1 => unknown
        this.fileEnding = this.selectedItem.FilePath.split('.').pop().toLowerCase();
        if (this.fileEnding.match(/(jpg|jpeg|png|gif)$/i)) {
          this.fileType = 4;
        } else if (this.fileEnding.match(/(pdf)$/i)) {
          this.fileType = 3;
        } else if (this.fileEnding.match(/(mp4|mov|avi|webm)$/i)) {
          this.fileType = 1;
        } else if (this.fileEnding.match(/(mp3|m4a|wav)$/i)) {
          this.fileType = 2;
        } else if (this.fileEnding.length > 0) {
          console.log("unknown file type");
          this.fileType = -1;
        }

        console.log(this.fileType);

        if (this.fileType == 3) {
          if (this.selectedItem.FilePath.startsWith("API/")) {
            this.pdfSrc = this._globals.WebURL + "/API/index.php/Serve/loadData?path=" + this.selectedItem.FilePath.substring(4);
          } else {
            this.pdfSrc = this._globals.WebURL + "/API/index.php/Serve/loadData?path=" + this.selectedItem.FilePath;
          }
        } else {
          this.pdfSrc = null;
        }

        // Check if course is complete due to current chapter marked as done.
        this.service.updateCourseIfCompleted(this.selectedItem.courseId, this.empCourseId).subscribe((data) => {
          //console.log(data);
          if (!data.success) {
            console.error(data);
          }
        });
      }
      obj.spinner.hide();
    });
  }
  downloadFile() {
    let fileName = this.selectedItem.subChapterTitle.replace(/[^a-z0-9]/gi, '_');
    saveAs(this._globals.WebURL + '/' + this.selectedItem.FilePath, fileName + '.' + this.fileEnding);
  }
  toggleAudioVideo(event: any) {
    console.log(event);
    if (!this.isplayed) {
      this.isplayed = true;
      event.play();
    } else {
      this.isplayed = false;
      event.pause();
    }

  }
  BackSubChap() {
    this.router.navigate(['./read', this.empCourseId, this.backSubChapId], { skipLocationChange: false });
  }
  NextSubChap() {
    if (this.nextSubChapId == 0) {
      this.spinner.show();
      var userType = this._globals.getUserType();
      if (userType == "1") {
        this.router.navigate(['./superadmin/mycourses', this.selectedItem.courseId], { skipLocationChange: false });
      } else if (userType == "2") {
        this.router.navigate(['./admin/mycourses', this.selectedItem.courseId], { skipLocationChange: false });
      } else if (userType == "3") {
        this.router.navigate(['./trainer/mycourses', this.selectedItem.courseId], { skipLocationChange: false });
      } else {
        this.router.navigate(['./employee/mycourses', this.selectedItem.courseId], { skipLocationChange: false });
      }
      //this.router.navigate(['./employee/chapter/', this.selectedItem.courseId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./read', this.empCourseId, this.nextSubChapId], { skipLocationChange: false });
    }
  }
  ExamChapter() {
    this.router.navigate(['./exam', this.empCourseId, this.selectedItem.ChapterId], { skipLocationChange: false });
  }
}