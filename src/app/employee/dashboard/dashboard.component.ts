// import { Component, OnInit } from '@angular/core';
// import { EmployeeService } from '../employee.service';
// import { Globals } from '../../common/auth-guard.service';
// import { BaChartistChart } from '../../theme/components/baChartistChart/baChartistChart.component';
// import { NgxSpinnerService } from 'ngx-spinner';


// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
// })
// export class DashboardComponent implements OnInit {
//   dataValue={
//     "certificate":0,
//     "course":0,
//     "message":0
//   };
//   countOfCourse=0;
//   public data = {

//     simpleBarData: {
//       labels: [],
//       series: [
//         []
//       ]
//     },
//     simpleBarOptions: {
//       fullWidth: true,
//       height: '300px',

//       axisY: {
//         offset: 30,

//       }
//     },
//     simplePieData: {
//       labels: [],
//       series: []
//     },
//     simplePieOptions: {
//       fullWidth: true,
//       height: '300px',
//       weight: '300px'

//     }
//   };
//   courseList = [];
//   PieChart :any;
//   BarChart :any;

//   constructor(private spinner: NgxSpinnerService, protected service: EmployeeService,public _globals:Globals) {
//     this.spinner.show();
//     var obj =this;
//     setTimeout(() => {
//       obj.loadDashbord();
//     }, 100);

//   }
//   ngOnInit() {
//   }

//   initPieChart(chart:any){
//     this.PieChart = chart;
//   }
//   initBarChart(chart:any){
//     this.BarChart = chart;
//   }
//   loadDashbord(){
//       this.service.getEmpDashbord().subscribe((data) => {
//         // console.log(data);
//         if(data.success){
//           this.dataValue=data.data;
//           var OverDue=0;
//           var Open=0

//           var Cur= new Date();
//           for(var i=0;i<data.emp_course.length;i++){
//             var D=new Date(data.emp_course[i].startDate);
//             if(D<Cur){
//               OverDue++;
//             }else{
//               Open++;
//             }
//           } 
//           var arr=[];
//           var arrId=[];
//           var arrScor=[]


//           for(var i=0;i<data.AssCourseCount.length;i++){
//             this.data.simpleBarData.labels.push(data.AssCourseCount[i].courseName);
//             this.data.simpleBarData.series[0].push(data.AssCourseCount[i].con);
//           }
//           if(OverDue==0){
//             this.data.simplePieData.labels=["Open"];
//             this.data.simplePieData.series=[Open];
//           }else if(Open==0){
//             this.data.simplePieData.labels=["extension",];
//             this.data.simplePieData.series=[OverDue];
//           }else{
//             this.data.simplePieData.labels=["Open","extension",];
//             this.data.simplePieData.series=[Open,OverDue];
//           }
//           this.PieChart.update();
//           this.BarChart.update();
//         }else{
//           this.dataValue={
//             "certificate":0,
//             "course":0,
//             "message":0
//           };
//         }
//         this.spinner.hide();
//       });
//   }
// }
