import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { EmployeeCourseService } from './empCourse.service';

import { Router } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import { download } from '../../download/download.component';
import { createComponent } from '@angular/compiler/src/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-employeeCourse',
  templateUrl: './empCourse.component.html',
  styleUrls: ['./empCourse.component.scss']
})
export class EmployeeCourseComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;

  public CompletedList = [];
  public OpenList = [];
  public extensionList = [];
  public voluntaryList = [];

  base64Img: any;
  TSignature: any;
  comLogo: any;

  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public selected: number;
  private swipeCoord?: [number, number];
  private swipeTime?: number;

  constructor(public _globals: Globals, public router: Router, private spinner: NgxSpinnerService, public _service: EmployeeCourseService,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.spinner.show();
    var obj = this;
    setTimeout(() => {
      obj.loadCourse();
    }, 100);
    this.selected = this.tabGroup.selectedIndex;
  }
  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        switch (swipe) {
          case 'previous':
            var next_sel = this.selected - 1;
            var bFound = false;
            while (next_sel >= 0 && !bFound) {
              const nextTab: MatTab = this.tabGroup._tabs.find((matTab, index) => {
                return index === next_sel;
              });
              if (!nextTab.disabled) {
                this.selected = next_sel;
                bFound = true;
              }
              next_sel--;
            }
            break;
          case 'next':
            var next_sel = this.selected + 1;
            var bFound = false;
            while (next_sel < this.tabGroup._tabs.length && !bFound) {
              const nextTab: MatTab = this.tabGroup._tabs.find((matTab, index) => {
                return index === next_sel;
              });
              if (!nextTab.disabled) {
                this.selected = next_sel;
                bFound = true;
              }
              next_sel++;
            }
            break;
        }
      }
    }
  }
  loadCourse() {
    this.CompletedList = [];
    this.OpenList = [];
    this.extensionList = [];
    this.voluntaryList = [];
    this._service.getAllCourseByUser().subscribe((data) => {
      //console.log(data.data);
      if (data.success) {
        var Cur = new Date();
        for (var i = 0; i < data.data.length; i++) {
          var D = new Date(data.data[i].EndTime);
          var createdByDate = new Date(data.data[i].createdByDate);
          if (data.data[i].isCompleted == '1' || data.data[i].isCompleted == 1) {
            this.CompletedList.push({
              "CountChapter": data.data[i].CountChapter,
              "ChapterList": data.data[i].ChapterList,
              "courseName": data.data[i].courseName,
              "courseId": data.data[i].courseId,
              "empId": data.data[i].empId,
              "emp_courseId": data.data[i].emp_courseId,
              "certificaterId": data.data[i].certificaterId,
              "isCompleted": data.data[i].isCompleted,
              "createdByDate": createdByDate.getDate() + "." + (createdByDate.getMonth() + 1) + "." + createdByDate.getFullYear(),
              "courseImg": data.data[i].courseImg,
              "startDate": D.getDate() + "." + (D.getMonth() + 1) + "." + D.getFullYear(),
              "result": data.data[i].result,
              "SignatureimgPath": this._globals.WebURL + data.data[i].SignatureimgPath,
              "Trainer": data.data[i].Trainer,
              "EndTime": data.data[i].EndTime,
              "certificaterList": data.data[i].certificaterList
            });
          } else if (D < Cur) {
            this.extensionList.push({
              "CountChapter": data.data[i].CountChapter,
              "ChapterList": data.data[i].ChapterList,
              "certificaterList": data.data[i].certificaterList,
              "courseName": data.data[i].courseName,
              "courseId": data.data[i].courseId,
              "empId": data.data[i].empId,
              "emp_courseId": data.data[i].emp_courseId,
              "isCompleted": data.data[i].isCompleted,
              "courseImg": data.data[i].courseImg,
              "startDate": D.getDate() + "." + (D.getMonth() + 1) + "." + D.getFullYear(),
              "EndTime": data.data[i].EndTime
            });
          } else if (Math.max(data.data[i].directAssignment, data.data[i].departmentAssignment, data.data[i].positionAssignment) > 1) {
            this.OpenList.push({
              "CountChapter": data.data[i].CountChapter,
              "ChapterList": data.data[i].ChapterList,
              "certificaterList": data.data[i].certificaterList,
              "courseName": data.data[i].courseName,
              "courseId": data.data[i].courseId,
              "empId": data.data[i].empId,
              "emp_courseId": data.data[i].emp_courseId,
              "isCompleted": data.data[i].isCompleted,
              "courseImg": data.data[i].courseImg,
              "startDate": D.getDate() + "." + (D.getMonth() + 1) + "." + D.getFullYear(),
              "EndTime": data.data[i].EndTime,
              "maxAss": Math.max(data.data[i].directAssignment, data.data[i].departmentAssignment, data.data[i].positionAssignment)
            });
          } else {
            this.voluntaryList.push({
              "CountChapter": data.data[i].CountChapter,
              "ChapterList": data.data[i].ChapterList,
              "certificaterList": data.data[i].certificaterList,
              "courseName": data.data[i].courseName,
              "courseId": data.data[i].courseId,
              "empId": data.data[i].empId,
              "emp_courseId": data.data[i].emp_courseId,
              "isCompleted": data.data[i].isCompleted,
              "courseImg": data.data[i].courseImg,
              "startDate": D.getDate() + "." + (D.getMonth() + 1) + "." + D.getFullYear(),
              "EndTime": data.data[i].EndTime,
              "maxAss": Math.max(data.data[i].directAssignment, data.data[i].departmentAssignment, data.data[i].positionAssignment)
            });
          }
        }
      } else {
        this.CompletedList = [];
        this.OpenList = [];
        this.extensionList = [];
        this.voluntaryList = [];
      }
      if (!(this.selected == 1 && this.voluntaryList.length > 0)) {
        if (this.OpenList.length == 0) {
          if (this.voluntaryList.length > 0) {
            this.selected = 1;
          } else if (this.CompletedList.length > 0) {
            this.selected = 2;
          }
        } else {
          this.selected = 0;
        }
      }
      this.spinner.hide();
    });
  }
  SignupThisChouse(course) {
    this._service.assignCourse(course.courseId, true).subscribe((data) => {
      if (data.success) {
        this.loadCourse();
      }
    });
  }
  DeregisterThisCourse(course) {
    this._service.assignCourse(course.courseId, false).subscribe((data) => {
      if (data.success) {
        this.loadCourse();
      }
    });
  }
  OpenCertificateView(certi) {
    // this._globals.certificaterCourseId = certi.courseId;
    // this._globals.certificaterEmpId = undefined;
    // const factory = this.componentFactoryResolver.resolveComponentFactory(download);
    // this.viewContainerRef.clear();
    // const ref = this.viewContainerRef.createComponent(factory);
    // ref.changeDetectorRef.detectChanges();
    if (this._globals.currentCertificateDownloadWindow) {
      this._globals.currentCertificateDownloadWindow.close();
    }
    var url = this._globals.WebURL + '/API/index.php/createpdf/view/' + certi.courseId;
    var width = window.innerHeight > 500 ? window.innerHeight * 3 / 4 : 500;
    var height = window.innerHeight > 600 ? window.innerHeight - 100 : window.innerHeight;
    var strWindowSettings = 'menubar=no,toolbar=no,status=no,channelmode=yes,top=0,left=0';
    strWindowSettings += ',width=' + width + ',height=' + height;
    this._globals.currentCertificateDownloadWindow = window.open(url, "Smart-Study", strWindowSettings);
  }
  courseImgError(event) {
    if (this._globals.companyInfo.companyLogo != null && this._globals.companyInfo.companyLogo != '') {
      event.target.src = this._globals.WebURL + '/' + this._globals.companyInfo.companyLogo;
    } else {
      event.target.src = /*this._globals.WebURL +*/ "assets/img/logoakt.png";
    }
  }
  ngOnDestroy() {
    if (this._globals.currentCertificateDownloadWindow) {
      this._globals.currentCertificateDownloadWindow.close();
    }
  }
}
