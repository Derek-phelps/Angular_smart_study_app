import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Globals } from '../../common/auth-guard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyCoursesService } from './my-courses.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

//import { extractEffectiveCourseAssignments } from '../../helper-functions';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ]),
    trigger('visibilityChangedCourseCard', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(5000))
    ])
  ]
})
export class MyCoursesComponent implements OnInit {

  bLoading = true;

  numberOverdue = 0;
  numberCurrent = 0;

  courseInfos = [];

  activeCourseAssignments = [];

  currentLoaded = [];

  constructor(public globals: Globals, private spinner: NgxSpinnerService, private service: MyCoursesService, private translate: TranslateService,
    public router: Router) {
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;

    this.spinner.hide();
  }

  ngOnInit() {
    this.loadMyCourses();
  }

  loadMyCourses() {
    this.courseInfos = [];
    this.numberCurrent = 0;
    this.numberOverdue = 0;
    this.service.getMyCourseAssignments().subscribe(data => {
      //console.log(data);
      if (data.success) {
        if (data.effectiveCourseAssignments) {
          data.effectiveCourseAssignments.sort((a, b) => a.overallStatus < b.overallStatus ? -1 : a.overallStatus > b.overallStatus ? 1 : 0);
          data.effectiveCourseAssignments.forEach(effectiveAssigments => {
            effectiveAssigments.effectiveSeries.sort((a, b) => a.sortNextEvent < b.sortNextEvent ? -1 : a.sortNextEvent > b.sortNextEvent ? 1 : 0);
            effectiveAssigments.fixedDates.sort((a, b) => a.sortNextEvent < b.sortNextEvent ? -1 : a.sortNextEvent > b.sortNextEvent ? 1 : 0);
          });
          this.courseInfos = data.effectiveCourseAssignments;
        }
        //console.log(this.courseInfos);
        this.courseInfos.forEach(courseInfo => {
          if (courseInfo.overallStatus == -1) {
            this.numberOverdue = this.numberOverdue + 1;
          } else if (courseInfo.overallStatus == 0) {
            this.numberCurrent = this.numberCurrent + 1;
          }
        });
        this.bLoading = false;
      }
    }, err => {
      // TODO: error handling
      console.error(err);
    });
  }

  openCourse(courseInfo, startNewIfFinished) {
    if (courseInfo.active == 1) {
      return;
    }

    this.spinner.show();
    var userType = this.globals.getUserType();
    this.globals.openCourseState = startNewIfFinished;
    if (userType == "1") {
      this.router.navigate(['./superadmin/mycourses', courseInfo.courseId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/mycourses', courseInfo.courseId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/mycourses', courseInfo.courseId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./employee/mycourses', courseInfo.courseId], { skipLocationChange: false });
    }
  }

  courseImgError(event) {
    if (this.globals.companyInfo.companyLogo != null && this.globals.companyInfo.companyLogo != '') {
      event.target.src = this.globals.WebURL + '/' + this.globals.companyInfo.companyLogo;
    } else {
      event.target.src = /*this.globals.WebURL +*/ "assets/img/logoakt.png";
    }
  }

}
