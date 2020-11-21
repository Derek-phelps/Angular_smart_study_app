import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Globals } from '../../common/auth-guard.service';
// import { BaChartistChart } from '../../theme/components/baChartistChart/baChartistChart.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MultiDataSet, Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { hexToRgbaString } from '../../helper-functions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class DashboardComponent implements OnInit {
  bLoading = true;

  userSummary = undefined;
  departmentSummary = undefined;
  groupSummary = undefined;
  courseSummary = undefined;

  // Charts data
  /////////////////////////////////////

  chartColors = [];
  chartLabels: Label[] = [];

  userChartData: MultiDataSet = [];
  departmentChartData: MultiDataSet = [];
  groupChartData: MultiDataSet = [];
  courseChartData: MultiDataSet = [];

  /////////////////////////////////////

  dataValue = {
    "certificate": 0,
    "course": 0,
    "employeess": 0,
    "message": 0
  };
  countOfCourse = 0;
  public data = {

    simpleBarData: {
      labels: [],
      series: [
        []
      ]
    },
    simpleBarOptions: {
      fullWidth: true,
      height: '300px',

      axisY: {
        offset: 30,

      }
    },
    simplePieData: {
      labels: [],
      series: []
    },
    simplePieOptions: {
      fullWidth: true,
      height: '300px',
      weight: '300px'

    }
  };
  courseList = [];
  PieChart: any;
  BarChart: any;

  constructor(private translate: TranslateService, protected service: DashboardService, public _globals: Globals, private spinner: NgxSpinnerService, private router: Router) {
    //this.spinner.show();
    // var obj = this;
    // setTimeout(() => {
    //   obj.loadDashbord();
    // }, 100);
    this.chartLabels = [this.translate.instant('course.Done'), this.translate.instant('course.Open'), this.translate.instant('course.Overdue')];
    var obj = this;
    this.translate.onTranslationChange.subscribe(() => {
      this.chartLabels = [obj.translate.instant('course.Done'), obj.translate.instant('course.Open'), obj.translate.instant('course.Overdue')];
    });
    this.setChartColors();
    this.spinner.hide();
  }
  ngOnInit() {
    this.loadDashbord();
  }

  initPieChart(chart: any) {
    this.PieChart = chart;
  }
  initBarChart(chart: any) {
    this.BarChart = chart;
  }
  loadTopCourse() {
    this.service.getLoadTopCourse().subscribe((data) => {
      if (data.success) {
        // console.log(data.data);
        this.courseList = data.data;
      } else {
        this.courseList = [];
      }
    });
  }
  loadDashbord() {
    if (this._globals.getUserType() != '4') {
      this.service.getDashbord().subscribe((data) => {
        if (data.success) {
          this.bLoading = false;

          this.userSummary = data.userSummary;
          this.departmentSummary = data.departmentSummary;
          this.groupSummary = data.groupSummary;
          this.courseSummary = data.courseSummary;

          var obj = this;
          setTimeout(() => {
            obj.userChartData = [[obj.userSummary.done, obj.userSummary.open, obj.userSummary.overdue]];
            obj.departmentChartData = [[obj.departmentSummary.done, obj.departmentSummary.open, obj.departmentSummary.overdue]];
            obj.groupChartData = [[obj.groupSummary.done, obj.groupSummary.open, obj.groupSummary.overdue]];
            obj.courseChartData = [[obj.courseSummary.done, obj.courseSummary.open, obj.courseSummary.overdue]];
          }, 200);

          // this.dataValue = data.data;
          // var OverDue = 0;
          // var Open = 0
          // var Cur = new Date();
          // for (var i = 0; i < data.emp_course.length; i++) {
          //   var D = new Date(data.emp_course[i].startDate);
          //   if (D < Cur) {
          //     OverDue++;
          //   } else {
          //     Open++;
          //   }
          // }
          // var arr = [];
          // var arrId = [];
          // var arrScor = []
          // for (var i = 0; i < data.AssCourseCount.length; i++) {
          //   arr.push(data.AssCourseCount[i].courseName);
          //   this.data.simpleBarData.series[0].push(data.AssCourseCount[i].con);
          // }

          // this.data.simpleBarData.labels = arr;
          // if (OverDue == 0) {
          //   this.data.simplePieData.labels = ["Open"];
          //   this.data.simplePieData.series = [Open];
          // } else if (Open == 0) {
          //   this.data.simplePieData.labels = ["extension",];
          //   this.data.simplePieData.series = [OverDue];
          // } else {
          //   this.data.simplePieData.labels = ["Open", "extension",];
          //   this.data.simplePieData.series = [Open, OverDue];
          // }
          // this.PieChart.update();
          // this.BarChart.update();
        } else {
          // this.dataValue = {
          //   "certificate": 0,
          //   "course": 0,
          //   "employeess": 0,
          //   "message": 0
          // };
        }
        //this.router.navigate(['./admin/course/view', 797, 2], { skipLocationChange: false });
        //this.router.navigate(['./admin/course/add'], { skipLocationChange: false });
        this.spinner.hide();
      });
    } else {
      this.service.getEmpDashbord().subscribe((data) => {
        if (data.success) {
          this.dataValue = data.data;
          var OverDue = 0;
          var Open = 0

          var Cur = new Date();
          for (var i = 0; i < data.emp_course.length; i++) {
            var D = new Date(data.emp_course[i].startDate);
            if (D < Cur) {
              OverDue++;
            } else {
              Open++;
            }
          }
          var arr = [];
          var arrId = [];
          var arrScor = []


          for (var i = 0; i < data.AssCourseCount.length; i++) {
            this.data.simpleBarData.labels.push(data.AssCourseCount[i].courseName);
            this.data.simpleBarData.series[0].push(data.AssCourseCount[i].con);
          }
          if (OverDue == 0) {
            this.data.simplePieData.labels = ["Open"];
            this.data.simplePieData.series = [Open];
          } else if (Open == 0) {
            this.data.simplePieData.labels = ["extension",];
            this.data.simplePieData.series = [OverDue];
          } else {
            this.data.simplePieData.labels = ["Open", "extension",];
            this.data.simplePieData.series = [Open, OverDue];
          }
          this.PieChart.update();
          this.BarChart.update();
        } else {
          this.dataValue = {
            "certificate": 0,
            "course": 0,
            "employeess": 0,
            "message": 0
          };
        }
        this.spinner.hide();
      });
    }
  }

  setChartColors() {
    var opacity = 0.8;
    var strDanger = hexToRgbaString(this.getStyle(document.body, '--myDanger'), opacity);
    var strWarning = hexToRgbaString(this.getStyle(document.body, '--myWarning'), opacity);
    var strSuccess = hexToRgbaString(this.getStyle(document.body, '--mySuccess'), opacity);
    var colorObject = { backgroundColor: [strSuccess, strWarning, strDanger] };
    this.chartColors = [colorObject];
  }
  getStyle = function (el, prop) {
    if (typeof getComputedStyle !== 'undefined') {
      return getComputedStyle(el, null).getPropertyValue(prop);
    } else {
      return el.currentStyle[prop];
    }
  }
  getBoxClass(summary) {
    var bDone = false;
    var bCurrent = false;
    var bOverdue = false;
    var bGray = false;

    if (summary.sum > 0) {
      if (summary.overdue > 0) {
        bOverdue = true;
      } else if (summary.open > 0) {
        bCurrent = true;
      } else {
        bDone = true;
      }
    } else {
      bGray = true;
    }

    return {
      'box-done': bDone,
      'box-current': bCurrent,
      'box-overdue': bOverdue,
      'box-gray': bGray
    };
  }

  getEmpLink(bRoute = false) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/employees';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/employees';
    } else {
      // TODO: path = 'employee/';
    }
    if (bRoute) {
      this.router.navigate([path], { skipLocationChange: false });
    } else {
      return ('../../' + path);
    }
  }

  getDepLink(bRoute = false) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/department';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/department';
    } else {
      // TODO: path = 'employee/';
    }
    if (bRoute) {
      this.router.navigate([path], { skipLocationChange: false });
    } else {
      return ('../../' + path);
    }
  }

  getGroupLink(bRoute = false) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/groups';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/groups';
    } else {
      // TODO: path = 'employee/';
    }
    if (bRoute) {
      this.router.navigate([path], { skipLocationChange: false });
    } else {
      return ('../../' + path);
    }
  }

  getCourseLink(bRoute = false) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/course';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/course';
    } else {
      // TODO: path = 'employee/';
    }
    if (bRoute) {
      this.router.navigate([path], { skipLocationChange: false });
    } else {
      return ('../../' + path);
    }
  }
}
