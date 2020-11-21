import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { SuperadminService } from '../../../superadmin.service';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Globals } from '../../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {
  public EmpForm: FormGroup;
  public postList = [];
  public Courses = [];
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile: String = "";
  public imgPath = "";
  public isNext = false;
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
  constructor(protected service: SuperadminService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.EmpForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      companyLogo: ['', Validators.required],
      companyRegNo: ['', Validators.required],
      NumOfEmp: ['', Validators.required],
      compUrl: ['', Validators.required],
      webUrl: ['', Validators.required],
      baner: [''],
      BackgroundImage: [''],
      adminEmail: ['', Validators.required],
      adminPassword: ['', Validators.required],
      CourseList: this.formBuilder.array([])
    });

  }

  public nextBut() {
    this.isNext = true;
    this.uploaderOptions.url = this._globals.APIURL + 'Company/CompanyImgUpload?folderName=Company&folder=' + this.EmpForm.value.webUrl;
    this.uploaderBannerOptions.url = this._globals.APIURL + 'Company/CompanyImgUpload?folderName=Company&SubfolderName=banner&folder=' + this.EmpForm.value.webUrl;
    this.uploaderBackgroundOptions.url = this._globals.APIURL + 'Company/CompanyImgUpload?folderName=Company&SubfolderName=background&folder=' + this.EmpForm.value.webUrl;
  }
  public addCourse() {
    const control = <FormArray>this.EmpForm.controls['CourseList'];
    control.insert(0, this.initChapter());
  }
  initChapter() {
    return this.formBuilder.group({
      'courseId': ['', Validators.required],
      'companyId': [0],
      'departmentId': [0],
      'isReadOnly': [0]
    });
  }
  public removeChapter(i) {
    if (window.confirm('Do you really want to delete the Chapter?"')) {
      const control = <FormArray>this.EmpForm.controls['CourseList'];
      control.removeAt(i);
    }
  }
  ngOnInit() {
    this.service.getAllCourse().subscribe((data) => {
      if (data.success) {
        this.Courses = data.data;
      }
    });
  }
  onBlurMethod() {
    var email = this.EmpForm.value.adminEmail;
    this.service.emailExist(email).subscribe((data) => {
      if (data.success) {
        alert("Duplicate admin email id");
        this.EmpForm.controls['adminEmail'].setValue('');
      }
    });
  }
  imgUpload(e) {

    if (e.success) {
      this.EmpForm.controls['companyLogo'].setValue(e.UserImg);
    }
    // console.log(this.EmpForm.value);
  }
  BackgroundImgUpload(e) {
    // console.log(e);
    if (e.success) {
      this.EmpForm.controls['BackgroundImage'].setValue(e.UserImg);
    }
  }
  BannerImgUpload(e) {
    // console.log(e);
    if (e.success) {
      this.EmpForm.controls['baner'].setValue(e.UserImg);
    }
  }
  saveEmpData() {

    this.service.addCompany(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        this.EmpForm.reset();
        this.translate.get('alert.SaveCompanySuccess').subscribe(value => { alert(value); });
        this.profile = 'assets/img/theme/no-photo.png';
      } else {
        this.translate.get('alert.AddCompFail').subscribe(value => { alert(value); });
        this.postList = [];
      }
    });
  }
}
