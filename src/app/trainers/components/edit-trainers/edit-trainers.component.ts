import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { TrainersService } from '../../trainers.service';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ActivatedRoute } from "@angular/router";
import { Globals } from '../../../common/auth-guard.service';

@Component({
  selector: 'app-edit-trainers',
  templateUrl: './edit-trainers.component.html',
  styleUrls: ['./edit-trainers.component.scss']
})
export class EditTrainersComponent implements OnInit {

  public EmpForm: FormGroup;
  public CompanyList = [];
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public defaultSignaturePicture = 'assets/img/theme/no-photo.png';
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
  constructor(protected service: TrainersService, private formBuilder: FormBuilder,
    private route: ActivatedRoute, public _globals: Globals) {
    this.loadComapny();
    this.route.params.subscribe(params => {
      this.loadCompanyById(params.id);
    });
    this.EmpForm = this.formBuilder.group({
      FIRSTNAME: ['', Validators.required],
      LASTNAME: ['', Validators.required],
      MOBILEPHONE: [''],
      comapnyId: [''],
      departmentId: [''],
      GENDER: [''],
      empEdu: [''],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      CURRENTADDRESS: [''],
      Trainertitle: [''],
      TrainerPostion: [''],
      epath: [''],
      Signature: [''],
      trainerId: ['', Validators.required],
    });

  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
  }
  loadCompanyById(comId) {
    this.service.getTrainersById(comId).subscribe((res) => {

      if (res.success) {
        this.EmpForm.setValue({
          FIRSTNAME: res.data[0].FIRSTNAME,
          LASTNAME: res.data[0].LASTNAME,
          MOBILEPHONE: res.data[0].MOBILEPHONE,
          comapnyId: res.data[0].companyId,
          departmentId: res.data[0].departmentId,
          GENDER: res.data[0].GENDER,
          empEdu: res.data[0].trainerEdu,
          EMAIL: res.data[0].EmailID,
          CURRENTADDRESS: res.data[0].CURRENTADDRESS,
          Trainertitle: res.data[0].trainerTitle,
          TrainerPostion: res.data[0].trainerPostion,
          epath: res.data[0].epath,
          Signature: res.data[0].Signature,
          trainerId: res.data[0].trainerId
        });
        if (res.data[0].epath != '') {
          if (res.data[0].companyId != 0) {
            this.defaultPicture = this._globals.adminURL + "/" + res.data[0].webUrl + "/" + res.data[0].epath;

          } else {
            this.defaultPicture = this._globals.adminURL + "/" + res.data[0].epath;

          }
        }
        if (res.data[0].Signature != '') {
          if (res.data[0].companyId != 0) {
            this.defaultSignaturePicture = this._globals.adminURL + "/" + res.data[0].webUrl + "/" + res.data[0].Signature

          } else {
            this.defaultSignaturePicture = this._globals.adminURL + "/" + res.data[0].Signature
          }
        }
      }
    });
  }
  loadComapny() {
    this.service.getAllCompany().subscribe((data) => {
      if (data.success) {
        this.CompanyList = data.data;
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
      this.EmpForm.controls['userPhoto'].setValue(e.UserImg);
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

    this.service.edit(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        alert("Update Successfully");
      } else {
        alert(data.mes);
      }
    });
  }
}
