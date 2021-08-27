import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { Globals } from '../common/auth-guard.service';
import { Router } from '@angular/router';
import { TrainerRegistrationService } from './trainerRegistration.service';
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-trainerRegistration',
  templateUrl: './trainerRegistration.component.html',
  styleUrls: ['./trainerRegistration.component.scss']
})
export class TrainerRegistrationComponent implements OnInit {

  public EmpForm: FormGroup;
  public postList = [];

  public departmentList = [];
  public CompanyList = [];
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile: String = "";
  public DisableButton = 0;
  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Employee',
    method: 'POST',
    data: {}
  };
  public uploaderSignatureOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Employee&SubfolderName=Signature',
    method: 'POST',
    data: {}
  };
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, public router: Router, private _loginService: TrainerRegistrationService, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.EmpForm = this.formBuilder.group({
      userName: [''],
      FIRSTNAME: ['', Validators.required],
      LASTNAME: ['', Validators.required],
      MOBILEPHONE: [''],
      comapnyId: [this._globals.companyInfo.companyId],
      GENDER: [''],
      departmentId: [''],
      EMAIL: [''],
      epath: [''],
      CURRENTADDRESS: [''],
      empEdu: [''],
      Signature: [''],
      Trainertitle: [''],
      TrainerPostion: [''],
      NewPassword: ['', Validators.required],
      ConfirmPassword: [''],
      teamCon1: [''],
      teamCon2: [''],
    });
    this.route.params.subscribe(params => {
      var obj = this;
      setTimeout(function () {
        obj.EmpForm.controls['comapnyId'].setValue(obj._globals.companyInfo.companyId);
        obj.uploaderOptions.url = obj._globals.APIURL + 'Company/userImgUpload?folderName=Employee';
        obj.uploaderSignatureOptions.url = obj._globals.APIURL + 'Company/userImgUpload?folderName=Employee&SubfolderName=Signature';
      }, 100);
    });
  }
  ngOnInit() {
  }
  disableButton() {
    this.DisableButton = this.DisableButton + 1;
  }
  imgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['epath'].setValue(e.UserImg);
    }
    this.EmpForm.controls['comapnyId'].setValue(this._globals.companyInfo.companyId);

    this.DisableButton = this.DisableButton - 1;
  }
  imgSignatureUpload(e) {
    if (e.success) {
      this.EmpForm.controls['Signature'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  saveEmpData() {
    if (!this.EmpForm.value.teamCon1) {
      alert(""); // TODO: Set alert message here??
      return true;
    }
    if (!this.EmpForm.value.teamCon2) {
      alert(""); // TODO: Set alert message here??
      return true;
    }
    if (this.EmpForm.value.NewPassword != this.EmpForm.value.ConfirmPassword) {
      this.translate.get('alert.NewConfMismatch').subscribe(value => { alert(value); });
      return true;
    }
    if (this.EmpForm.value.userName == "" && this.EmpForm.value.EMAIL == "") {
      this.translate.get('alert.NewConfMismatch').subscribe(value => { alert(value); });
      return true;
    }
    this._loginService.add(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        this.EmpForm.reset();
        this.profile = 'assets/img/theme/no-photo.png';
        this.translate.get('alert.RegSuccess').subscribe(value => { alert(value); });
      } else {
        alert(data.mes); // TODO: Translate?
        this.postList = [];
      }
    });
  }
}
