// import { Component, ViewChild } from '@angular/core';
// import { AdminEmployeeService } from '../../adminEmployee.service';
// import { UploadInput } from 'ngx-uploader';
// import { ActivatedRoute } from '@angular/router';
// import { Globals } from '../../../../common/auth-guard.service';
// import { NgxSpinnerService } from 'ngx-spinner';

// @Component({
//   selector: 'employeesChart',
//   templateUrl: './employeesChart.html',
// })
// export class EmployeesChart {
//   EmpId = 0;
//   courseId = 0;
//   Courses = [];
//   EmpData: any = {
//     CURRENTADDRESS: "", EMAIL: "", FIRSTNAME: "", FatherName: "",
//     GENDER: "", LASTNAME: "", MARITALSTATUS: "", MOBILEPHONE: "",
//     MotherName: "", departmentId: "", empCompId: "", empEdu: "", empId: "", epath: "", positionId: "", positionName: ""
//   };

//   linechart: any;
//   public data = {
//     simpleLineOptions: {
//       fullWidth: true,
//       height: '300px',
//       chartPadding: {
//         right: 40
//       }
//     },
//     simpleLineData: {
//       labels: [],
//       series: [
//         [20]
//       ]
//     }
//   };
//   constructor(private route: ActivatedRoute, protected service: AdminEmployeeService, public _globals: Globals,
//     private spinner: NgxSpinnerService) {
//     this.route.params.subscribe(params => {
//       this.spinner.show();
//       this.EmpId = params['id']; // (+) converts string 'id' to a number
//       this.loadEmpData();
//       this.loadEmpCourse();
//       // In a real app: dispatch action to load the details here.
//     });
//   }
//   initChart(chart: any) {
//     //console.log("ready Chart");
//     this.linechart = chart;
//   }
//   onChange(deviceValue) {
//     this.courseId = deviceValue;
//     this.loadChartEmployees()
//   }
//   loadEmpCourse() {
//     this.service.getloadCourseByEmp(this.EmpId).subscribe((data) => {
//       if (data.success) {
//         this.Courses = data.data;
//         this.courseId = data.data[0].courseId;
//         this.loadChartEmployees();
//       } else {
//         this.courseId = 0;
//         this.Courses = []
//         this.spinner.hide();
//       }
//     });
//   }
//   loadChartEmployees() {
//     this.service.getProgress(this.EmpId, this.courseId).subscribe((data) => {
//       this.data.simpleLineData.labels = [];
//       this.data.simpleLineData.series = [[]]
//       if (data.success) {

//         for (var i = 0; i < data.data.length; i++) {
//           this.data.simpleLineData.labels.push(data.data[i].resultDate);
//           this.data.simpleLineData.series[0].push(data.data[i].result);
//         }
//         //console.log(this.linechart);
//         this.linechart.update();
//       } else {
//         this.linechart.update();
//       }
//       this.spinner.hide();
//     });
//   }
//   loadEmpData() {
//     this.service.getById(this.EmpId).subscribe((data) => {
//       if (data.success) {
//         this.EmpData = data.data
//       } else {
//         this.EmpData = "";
//       }
//     });
//   }

// }
