// import {Component,ViewChild} from '@angular/core';
// import { progressService } from './progress.service';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'EmpProgress',
//   templateUrl: './progress.html',
// })
// export class progress {
//   courseId = 0;
//   courseName = "";
//   linechart:any;
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
//       series: [[]]
//     }
//   };

//   constructor(private route: ActivatedRoute,protected service: progressService) {
//     this.route.params.subscribe(params => {
//       this.courseId = params['id']; // (+) converts string 'id' to a number
//       this.loadEmpCourse();
//       this.getCourseById();
//       // In a real app: dispatch action to load the details here.
//     });
//   }
//   initChart(chart:any) {
//     // console.log("ready Chart");
//     this.linechart=chart;
//   }
//   getCourseById(){
//     this.service.getCourseById(this.courseId)
//     .subscribe(data => { 
//        this.courseName = data.data.courseName
//     });
//   }
//   loadEmpCourse(){
//     this.data.simpleLineData.labels=[];
//     this.data.simpleLineData.series=[[]];
//     this.service.getProgress(this.courseId)
//     .subscribe(data => { 
//        for(var i=0;i<data.data.length;i++){
//          var DT = data.data[i].resultDate.split(" ");
//          this.data.simpleLineData.labels.push(DT[0]);
//          this.data.simpleLineData.series[0].push(data.data[i].result)
//        }
//        this.linechart.update(); 
//     });
//   }  
// }
