import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { CertificaterService } from '../../certificater.service';
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MM.YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MM.YYYY',
  },
};

@Component({
  selector: 'app-add-admin-certificater',
  templateUrl: './add-admin-certificater.component.html',
  styleUrls: ['./add-admin-certificater.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    }
  ]
})
export class AddAdminCertificaterComponent implements OnInit {

  public EmpForm: FormGroup;
  fixedDate: any = undefined;

  CourseList = [];

  public defaultPicture = 'assets/img/theme/add-image.png';
  public profile: String = "";
  public CompanyList = [];

  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Certificate',
    method: 'POST',
    data: {}
  };
  public uploaderBannerOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Certificate&SubfolderName=banner',
    method: 'POST',
    data: {}
  };
  public uploaderBackgroundOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Certificate&SubfolderName=Bg',
    method: 'POST',
    data: {}
  };
  public strSignature = "";
  public strBackground = "";
  public strLogo = "";
  public DisableButton = 0;

  constructor(protected service: CertificaterService, private formBuilder: FormBuilder, private translate: TranslateService,
    public _globals: Globals, private spinner: NgxSpinnerService, public router: Router, private route: ActivatedRoute, private _location: Location) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    // this.route.params.subscribe(params => {
    //   console.warn(params);
    // });

    this.translate.get('certificate.Signature').subscribe(value => { this.strSignature = value; });
    this.translate.get('certificate.Background').subscribe(value => { this.strBackground = value; });
    this.translate.get('certificate.Logo').subscribe(value => { this.strLogo = value; });

    this.fixedDate = new FormControl();

    this.service.getAllCourseByCompany(this._globals.companyInfo.companyId).subscribe((data) => {
      if (data.success) {
        this.CourseList = data.data;
      }
      this.spinner.hide();
    });
    //certificaterId
    var obj = this;
    this.route.params.subscribe(params => {
      if (params.course && params.course != '') {
        obj.setDefaultFormValues(params.course);
      } else {
        obj.setDefaultFormValues();
      }
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
  setDefaultFormValues(course = '') {
    this.EmpForm = this.formBuilder.group({

      CertificateName: ['', Validators.required],
      CertificateTitle: ['', Validators.required],
      Course: [course, Validators.required],
      CertificateSignature: [''],
      CertificateBg: [''],
      CertificateLogo: [''],
      courseplease: ['', Validators.required],
      bossTitleName: ['', Validators.required],
      bossPosition: ['', Validators.required],
      heldBy: ['']
    });
  }
  loadDepartment(compId = null) {
    if (compId == null) {
      compId = this.EmpForm.value.comapnyId
    }
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
      this.EmpForm.controls['CertificateSignature'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  BackgroundImgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['CertificateBg'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  BannerImgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['CertificateLogo'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  saveEmpData() {
    this.spinner.show();
    let fixed = this.fixedDate.value ? this.fixedDate.value.format('YYYY-MM-DD') : null;
    let course = this.EmpForm.value.Course;
    this.EmpForm.value.heldBy = this.EmpForm.value.heldBy.trim();
    this.service.addCertificate(this.EmpForm.value, fixed).subscribe((data) => {
      if (data.success) {
        //this.EmpForm.reset();
        this.setDefaultFormValues();
        //this.translate.get('alert.SaveCertificateSuccess').subscribe(value => { alert(value); });
        this.profile = 'assets/img/theme/no-photo.png';
      } else if (data.code == '2') {
        this.translate.get('alert.AddCertFailDup').subscribe(value => { alert(value); });
      } else {
        this.translate.get('alert.AddCertFail').subscribe(value => { alert(value); });
      }
      //this.spinner.hide();

      this.spinner.show();
      var path = "";
      if (this._globals.getUserType() == "1") {
        path = 'superadmin/course/view/';
      } else if (this._globals.getUserType() == "2") {
        path = 'admin/course/view/';
      } else if (this._globals.getUserType() == "3") {
        path = 'trainer/course/view/';
      } else {
        path = 'employee/course/view/';
      }
      this.router.navigate([path + course + '/4'], { skipLocationChange: false });
    });
  }

  cancel() {
    this._location.back();
  }
}