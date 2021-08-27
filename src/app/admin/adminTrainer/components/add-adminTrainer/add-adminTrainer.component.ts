import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { AdminTrainerService } from '../../adminTrainer.service';
import { Globals } from '../../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-adminTrainer',
  templateUrl: './add-adminTrainer.component.html',
  styleUrls: ['./add-adminTrainer.component.scss']
})
export class AddAdminTrainerComponent implements OnInit {

  public EmpForm: FormGroup;


  public departmentList = [];
  public CompanyList = [];
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public defaultBGPicture = 'assets/img/theme/no-photo.png';
  public profile: String = "";
  public imgPath = "";
  public strProfilePicture = "";
  public strSignature = "";
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
  constructor(protected service: AdminTrainerService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
    
    this.translate.get('employees.ProfilePicture').subscribe(value => { this.strProfilePicture = value; });
    this.translate.get('certificate.TrainerSignature').subscribe(value => { this.strSignature = value; });

    this.setDefaultFormValues();

    if (this._globals.companyInfo.companyId > 0) {
      this.loadDepartment(this._globals.companyInfo.companyId);
    }

  }
  setDefaultFormValues() {
    this.EmpForm = this.formBuilder.group({
      FIRSTNAME: ['', Validators.required],
      LASTNAME: ['', Validators.required],
      GENDER: [''],
      postOfDepartment: [''],
      MOBILEPHONE: [''],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      epath: [''],
      CURRENTADDRESS: [''],
      empEdu: [''],
      comapnyId: [this._globals.companyInfo.companyId],
      Trainertitle: ['', Validators.required],
      TrainerPostion: ['', Validators.required],
      eSignaturepath: [''],
    });
  }
  SignatureImgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['eSignaturepath'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  loadDepartment(compId = null) {
    this.EmpForm.controls['comapnyId'].setValue(this._globals.companyInfo.companyId);
    if (compId == null) {
      compId = this.EmpForm.value.comapnyId
    }

    this.service.getDepartment(compId).subscribe((data) => {
      if (data.success) {
        this.departmentList = data.data;
      } else {
        this.departmentList = [];
      }
    });
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
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
  saveEmpData() {

    this.service.add(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        //this.EmpForm.reset();
        this.setDefaultFormValues();
        this.translate.get('alert.SaveTrainerSuccess').subscribe(value => { alert(value); });
      } else {
        this.translate.get('alert.AddTrainerFail').subscribe(value => { alert(value); });
        // alert(data.mes);
      }
    });
  }
}
