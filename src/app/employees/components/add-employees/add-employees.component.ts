import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { EmployeeService } from '../../../employee/employee.service';
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
  styleUrls: ['./add-employees.component.scss']
})
export class AddEmployeesComponent implements OnInit {

  public companyId = 0;
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
    url: '',
    method: 'POST',
    data: {}
  };

  constructor(protected service: EmployeeService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
    
    var obj = this;
    this.EmpForm = this.formBuilder.group({
      FIRSTNAME: ['', Validators.required],
      LASTNAME: ['', Validators.required],
      GENDER: ['', Validators.required],
      departmentId: [''],
      postOfDepartment: [''],
      MOBILEPHONE: ['', Validators.compose([Validators.required])],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      epath: [''],
      CURRENTADDRESS: [''],
      empEdu: ['', Validators.required],
      comapnyId: [this._globals.companyInfo.companyId, Validators.required],
    });
    if (this._globals.companyInfo.companyId > 0) {
      this.loadDepartment(this._globals.companyInfo.companyId);
    }
    setTimeout(function () {
      obj.loadCompany();
      obj.EmpForm.controls['comapnyId'].setValue(obj._globals.companyInfo.companyId);
    }, 100)

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
  ngOnDestroy() {
    window.onbeforeunload = undefined;
  }
  loadCompany() {
    this.service.getAllcompany().subscribe((data) => {
      if (data.success) {
        this.CompanyList = data.data;
      } else {
        this.CompanyList = [];
      }
    });
  }
  loadDepartment(compId = null) {
    var obj = this;
    this.companyId = compId;
    if (this._globals.companyInfo.companyId == 0) {
      this.CompanyList.forEach(function (res) {
        if (res.companyId == obj.companyId) {
          obj.uploaderOptions.url = obj._globals.APIURL + 'Company/CompanyImgUpload?folderName=Employee&folder=' + res.webUrl;
        }
      });
    } else {
      obj.uploaderOptions.url = this._globals.APIURL + 'Company/userImgUpload?folderName=Employee';
    }
    this.service.getPostByCompany(compId).subscribe((data) => {
      if (data.success) {
        this.postList = data.data;
      } else {
        this.postList = [];
      }
    });
    this.service.getDepartmentByCompany(compId).subscribe((data) => {
      if (data.success) {
        this.departmentList = data.data;
      } else {
        this.departmentList = [];
      }
    });
  }
  ngOnInit() {
  }
  disableButton() {
    this.DisableButton = true;
  }
  imgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['epath'].setValue(e.UserImg);
    }

    this.DisableButton = false;
  }
  saveEmpData() {

    this.service.addEmployess(this.EmpForm.value, this.companyId).subscribe((data) => {
      if (data.success) {
        this.EmpForm.reset();
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
