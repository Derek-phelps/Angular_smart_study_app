import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { SuperadminService } from '../../../superadmin.service';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ActivatedRoute } from "@angular/router";
import { Globals } from '../../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit {

  public EmpForm: FormGroup;
  public postList = [];
  public Courses = [];
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public BackgroundDefaultPicture = 'assets/img/theme/no-photo.png';
  public BannerDefaultPicture = 'assets/img/theme/no-photo.png';
  public profile: String = "";
  public imgPath = "";
  public Department = [];
  public companyId = 0;
  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Company',
    method: 'POST',
    data: {}
  };
  public uploaderBannerOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Company&SubfolderName=banner',
    method: 'POST',
    data: {}
  };
  public uploaderBackgroundOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Company&SubfolderName=background',
    method: 'POST',
    data: {}
  };

  constructor(protected service: SuperadminService, private formBuilder: FormBuilder,
    private route: ActivatedRoute, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    var obj = this;
    obj.route.params.subscribe(params => {
      obj.companyId = params.id;
      obj.service.getAllCourse().subscribe((data) => {
        if (data.success) {
          obj.Courses = data.data;
        }
        obj.loadAllDepartment(params.id);
        obj.loadCompanyById(params.id);
      });

    });
    this.EmpForm = this.formBuilder.group({
      companyId: ['', Validators.required],
      companyName: ['', Validators.required],
      companyLogo: ['', Validators.required],
      companyRegNo: ['', Validators.required],
      NumOfEmp: ['', Validators.required],
      compUrl: ['', Validators.required],
      webUrl: ['', Validators.required],
      baner: [''],
      BackgroundImage: [''],
      CourseList: this.formBuilder.array([])
    });

  }

  public addCourse() {
    const control = <FormArray>this.EmpForm.controls['CourseList'];
    control.insert(0, this.initChapter());
  }
  initChapter() {
    return this.formBuilder.group({
      'courseId': ['', Validators.required],
      'companyId': [this.companyId],
      'departmentId': [0],
      'isReadOnly': [0]
    });
  }
  public removeChapter(i, obj) {
    if (window.confirm('Do you really want to delete the Chapter?"')) {
      const control = <FormArray>this.EmpForm.controls['CourseList'];
      control.removeAt(i);
      this.service.deleteCourse(obj.value.courseId).subscribe((res) => {
        // console.log(res);
        if (res.success) {
        }
      });
    }
  }
  public loadAllDepartment(companyId) {
    this.service.getAllDepartment(companyId).subscribe((data) => {
      if (data.success) {
        this.Department = data.data;
      }
    });
  }
  ngOnInit() {

  }
  loadCompanyById(comId) {
    this.service.getCompanyWithCompanyById(comId).subscribe((res) => {
      // console.log(res);

      if (res.success) {
        var comp = res.data[0];
        var webUrl = comp.webUrl.replace(".smart-study.at", "")
        this.defaultPicture = this._globals.adminURL + "/" + webUrl + "/API/img/Company/" + comp.companyLogo;
        this.BackgroundDefaultPicture = this._globals.adminURL + "/" + webUrl + "/API/img/Company/background/" + comp.BackgroundImage;
        this.BannerDefaultPicture = this._globals.adminURL + "/" + webUrl + "/API/img/Company/banner/" + comp.baner;
        var CourseList = comp.Courses;
        var Course = [];
        for (var i = 0; i < CourseList.length; i++) {
          this.addCourse();
          Course.push({
            "courseId": CourseList[i].courseId,
            'companyId': CourseList[i].companyId,
            'departmentId': CourseList[i].departmentId,
            'isReadOnly': 1
          });
        }
        this.EmpForm.setValue({
          "BackgroundImage": comp.BackgroundImage,
          "NumOfEmp": comp.NumOfEmp,
          "baner": comp.baner,
          "compUrl": comp.compUrl,
          "companyId": comp.companyId,
          "companyLogo": comp.companyLogo,
          "companyName": comp.companyName,
          "companyRegNo": comp.companyRegNo,
          "webUrl": webUrl,
          "CourseList": Course
        });

        this.uploaderOptions.url = this._globals.adminURL + '/API/index.php/Company/CompanyImgUpload?folderName=Company&folder=' + comp.webUrl;
        this.uploaderBannerOptions.url = this._globals.adminURL + '/API/index.php/Company/CompanyImgUpload?folderName=Company&SubfolderName=banner&folder=' + comp.webUrl;
        this.uploaderBackgroundOptions.url = this._globals.adminURL + '/API/index.php/Company/CompanyImgUpload?folderName=Company&SubfolderName=background&folder=' + comp.webUrl;

      }
    });
  }

  imgUpload(e) {

    if (e.success) {
      this.imgPath = e.UserImg;
      this.EmpForm.controls['companyLogo'].setValue(e.UserImg);
    } else {
      this.profile = "";
    }
  }
  BackgroundImgUpload(e) {
    // console.log(e);
    if (e.success) {
      this.imgPath = e.UserImg;
      this.EmpForm.controls['BackgroundImage'].setValue(e.UserImg);
    } else {
      this.profile = "";
    }
  }
  BannerImgUpload(e) {
    // console.log(e);
    if (e.success) {
      this.imgPath = e.UserImg;
      this.EmpForm.controls['baner'].setValue(e.UserImg);
    } else {
      this.profile = "";
    }
  }
  saveEmpData() {

    this.service.editCompany(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        this.translate.get('alert.UpdateCompanySuccess').subscribe(value => { alert(value); });
      } else {
        this.translate.get('alert.EditCompFail').subscribe(value => { alert(value); });
        this.postList = [];
      }
    });
  }

}
