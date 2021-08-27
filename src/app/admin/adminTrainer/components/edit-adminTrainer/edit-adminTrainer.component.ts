import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { AdminTrainerService } from '../../adminTrainer.service';
import { ActivatedRoute } from "@angular/router";
import { Globals } from '../../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-adminTrainer',
  templateUrl: './edit-adminTrainer.component.html',
  styleUrls: ['./edit-adminTrainer.component.scss']
})
export class EditAdminTrainerComponent implements OnInit {

  public EmpForm: FormGroup;

  public CompanyList = [];
  public departmentList = [];
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
  constructor(protected service: AdminTrainerService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals, private route: ActivatedRoute) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
    
    this.translate.get('employees.ProfilePicture').subscribe(value => { this.strProfilePicture = value; });

    this.route.params.subscribe(params => {

      this.loadTrainrtById(params.id);
    });
    this.EmpForm = this.formBuilder.group({
      trainerId: ['', Validators.required],
      FIRSTNAME: ['', Validators.required],
      LASTNAME: ['', Validators.required],
      GENDER: [''],
      MOBILEPHONE: [''],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      epath: [''],
      CURRENTADDRESS: [''],
      empEdu: [''],
      comapnyId: ['', Validators.required],
      Trainertitle: ['', Validators.required],
      TrainerPostion: ['', Validators.required],
      eSignaturepath: [''],
    });

    function goodbye(e) {
      if (!e) e = window.event;
      //e.cancelBubble is supported by IE - this will kill the bubbling process.
      e.cancelBubble = true;
      e.returnValue = undefined; //This is displayed on the dialog

      //e.stopPropagation works in Firefox.
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    window.onbeforeunload = goodbye;
  }
  SignatureImgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['eSignaturepath'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  loadTrainrtById(trainerId) {
    this.service.getById(trainerId).subscribe((data) => {
      if (data.success) {

        this.EmpForm.setValue({
          trainerId: data.data[0].trainerId,
          FIRSTNAME: data.data[0].FIRSTNAME,
          LASTNAME: data.data[0].LASTNAME,
          GENDER: data.data[0].GENDER,
          MOBILEPHONE: data.data[0].MOBILEPHONE,
          EMAIL: data.data[0].EmailID,
          epath: data.data[0].epath,
          CURRENTADDRESS: data.data[0].CURRENTADDRESS,
          empEdu: data.data[0].trainerEdu,
          comapnyId: data.data[0].trainerCompId,
          Trainertitle: data.data[0].trainerTitle,
          TrainerPostion: data.data[0].trainerPostion,
          eSignaturepath: data.data[0].Signature
        });
        if (data.data[0].Signature == "") {
          this.defaultBGPicture = "";
        } else {
          this.defaultBGPicture = this._globals.WebURL + "/" + data.data[0].Signature;
        }

        if (data.data[0].epath == "") {
          this.profile = "";
        } else {
          this.profile = this._globals.WebURL + "/" + data.data[0].epath;
        }
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
    } else {
      this.profile = "";
    }

    this.DisableButton = this.DisableButton - 1;
  }

  saveEmpData() {

    this.service.edit(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        this.translate.get('alert.SaveTrainerSuccess').subscribe(value => { alert(value); });
      } else {
        this.translate.get('alert.EditTrainerFail').subscribe(value => { alert(value); });
        // alert(data.mes);
      }
    });
  }

}
