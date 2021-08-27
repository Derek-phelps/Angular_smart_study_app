// // ####################################################################################################
// // ##########                               CONTINUE HERE                                    ##########
// // ####################################################################################################

// // TODO: Implement logic like within add department (basically add correct loading for department
// //       including subdepartments and correct saving -> array for departments to delete)

// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { UploadInput } from 'ngx-uploader';
// import { DepartmentService } from '../../department.service';
// import { ActivatedRoute } from "@angular/router";
// import { Globals } from '../../../common/auth-guard.service';
// import { TranslateService } from '@ngx-translate/core';

// @Component({
//   selector: 'app-edit-department',
//   templateUrl: './edit-department.component.html',
//   styleUrls: ['./edit-department.component.scss']
// })
// export class EditDepartmentComponent implements OnInit {

//   public comapnyId = 0;
//   public EmpForm: FormGroup;
//   public postList = [];
//   department = [];
//   DepList = [];
//   public CompanyList = [];
//   public defaultLogoPicture = 'assets/img/theme/no-photo.png';
//   public defaultBannerPicture = 'assets/img/theme/no-photo.png';
//   public defaultBGPicture = 'assets/img/theme/no-photo.png';
//   public strDepartmentLogo = "";
//   public strDepartmentBackground = "";
//   public strDepartmentBanner = "";
//   public DisableButton = 0;
//   public uploaderOptions: UploadInput = {
//     type: 'uploadAll',
//     url: this._globals.APIURL + 'Company/userImgUpload?folderName=Department',
//     method: 'POST',
//     data: {}
//   };
//   public uploaderBannerOptions: UploadInput = {
//     type: 'uploadAll',
//     url: this._globals.APIURL + 'Company/userImgUpload?folderName=Department&SubfolderName=banner',
//     method: 'POST',
//     data: {}
//   };
//   public uploaderBackgroundOptions: UploadInput = {
//     type: 'uploadAll',
//     url: this._globals.APIURL + 'Company/userImgUpload?folderName=Department&SubfolderName=Background',
//     method: 'POST',
//     data: {}
//   };

//   constructor(protected service: DepartmentService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals, private route: ActivatedRoute) {

//     this.translate.get('department.Logo').subscribe(value => { this.strDepartmentLogo = value; });
//     this.translate.get('department.Background').subscribe(value => { this.strDepartmentBackground = value; });
//     this.translate.get('department.Banner').subscribe(value => { this.strDepartmentBanner = value; });

//     this.route.params.subscribe(params => {
//       this.service.getAllcompany().subscribe((data) => {
//         this.getDepartmentById(params.id);
//         if (data.success) {
//           this.CompanyList = data.data;
//         } else {
//           this.CompanyList = [];
//         }
//       });

//     });

//     this.EmpForm = this.formBuilder.group({
//       departmentId: ['', Validators.required],
//       departmentLogo: [''],
//       departmentBanner: [''],
//       departmentBackground: [''],
//       departmentName: ['', Validators.required],
//       EName: [''],
//       depPassword: ['']
//     });
//     if (this._globals.companyInfo.companyId > 0) {
//       this.loadEmp(this._globals.companyInfo.companyId);
//     }
//   }
//   ngOnInit() {

//   }
//   ngOnDestroy() {
//     window.onbeforeunload = undefined;
//   }
//   getDepartmentById(Id) {
//     this.service.getById(Id).subscribe((data) => {
//       if (data.success) {
//         this.loadEmp(data.data.companyId);
//         if (data.data.logo) {
//           this.defaultLogoPicture = this._globals.adminURL + "/" + data.data.webUrl + "/API/img/Department/" + data.data.logo;
//         }
//         if (data.data.banner) {
//           this.defaultBannerPicture = this._globals.adminURL + "/" + data.data.webUrl + "/API/img/Department/banner/" + data.data.banner;
//         }
//         if (data.data.background) {
//           this.defaultBGPicture = this._globals.adminURL + "/" + data.data.webUrl + "/API/img/Department/background/" + data.data.background;
//         }
//         if (this._globals.companyInfo.companyId == 0) {
//           this.uploaderOptions.url = this._globals.APIURL + 'Company/CompanyImgUpload?folderName=Department&folder=' + data.data.webUrl;
//           this.uploaderBannerOptions.url = this._globals.APIURL + 'Company/CompanyImgUpload?folderName=Department&SubfolderName=banner&folder=' + data.data.webUrl
//           this.uploaderBackgroundOptions.url = this._globals.APIURL + 'Company/CompanyImgUpload?folderName=Department&SubfolderName=background&folder=' + data.data.webUrl;
//         }

//         this.EmpForm.setValue({
//           departmentId: data.data.departmentId,
//           departmentLogo: data.data.logo,
//           departmentBanner: data.data.banner,
//           departmentBackground: data.data.background,
//           departmentName: data.data.departmentName,
//           EName: data.data.empId == null ? 0 : data.data.empId,
//           depPassword: data.data.depPassword
//         });
//       }
//     });
//   }
//   loadEmp(CompId) {
//     this.DepList = [];
//     this.service.getEmp(CompId).subscribe((data) => {
//       if (data.success) {
//         for (var i = 0; i < data.data.length; i++) {
//           if (data.data[i].UserType == 4) {
//             this.DepList.push({ "title": data.data[i].FIRSTNAME + " " + data.data[i].LASTNAME, "value": data.data[i].empId })
//           }
//         }
//       }
//     });
//   }
//   disableButton() {
//     this.DisableButton = this.DisableButton + 1;
//   }
//   imgUpload(e) {

//     if (e.success) {
//       this.EmpForm.controls['departmentLogo'].setValue(e.UserImg);
//     }

//     this.DisableButton = this.DisableButton - 1;
//   }
//   BackgroundImgUpload(e) {
//     if (e.success) {
//       this.EmpForm.controls['departmentBackground'].setValue(e.UserImg);
//     }

//     this.DisableButton = this.DisableButton - 1;
//   }
//   BannerImgUpload(e) {
//     if (e.success) {
//       this.EmpForm.controls['departmentBanner'].setValue(e.UserImg);
//     }

//     this.DisableButton = this.DisableButton - 1;
//   }
//   saveEmpData() {

//     this.service.edit(this.EmpForm.value, this._globals.getUserId()).subscribe((data) => {
//       if (data.success) {
//         this.translate.get('alert.SaveDepSuccess').subscribe(value => { alert(value); });
//       } else if (data.code) {
//         // if(data.code==1) use if other code is set some time
//         this.translate.get('alert.EditDepFailPWExists').subscribe(value => { alert(value); });
//       } else {
//         this.translate.get('alert.EditDepFail').subscribe(value => { alert(value); });
//         this.postList = [];
//       }
//     });
//   }

// }
