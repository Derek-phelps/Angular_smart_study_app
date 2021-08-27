import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { TrainersService } from '../../trainers.service';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-trainers',
  templateUrl: './add-trainers.component.html',
  styleUrls: ['./add-trainers.component.scss']
})
export class AddTrainersComponent implements OnInit {
  public EmpForm: FormGroup;
  public departmentList = [];
  public CompanyList = [];
  public defaultPicture = 'assets/img/theme/no-photo.png';
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
  public webUrl = "";

  constructor(protected service: TrainersService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.EmpForm = this.formBuilder.group({
      FIRSTNAME: ['', Validators.required],
      LASTNAME: ['', Validators.required],
      MOBILEPHONE: ['', Validators.required],
      comapnyId: ['', Validators.required],
      departmentId: [''],
      GENDER: ['', Validators.required],
      empEdu: ['', Validators.required],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      CURRENTADDRESS: ['', Validators.required],
      Trainertitle: [''],
      TrainerPostion: [''],
      epath: [''],
      Signature: ['']
    });
    this.loadComapny();

  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
  }
  loadComapny() {
    this.service.getAllCompany().subscribe((data) => {
      if (data.success) {
        this.CompanyList = data.data;
      }
    });
  }
  loadDepartment(compId = null) {
    var obj = this;
    obj.CompanyList.forEach(function (e) {
      if (e.companyId == compId) {
        obj.webUrl = e.webUrl;
      }
    });
    // console.log(obj.webUrl);
    obj.service.getDepartment(compId).subscribe((data) => {
      if (data.success) {
        obj.departmentList = data.data;
      } else {
        obj.departmentList = [];
      }
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

    this.DisableButton = this.DisableButton - 1;
  }
  imgSignatureUpload(e) {
    if (e.success) {
      this.EmpForm.controls['Signature'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  saveEmpData() {

    this.service.add(this.EmpForm.value, this.webUrl).subscribe((data) => {
      if (data.success) {
        this.EmpForm.reset();
        this.translate.get('alert.SaveTrainerSuccess').subscribe(value => { alert(value); });
      } else {
        this.translate.get('alert.AddTrainerFail').subscribe(value => { alert(value); });
      }
    });
  }
}
