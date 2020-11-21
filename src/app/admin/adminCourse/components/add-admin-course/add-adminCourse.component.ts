// import { Component, OnInit, ElementRef, Renderer, ViewChild } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { UploadInput } from 'ngx-uploader';
// import { AdminCourseService } from '../../adminCourse.service';

// import { Globals } from '../../../../common/auth-guard.service';
// import { Router, ActivatedRoute } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
// import { NgxSpinnerService } from 'ngx-spinner';


// @Component({
//   selector: 'app-add-course',
//   templateUrl: './add-adminCourse.component.html',
//   styleUrls: ['./add-adminCourse.component.scss']
// })
// export class AddAdminCourseComponent implements OnInit {
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
//   CopyCourse = 0;
//   fileToUpload: File = null;
//   spinnerText = "";

//   @ViewChild('fileUpload') public _fileUpload: ElementRef;
//   constructor(private spinner: NgxSpinnerService, private renderer: Renderer, private route: ActivatedRoute, protected service: AdminCourseService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
//     this.translate.get('course.Image').subscribe(value => { this.strCourseImg = value; });
//     this.translate.get('scorm.UploadingScorm').subscribe(value => { this.spinnerText = value; this._globals.spinnerText = value; });

//     this.loadDepartment();
//     this.loadTrainer();
//     this.loadLocations();
//     // this.route.params.subscribe(params => {
//     //   this.CopyCourse = params.id;
//     //   this.loadCourseById(this.CopyCourse);
//     // });
//     this.setDefaultFormValues();

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
//   setDefaultFormValues() {
//     this.EmpForm = this.formBuilder.group({
//       courseName: ['', Validators.required],
//       trainerId: [''],
//       locationId: [''],
//       isLocReq: [0],
//       departmentIds: [[]],
//       mandatoryDepartmentIds: [[]],
//       departmentMandatory: [0],
//       EndTime: [''],
//       duration: [0],
//       courseRate: ['5'],
//       StartTime: [''],
//       courseDes: ['', Validators.required],
//       UserId: [this._globals.getUserId()],
//       minResult: [''],
//       courseImg: [''],
//       isOffline: [0],
//       isScormCourse: [0],
//       scormPath: [''],
//       companyId: [this._globals.companyInfo.companyId]
//     });
//   }
//   // loadCourseById(couId) {
//   //   //console.log(couId);
//   //   this.service.getCourseById(couId).subscribe((data) => {
//   //     if (data.success) {
//   //       this.EmpForm.setValue({
//   //         courseName: data.data.courseName,
//   //         departmentId: [0],
//   //         EndTime: new Date(data.data.EndTime),
//   //         trainerId: data.data.trainerId,
//   //         locationId: data.data.locationId,
//   //         isLocReq: data.data.isLocReq == 1 ? true : false,
//   //         duration: parseInt(data.data.duration),
//   //         courseRate: data.data.courseRate,
//   //         courseDes: data.data.courseDes,
//   //         StartTime: new Date(data.data.startDate),
//   //         companyId: data.data.companyId,
//   //         minResult: parseInt(data.data.minResult),
//   //         courseImg: data.data.courseImg,
//   //         isOffline: data.data.isOffine == 1 ? true : false,
//   //         isScormCourse: data.data.isScormCourse == 1 ? true : false,
//   //         UserId: this._globals.getUserId(),
//   //         scormPath: ""
//   //       });
//   //       this.defaultPicture = this._globals.adminURL + "/" + data.data.courseImg;
//   //       //this.defaultPicture = this._globals.IMAGEURL + "Course/" + data.data.courseImg;
//   //     }
//   //   });
//   // }
//   ngOnInit() {
//   }
//   ngOnDestroy() {
//     window.onbeforeunload = undefined;
//     this._globals.spinnerText = "";
//   }
//   loadTrainer() {
//     this.service.getTrainerByComp(this._globals.companyInfo.companyId).subscribe((data) => {
//       if (data.success) {
//         this.trainerList = data.data
//       }
//     });
//   }
//   loadLocations() {
//     this.service.getLocationsByComp(this._globals.companyInfo.companyId).subscribe((data) => {
//       if (data.success) {
//         this.locationList = data.data
//       }
//     });
//   }
//   loadDepartment() {

//     this.service.getDepartment(this._globals.getUserId(), this._globals.companyInfo.companyId).subscribe((data) => {
//       if (data.success) {
//         this.department = data.data;
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
//     // var bTrue = true;
//     // if (bTrue) {
//     //   console.log(this.EmpForm.value);
//     //   return false;
//     // }
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
//     if (this.EmpForm.value.isScormCourse) {
//       if (this.EmpForm.value.isOffline) {
//         this.translate.get('scorm.ScormNotOffline').subscribe(value => { alert(value); });
//         return false;
//       }

//       this.renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
//       return true;
//     }
//     this.service.add(this.EmpForm.value, this._globals.companyInfo.companyId, this.CopyCourse).subscribe((data) => {
//       // if (data.debug) {
//       //   console.log(data.debugMes);
//       // }
//       if (data.success) {
//         //this.EmpForm.reset();
//         this.setDefaultFormValues();
//         this.translate.get('alert.SaveCourseSuccess').subscribe(value => { alert(value); });
//       } else {
//         this.translate.get('alert.AddCourseFail').subscribe(value => { alert(value); });
//         //alert(data.mes);
//         this.postList = [];

//         return false;
//       }
//     });

//     return true;
//   }
//   handleFileInput(files: FileList) {
//     this.fileToUpload = files.item(0);

//     //console.log(files);

//     this.service.postCourse(this.fileToUpload).subscribe(data => {
//       if (data != undefined && data["success"] != undefined && data["success"] == true) {
//         this.EmpForm.value.scormPath = data["scormPath"];

//         this.service.add(this.EmpForm.value, this._globals.companyInfo.companyId, 0).subscribe((data) => {
//           //console.log(data);
//           if (data.success) {
//             //this.EmpForm.reset();
//             this.setDefaultFormValues();
//             this.translate.get('alert.SaveCourseSuccess').subscribe(value => { alert(value); });
//           } else {
//             this.translate.get('alert.AddCourseFail').subscribe(value => { alert(value); });
//             //alert(data.mes);
//             this.postList = [];

//             this._globals.spinnerText = this.spinnerText;
//             this.spinner.hide();
//             return false;
//           }
//           this._globals.spinnerText = this.spinnerText;
//           this.spinner.hide();
//           return true;
//         });

//         this._globals.spinnerText = this.spinnerText;
//         this.spinner.hide();
//         return true;
//       } else if (data != undefined && (data["eventType"] != undefined || data["progress"] != undefined)) {
//         if (data["eventType"] == 0) {
//           this.spinner.show();

//         } else if (data["progress"] != undefined) {
//           this._globals.spinnerText = data["progress"] + "<br>" + this.spinnerText;
//         }
//       } else {
//         this.translate.get('scorm.UploadFailed').subscribe(value => { alert(value); });

//         this._globals.spinnerText = this.spinnerText;
//         this.spinner.hide();
//         return false;
//       }
//     }, error => {
//       console.log(error);

//       this._globals.spinnerText = this.spinnerText;
//       this.spinner.hide();
//       return false;
//     });
//   }
// }
