import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { EmployeeService } from '../../../employee/employee.service';
import { ActivatedRoute } from "@angular/router";
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-employees',
  templateUrl: './edit-employees.component.html',
  styleUrls: ['./edit-employees.component.scss']
})
export class EditEmployeesComponent implements OnInit {

  public EmpForm: FormGroup;
  public postList = [];
  public CompanyList = [];
  public departmentList = [];
  public companyId = 0;
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
  constructor(protected service: EmployeeService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals, private route: ActivatedRoute) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.route.params.subscribe(params => {
      this.service.getAllcompany().subscribe((data) => {
        this.loadEmployessById(params.id);
        if (data.success) {
          this.CompanyList = data.data;
        } else {
          this.CompanyList = [];
        }
      });

    });
    this.EmpForm = this.formBuilder.group({
      empId: ['', Validators.required],
      FIRSTNAME: ['', Validators.required],
      LASTNAME: ['', Validators.required],
      GENDER: ['', Validators.required],
      departmentId: ['', Validators.required],
      postOfDepartment: [''],
      MOBILEPHONE: ['', Validators.compose([Validators.required])],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      epath: [''],
      CURRENTADDRESS: [''],
      empEdu: ['', Validators.required]
    });

  }
  ngOnDestroy() {

  }
  loadDepartment(compId = null) {
    if (compId == null) {
      compId = this.EmpForm.value.comapnyId
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
  loadEmployessById(empId) {
    var obj = this;
    this.service.getEmployessById(empId).subscribe((data) => {
      if (data.success) {
        obj.companyId = data.data.empCompId;
        obj.loadDepartment(data.data.empCompId);
        obj.EmpForm.setValue({
          empId: data.data.empId,
          FIRSTNAME: data.data.FIRSTNAME,
          LASTNAME: data.data.LASTNAME,
          GENDER: data.data.GENDER,
          departmentId: data.data.departmentId,
          postOfDepartment: data.data.positionId,
          MOBILEPHONE: data.data.MOBILEPHONE,
          EMAIL: data.data.EmailID,
          epath: data.data.epath,
          CURRENTADDRESS: data.data.CURRENTADDRESS,
          empEdu: data.data.empEdu
        });
        obj.defaultPicture = this._globals.adminURL + "/" + data.data.webUrl + "/API/img/Employee/" + data.data.epath;
        if (obj._globals.companyInfo.companyId == 0) {
          obj.CompanyList.forEach(function (res) {
            if (res.companyId == obj.companyId) {
              obj.uploaderOptions.url = obj._globals.APIURL + 'Company/CompanyImgUpload?folderName=Employee&folder=' + res.webUrl;
            }
          });
        } else {
          obj.uploaderOptions.url = obj._globals.APIURL + 'Company/userImgUpload?folderName=Employee';
        }
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

    this.service.editEmployess(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        // this.profile = 'assets/img/theme/no-photo.png';
        this.translate.get('alert.SaveEmpSuccess').subscribe(value => { alert(value); });
      } else {
        this.translate.get('alert.EditEmpFail').subscribe(value => { alert(value); });
      }
    });
  }

}
