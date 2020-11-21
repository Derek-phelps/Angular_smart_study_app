import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { AdminEmployeeService } from '../../adminEmployee.service';
import { TranslateService } from '@ngx-translate/core';

import { Globals } from '../../../../common/auth-guard.service';

@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
  styleUrls: ['./add-employees.component.scss']
})
export class AddEmployeesComponent implements OnInit {

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
  public strProfilePicture = "";

  constructor(protected service: AdminEmployeeService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.translate.get('employees.ProfilePicture').subscribe(value => { this.strProfilePicture = value; });

    this.setDefaultFormValues();
    if (this._globals.companyInfo.companyId > 0) {
      this.loadDepartment(this._globals.companyInfo.companyId);
    }

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
  loadDepartment(compId = null) {
    if (compId == null) {
      compId = this.EmpForm.value.comapnyId
    }
    // this.service.getAllpost(compId).subscribe((data) => {
    //   if (data.success) {
    //     this.postList = data.data;
    //   } else {
    //     this.postList = [];
    //   }
    // });
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
  setDefaultFormValues() {
    this.EmpForm = this.formBuilder.group({
      FIRSTNAME: ['', Validators.required],
      LASTNAME: [''],
      GENDER: ['', Validators.required],
      departmentId: [''],
      postOfDepartment: [''],
      MARITALSTATUS: [''],
      MOBILEPHONE: [''],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      FatherName: [''],
      MotherName: [''],
      epath: [''],
      CURRENTADDRESS: [''],
      empEdu: [''],
      comapnyId: [this._globals.companyInfo.companyId, Validators.required],
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

    this.service.add(this.EmpForm.value, [], []).subscribe((data) => {
      //console.log(data);
      if (data.success) {
        //this.EmpForm.reset();
        this.setDefaultFormValues();
        this.profile = 'assets/img/theme/no-photo.png';
        this.translate.get('alert.SaveEmpSuccess').subscribe(value => { alert(value); });
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
}
