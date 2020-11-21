import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { Globals } from '../common/auth-guard.service';
import { Router } from '@angular/router';
import { RegistrationService } from './registration.service';
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public EmpForm: FormGroup;
  public postList = [];

  public departmentList = [];
  public CompanyList = [];
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile: String = "";
  public imgPath = "";
  public DisableButton = false;
  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Employee',
    method: 'POST',
    data: {}
  };
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, public router: Router, private _loginService: RegistrationService, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.companyInfo.defaultLang) {
      this.translate.use(this._globals.companyInfo.defaultLang);
    }

    this.EmpForm = this.formBuilder.group({
      userName: [''],
      FIRSTNAME: ['', Validators.required],
      LASTNAME: ['', Validators.required],
      FULLNAME: ['', Validators.required],
      GENDER: [''],
      departmentId: [''],
      MOBILEPHONE: [''],
      EMAIL: [''],
      epath: [''],
      CURRENTADDRESS: [''],
      empEdu: [''],
      comapnyId: [this._globals.companyInfo.companyId, Validators.required],
      NewPassword: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      teamCon1: ['', Validators.requiredTrue],
      teamCon2: [''],
    });
    this.route.params.subscribe(params => {
      var obj = this;
      if (this._globals.currentRegId == '' || params.id != this._globals.currentRegId) {
        this.back();
      } else {
        setTimeout(function () {
          obj.loadDepartmentData();
          obj.uploaderOptions.url = obj._globals.APIURL + 'Company/userImgUpload?folderName=Employee';
        }, 100);
      }
    });
  }
  ngOnInit() {
  }
  loadDepartmentData() {
    this._loginService.getDepartment().subscribe((data) => {
      if (data.success) {
        this.EmpForm.controls['departmentId'].setValue(data.data.departmentId);
        this.EmpForm.controls['comapnyId'].setValue(this._globals.companyInfo.companyId);
      } else {
        alert(data.mes);
        this.postList = [];
      }
    });
  }
  disableButton() {
    this.DisableButton = true;
  }
  imgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['epath'].setValue(e.UserImg);
    } else {
      this.profile = "";
    }
    this.EmpForm.controls['comapnyId'].setValue(this._globals.companyInfo.companyId);

    this.DisableButton = false;
  }
  saveEmpData() {
    if (!this.EmpForm.value.teamCon1) {
      alert("Teamcondition 1 not set!"); // TODO: Set alert message here??
      return true;
    }
    //  if(!this.EmpForm.value.teamCon2){
    //   alert("Teamcondition 2 not set!"); // TODO: Set alert message here??
    //   return true;
    //  }
    if (this.EmpForm.value.NewPassword != this.EmpForm.value.ConfirmPassword) {
      this.translate.get('alert.NewConfMismatch').subscribe(value => { alert(value); });
      return true;
    }
    if (this.EmpForm.value.userName == "" && this.EmpForm.value.EMAIL == "") {
      this.translate.get('alert.EnterMailOrUserName').subscribe(value => { alert(value); });
      return true;
    }
    this._loginService.add(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        this.EmpForm.reset();
        this.profile = 'assets/img/theme/no-photo.png';
        this.translate.get('alert.RegSuccess').subscribe(value => { alert(value); });
        this.router.navigate([''], { skipLocationChange: false });
      } else if (data.code) {
        if (data.code == 1) {
          this.translate.get('alert.RegEmpFailDupRec').subscribe(value => { alert(value); });
        } else if (data.code == 2) {
          this.translate.get('alert.RegEmpFailNumEmpExc').subscribe(value => { alert(value); });
        } else {
          this.translate.get('alert.AddEmpFail').subscribe(value => { alert(value); });
        }

        this.postList = [];
      } else {
        this.translate.get('alert.AddEmpFail').subscribe(value => { alert(value); });
        // alert(data.mes);
        this.postList = [];
      }
    });
  }
  back() {
    this._globals.currentRegId = '';
    this.router.navigate([''], { skipLocationChange: false });
  }
}
