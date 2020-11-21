import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { CertificaterService } from '../../certificater.service';
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { Globals } from '../../../common/auth-guard.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-admin-certificater',
  templateUrl: './edit-admin-certificater.component.html',
  styleUrls: ['./edit-admin-certificater.component.scss']
})
export class EditAdminCertificaterComponent implements OnInit {
  public EmpForm: FormGroup;

  CourseList = [];

  public Picture = '';
  public BgPicture = '';
  public BannerPicture = '';
  public profile: String = 'assets/img/theme/add-image.png';
  public CompanyList = [];
  public DisableButton = 0;

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

  constructor(protected service: CertificaterService, private formBuilder: FormBuilder, private translate: TranslateService,
    public _globals: Globals, private route: ActivatedRoute, private _location: Location, private spinner: NgxSpinnerService,
    public router: Router) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.spinner.show();

    this.translate.get('certificate.Signature').subscribe(value => { this.strSignature = value; });
    this.translate.get('certificate.Background').subscribe(value => { this.strBackground = value; });
    this.translate.get('certificate.Logo').subscribe(value => { this.strLogo = value; });

    this.route.params.subscribe(params => { this.loadCertificaterById(params.id); });
    this.service.getAllCourseByCompany(this._globals.companyInfo.companyId).subscribe((data) => {
      if (data.success) {
        this.CourseList = data.data;
      } else {
      }
    });
    this.EmpForm = this.formBuilder.group({
      certificaterId: [''],
      CertificateName: [''],
      CertificateTitle: ['', Validators.required],
      Course: ['', Validators.required],
      CertificateSignature: [''],
      CertificateBg: [''],
      CertificateLogo: [''],
      courseplease: ['', Validators.required],
      bossTitleName: ['', Validators.required],
      bossPosition: ['', Validators.required],
      heldBy: ['']
    });

  }
  loadCertificaterById(CerId) {
    this.service.getCertificateById(CerId).subscribe((data) => {
      if (data.success) {
        this.EmpForm.setValue({
          certificaterId: data.data.certificaterId,
          CertificateName: data.data.CertificateName,
          CertificateTitle: data.data.CertificateTitle,
          Course: data.data.Course,
          CertificateSignature: data.data.SignatureimgPath,
          CertificateBg: data.data.imgPath,
          CertificateLogo: data.data.companyLogo,
          bossTitleName: data.data.bossTitleName,
          bossPosition: data.data.bossPosition,
          courseplease: data.data.coursePlease,
          heldBy: data.data.heldBy ? data.data.heldBy : ''
        });
        this.Picture = "";
        this.BgPicture = "";
        this.BannerPicture = "";

        if (data.data.SignatureimgPath != '') {
          this.Picture = this._globals.WebURL + '/' + data.data.SignatureimgPath;
        }
        if (data.data.imgPath != '') {
          this.BgPicture = this._globals.WebURL + '/' + data.data.imgPath;
        }
        if (data.data.companyLogo != '') {
          this.BannerPicture = this._globals.WebURL + '/' + data.data.companyLogo;
        }
      }
      this.spinner.hide();
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
    this.EmpForm.value.heldBy = this.EmpForm.value.heldBy.trim();
    this.service.editCertificate(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        //this.EmpForm.reset();
        // this.translate.get('alert.SaveCertificateSuccess').subscribe(value => { alert(value); });
        // this._location.back();
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
        this.router.navigate([path + this.EmpForm.value.Course + '/4'], { skipLocationChange: false });
      } else {
        this.translate.get('alert.EditCertFail').subscribe(value => { alert(value); });
      }
    });
  }

  cancel() {
    this._location.back();
  }
}