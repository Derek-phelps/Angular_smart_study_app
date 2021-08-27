// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { UploadInput } from 'ngx-uploader';
// import { AdminCourseService } from '../../adminCourse.service';

// import { ActivatedRoute } from "@angular/router";
// import { Globals } from '../../../../common/auth-guard.service';
// import { TranslateService } from '@ngx-translate/core';

// @Component({
//   selector: 'app-edit-course',
//   templateUrl: './edit-adminCourse.component.html',
//   styleUrls: ['./edit-adminCourse.component.scss']
// })
// export class EditAdminCourseComponent implements OnInit {

//   public EmpForm: FormGroup;
//   public postList = [];
//   public trainerList = [];
//   public locationList = [];
//   public defaultPicture = 'assets/img/theme/no-photo.png';
//   public profile: String = "";
//   public imgPath = "";
//   public strCourseImg = "";
//   public DisableButton = false;
//   public uploaderOptions: UploadInput = {
//     type: 'uploadAll',
//     url: this._globals.APIURL + 'Company/userImgUpload?folderName=Course',
//     method: 'POST',
//     data: {}
//   };
//   department = [];
//   constructor(protected service: AdminCourseService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals, private route: ActivatedRoute) {

//     this.translate.get('course.Image').subscribe(value => { this.strCourseImg = value; });

//     this.route.params.subscribe(params => {
//       this.loadCourseById(params.id);
//     });
//     this.loadDepartment();
//     this.loadTrainer();
//     this.loadLocations();
//     this.EmpForm = this.formBuilder.group({
//       courseId: ['', Validators.required],
//       courseName: ['', Validators.required],
//       departmentId: [[]],
//       EndTime: [''],
//       duration: [''],
//       courseRate: ['5'],
//       courseDes: ['', Validators.required],
//       trainerId: [''],
//       locationId: [''],
//       isLocReq: [0],
//       StartTime: [''],
//       isOffline: [0],
//       companyId: [this._globals.companyInfo.companyId],
//       UserId: [this._globals.getUserId()],
//       minResult: [''],
//       courseImg: [''],
//     });

//     function goodbye(e) {
//       if (!e) e = window.event;
//       //e.cancelBubble is supported by IE - this will kill the bubbling process.
//       e.cancelBubble = true;
//       e.returnValue = undefined; //This is displayed on the dialog

//       //e.stopPropagation works in Firefox.
//       if (e.stopPropagation) {
//         e.stopPropagation();
//         e.preventDefault();
//       }
//     }
//     window.onbeforeunload = goodbye;
//   }
//   loadTrainer() {
//     this.service.getTrainerByComp(this._globals.companyInfo.companyId).subscribe((data) => {
//       if (data.success) {
//         this.trainerList = data.data;
//       }
//     });
//   }
//   loadLocations(){
//     this.service.getLocationsByComp(this._globals.companyInfo.companyId).subscribe((data) => {
//       if (data.success) {
//         this.locationList = data.data
//       }
//     });
//   }
//   loadCourseById(couId) {
//     this.service.getCourseById(couId).subscribe((data) => {
//       if (data.success) {
//         // var isOff = 0;
//         // if (data.data.isOffine == "1") {
//         //   isOff = 1;
//         // }
//         // var isLocReq = 0;
//         // if (data.data.isLocReq == "1") {
//         //   isLocReq = 1;
//         // }
//         var startTime: any;
//         if (data.data.startDate != '') {
//           startTime = new Date(data.data.startDate);
//         } else {
//           startTime = '';
//         }
//         var endTime: any;
//         if (data.data.startDate != '') {
//           endTime = new Date(data.data.EndTime);
//         } else {
//           endTime = '';
//         }
//         this.EmpForm.setValue({
//           courseId: data.data.courseId,
//           courseName: data.data.courseName,
//           departmentId: data.data.departmentId,
//           EndTime: endTime,
//           duration: parseInt(data.data.duration),
//           courseRate: data.data.courseRate,
//           courseDes: data.data.courseDes,
//           StartTime: startTime,
//           trainerId: data.data.trainerId,
//           locationId: data.data.locationId,
//           isLocReq: data.data.isLocReq == 1 ? true : false,
//           companyId: this._globals.companyInfo.companyId,
//           minResult: parseInt(data.data.minResult),
//           courseImg: data.data.courseImg,
//           isOffline: data.data.isOffine == 1 ? true : false,
//           UserId: this._globals.getUserId(),
//         });
//         console.log(this.EmpForm.value);
//         this.defaultPicture = this._globals.adminURL + "/" + data.data.courseImg;
//         //this.defaultPicture = this._globals.IMAGEURL + "Course/" + data.data.courseImg;
//       }
//     });
//   }
//   ngOnInit() {
//   }
//   ngOnDestroy() {
//     window.onbeforeunload = undefined;
//   }
//   loadDepartment() {
//     this.service.getDepartment(this._globals.getUserId(), this._globals.companyInfo.companyId).subscribe((data) => {
//       if (data.success) {
//         this.department = data.data
//       }
//     });
//   }
//   disableButton() {
//     this.DisableButton = true;
//   }
//   imgUpload(e) {
//     if (e.success) {
//       this.EmpForm.controls['courseImg'].setValue(e.UserImg);
//     } else {
//       this.profile = "";
//     }

//     this.DisableButton = false;
//   }
//   pictureUploaded(e) {
//     //console.log(e);
//   }
//   saveEmpData() {
//     if (!this.EmpForm.value.isOffline) {
//       if (typeof this.EmpForm.value.minResult != "number") {
//         this.translate.get('alert.EnterNumber').subscribe(value => { alert(value); });
//         return false;
//       }
//       if (this.EmpForm.value.minResult < 0 || this.EmpForm.value.minResult > 100) {
//         this.translate.get('alert.EnterNumber').subscribe(value => { alert(value); });
//         return false;
//       }
//     }
//     this.service.edit(this.EmpForm.value).subscribe((data) => {
//       if (data.success) {
//         this.translate.get('alert.SaveCourseSuccess').subscribe(value => { alert(value); });
//       } else {
//         this.translate.get('alert.EditCourseFail').subscribe(value => { alert(value); });
//         // alert(data.mes);
//         this.postList = [];
//       }
//     });
//   }

// }
