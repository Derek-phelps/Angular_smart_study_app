import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { AdminService } from '../admin.service';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Globals } from '../../common/auth-guard.service';
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  animations: [
    trigger('openedChanged', [
      state('shown', style({ height: '*' })),
      state('hidden', style({ height: 0 })),
      transition('* => *', animate(200))
    ])
  ]
})
export class CompanyComponent implements OnInit {

  public EmpForm: FormGroup;

  bannerColor = '';

  public defaultPicture = 'assets/img/theme/add-image.png';
  public BackgroundDefaultPicture = 'assets/img/theme/add-image.png';
  public BannerDefaultPicture = 'assets/img/theme/add-image.png';

  public logoImage = '';
  public backgroundImage = '';
  public bannerImage = '';

  public profile: String = "";
  public imgPath = "";
  public strCompanyLogo = "";
  public strBackground = "";
  public strBanner = "";
  public DisableButton = 0;
  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Company',
    //this._globals.APIURL+'Company/userImgUpload',
    method: 'POST',
    data: {}
  };
  public uploaderBannerOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Company&SubfolderName=banner',
    //this._globals.APIURL+'Company/bannerImgUpload',
    method: 'POST',
    data: {}
  };
  public uploaderBackgroundOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Company&SubfolderName=background',
    //this._globals.APIURL+'Company/backgroundImgUpload',
    method: 'POST',
    data: {}
  };

  constructor(
    protected service: AdminService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private route: ActivatedRoute,
    public _globals: Globals,
    private spinner: NgxSpinnerService,
    private snackbar: MatSnackBar) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.translate.get('company.CompanyLogo').subscribe(value => { this.strCompanyLogo = value; });
    this.translate.get('company.CompanyBackground').subscribe(value => { this.strBackground = value; });
    this.translate.get('company.CompanyBanner').subscribe(value => { this.strBanner = value; });

    this.EmpForm = this.formBuilder.group({
      companyId: ['', Validators.required],
      companyName: ['', Validators.required],
      companyLogo: [''],
      companyRegNo: [''],
      compUrl: [''],
      baner: [''],
      //bannerColor: [''],
      BackgroundImage: [''],
      defaultLang: [''],
      assFilterBehaviour: ['shortest'],
      bSendMailReminder: [false],
      reminderInterval: ['0'],
      reminderDay: ['0'],
      showAllCourses: ['1']
    });
    var obj = this;
    setTimeout(function () {
      obj.uploaderOptions.url = obj._globals.APIURL + 'Company/userImgUpload?folderName=Company';
      obj.uploaderBannerOptions.url = obj._globals.APIURL + 'Company/userImgUpload?folderName=Company&SubfolderName=banner';
      obj.uploaderBackgroundOptions.url = obj._globals.APIURL + 'Company/userImgUpload?folderName=Company&SubfolderName=background';
    }, 100);

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

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.loadCompanyById(this._globals.companyInfo.companyId);
    }, 100);

  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
  }

  loadCompanyById(comId) {
    this.service.getCompanyById(comId).subscribe((res) => {
      if (res.success) {
        var compData = res.data[0];
        if (compData.baner && compData.baner != "") {
          //this.BannerDefaultPicture = this._globals.WebURL + "/" + compData.baner;
          this.bannerImage = this._globals.WebURL + "/" + compData.baner;
        }
        if (compData.companyLogo && compData.companyLogo != "") {
          //this.defaultPicture = this._globals.WebURL + "/" + compData.companyLogo;
          this.logoImage = this._globals.WebURL + "/" + compData.companyLogo;
        }
        if (compData.BackgroundImage && compData.BackgroundImage != "") {
          //this.BackgroundDefaultPicture = this._globals.WebURL + "/" + compData.BackgroundImage;
          this.backgroundImage = this._globals.WebURL + "/" + compData.BackgroundImage;
        }

        this.bannerColor = compData.bannerColor;

        this.EmpForm.setValue({
          "BackgroundImage": compData.BackgroundImage,
          "baner": compData.baner,
          // "bannerColor": compData.bannerColor,
          "compUrl": compData.compUrl,
          "companyId": compData.companyId,
          "companyLogo": compData.companyLogo,
          "companyName": compData.companyName,
          "companyRegNo": compData.companyRegNo,
          "defaultLang": compData.defaultLang,
          "assFilterBehaviour": compData.assFilterBehaviour,
          "bSendMailReminder": (compData.reminderInterval != '0'),
          "reminderInterval": compData.reminderInterval,
          "reminderDay": compData.reminderDay,
          "showAllCourses": compData.showAllCourses
        });
      }
      this.spinner.hide();
    });
  }
  disableButton() {
    this.DisableButton = this.DisableButton + 1;
  }
  imgUpload(e) {
    if (e.success) {
      //this.defaultPicture = this._globals.WebURL + "/" + e.UserImg;
      this.EmpForm.controls['companyLogo'].setValue(e.UserImg);
    } else {
      this.EmpForm.controls['companyLogo'].setValue('');
      this.profile = "";
    }

    this.DisableButton = this.DisableButton - 1;
  }
  BackgroundImgUpload(e) {
    //console.log(e);
    if (e.success) {

      this.EmpForm.controls['BackgroundImage'].setValue(e.UserImg);
    } else {
      this.profile = "";
    }

    this.DisableButton = this.DisableButton - 1;
  }
  BannerImgUpload(e) {
    //console.log(e);
    if (e.success) {
      //this.imgPath = e.UserImg;
      this.EmpForm.controls['baner'].setValue(e.UserImg);
    } else {
      this.profile = "";
    }

    this.DisableButton = this.DisableButton - 1;
  }
  saveEmpData() {
    this.spinner.show();
    this.service.editCompany(this.EmpForm.value, this.bannerColor).subscribe((data) => {
      if (data.success) {
        this.service.getCompanyById(this._globals.companyInfo.companyId).subscribe((res) => {
          if (res.success) {
            this._globals.setCompany(res.data[0]);
          }
        });
        // this.translate.get('alert.UpdateCompanySuccess').subscribe(value => { alert(value); });
        this.snackbar.open(this.translate.instant('alert.UpdateCompanySuccess'), '', { duration: 3000 });
      } else {
        this.translate.get('alert.EditCompFail').subscribe(value => { alert(value); });
        // alert(data.mes);
      }
      this.spinner.hide();
    });
  }
  onIntervalChange(event) {
    if (event.value == '31') {
      this.EmpForm.controls['reminderDay'].setValue('1');
    } else {
      this.EmpForm.controls['reminderDay'].setValue('0');
    }
  }
  onSendMailChange(event) {
    if (event.checked) {
      this.EmpForm.controls['reminderInterval'].setValue('7');
    } else {
      this.EmpForm.controls['reminderInterval'].setValue('0');
    }
    this.EmpForm.controls['reminderDay'].setValue('0');
  }
}
