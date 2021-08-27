import { Component, ViewChildren, QueryList, OnInit, Directive, Input } from '@angular/core';
import { ProfileService } from './profile.service';
import { Validators, FormBuilder, FormGroup, NgControl } from '@angular/forms';
import { Globals } from '../common/auth-guard.service';
import { UploadInput } from 'ngx-uploader';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public bIsAdUser = true;

  public EmpForm: FormGroup;
  public EmpPasswordForm: FormGroup;
  public postList = [];
  public departmentList = [];
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public defaultBGPicture = 'assets/img/theme/no-photo.png';
  public profile: String = "";
  public imgPath = "";
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
  public strProfilePicture = "";
  public strSignature = "";

  constructor(public _globals: Globals, protected service: ProfileService, private formBuilder: FormBuilder, private translate: TranslateService,
    private _location: Location, private spinner: NgxSpinnerService) {

    this.spinner.show();
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.translate.get('employees.ProfilePicture').subscribe(value => { this.strProfilePicture = value; });
    this.translate.get('certificate.TrainerSignature').subscribe(value => { this.strSignature = value; });

    this.EmpPasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      ConfirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
    this.EmpForm = this.formBuilder.group({
      FIRSTNAME: ['', Validators.required],
      userType: [''],
      LASTNAME: ['', Validators.required],
      FULLNAME: ['', Validators.required],
      GENDER: [''],
      staffNumber: [''],
      departmentId: [''],
      postOfDepartment: [''],
      MOBILEPHONE: [''],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      CURRENTADDRESS: [''],
      epath: [''],
      eSignaturepath: [''],
      //empEdu: [''],
      departmentIds: [[]],
      groupIds: [[]],
      Trainertitle: [''],
      TrainerPostion: [''],
      departmentRights: [[]],
      groupRights: [[]]
    });
    setTimeout(() => {
      this.loadEditEmployees();
      this.getDepartment();
      //this.getAllpost();
      this.uploaderOptions.url = this._globals.APIURL + 'Company/userImgUpload?folderName=Employee';
      this.uploaderSignatureOptions.url = this._globals.APIURL + 'Company/userImgUpload?folderName=Employee&SubfolderName=Signature';
    }, 100);

  }
  ngOnDestroy() {

  }
  getDepartment() {
    // if (this._globals.getUserType() == "1") {
    //   this.service.getAllDepartment().subscribe((data) => {
    //     if (data.success) {
    //       this.departmentList = data.data;
    //     } else {
    //       this.departmentList = [];
    //     }
    //   });
    // } else if (this._globals.getUserType() == "2") {
    //   this.service.getDepartment().subscribe((data) => {
    //     if (data.success) {
    //       this.departmentList = data.data;
    //     } else {
    //       this.departmentList = [];
    //     }
    //   });
    // } else if (this._globals.getUserType() == "3") {
    //   if (this._globals.companyInfo.companyId > 0) {
    //     this.service.getDepartment().subscribe((data) => {
    //       if (data.success) {
    //         this.departmentList = data.data;
    //       } else {
    //         this.departmentList = [];
    //       }
    //     });
    //   } else {
    //     this.service.getAllDepartment().subscribe((data) => {
    //       if (data.success) {
    //         this.departmentList = data.data;
    //       } else {
    //         this.departmentList = [];
    //       }
    //     });
    //   }
    // } else {
    //   this.service.getDepartment().subscribe((data) => {
    //     if (data.success) {
    //       this.departmentList = data.data;
    //     } else {
    //       this.departmentList = [];
    //     }
    //   });
    // }
  }
  getAllpost() {
    if (this._globals.getUserType() == "1") {
      this.service.getAllpost().subscribe((data) => {
        if (data.success) {
          this.postList = data.data;
        } else {
          this.postList = [];
        }
      });
    } else if (this._globals.getUserType() == "2") {
      this.service.getpost().subscribe((data) => {
        if (data.success) {
          this.postList = data.data;
        } else {
          this.postList = [];
        }
      });
    } else if (this._globals.getUserType() == "3") {
      if (this._globals.companyInfo.companyId > 0) {
        this.service.getpost().subscribe((data) => {
          if (data.success) {
            this.postList = data.data;
          } else {
            this.postList = [];
          }
        });
      } else {
        this.service.getAllpost().subscribe((data) => {
          if (data.success) {
            this.postList = data.data;
          } else {
            this.postList = [];
          }
        });
      }
    } else {
      this.service.getpost().subscribe((data) => {
        if (data.success) {
          this.postList = data.data;
        } else {
          this.postList = [];
        }
      });
    }

  }
  loadEditEmployees() {
    this.bIsAdUser = true;
    this.service.getById().subscribe((data) => {
      if (data.success) {
        //console.log(data.data);
        this.EmpForm.setValue({
          FIRSTNAME: data.data.FIRSTNAME,
          userType: Number(data.data.userType),
          LASTNAME: data.data.LASTNAME,
          FULLNAME: data.data.FULLNAME,
          GENDER: data.data.GENDER,
          staffNumber: data.data.staffNumber,
          postOfDepartment: data.data.positionId ? data.data.positionId : 0,
          departmentId: data.data.departmentId,
          MOBILEPHONE: data.data.MOBILEPHONE,
          EMAIL: data.data.EmailID,
          CURRENTADDRESS: data.data.CURRENTADDRESS,
          //empEdu: data.data.empEdu ? data.data.empEdu : data.data.trainerEdu,
          departmentIds: data.data.departmentIds,
          groupIds: data.data.groupIds,
          epath: data.data.epath,
          eSignaturepath: data.data.Signature ? data.data.Signature : '',
          Trainertitle: data.data.trainerTitle ? data.data.trainerTitle : "",
          TrainerPostion: data.data.trainerPostion ? data.data.trainerPostion : "",
          departmentRights: data.data.departmentRights,
          groupRights: data.data.groupRights
        });

        if (data.data.epath && data.data.epath != null && data.data.epath != '') {
          this.profile = this._globals.WebURL + '/' + data.data.epath;
        }

        this.bIsAdUser = (data.data.ADUser == '1');

        // if (!data.data.trainerTitle) {
        //   this.defaultPicture = this._globals.adminURL + "/" + data.data.webUrl + "/" + data.data.epath
        // } else {
        //   this.defaultPicture = this._globals.WebURL + "/" + data.data.epath;
        // }

        // if (!data.data.trainerTitle) {
        //   this.defaultBGPicture = this._globals.adminURL + "/" + data.data.webUrl + "/" + data.data.Signature
        // } else {
        //   this.defaultBGPicture = this._globals.WebURL + "/" + data.data.Signature;
        // }
      }
      this.spinner.hide();
    });
  }
  disableButton() {
    this.DisableButton = this.DisableButton + 1;
  }
  SignatureImgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['eSignaturepath'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  imgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['epath'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  saveEmpData() {
    //console.log(this.EmpForm.value);

    var name = this.EmpForm.getRawValue().FIRSTNAME.toLowerCase();
    var surName = this.EmpForm.getRawValue().LASTNAME.toLowerCase();
    var fullName = this.EmpForm.getRawValue().FULLNAME.toLowerCase();

    if (!fullName.includes(name)) {
      alert(this.translate.instant('profilePage.IncludeName'));
    } else if (!fullName.includes(surName)) {
      alert(this.translate.instant('profilePage.IncludeSurname'));
    } else {
      this.spinner.show();
      this.service.edit(this.EmpForm.getRawValue()).subscribe((data) => {
        if (data.success) {
          this.translate.get('alert.UpdateProfileSuccess').subscribe(value => { alert(value); });
          this._location.back();
        } else {
          this.postList = [];
          this.spinner.hide();
        }
      });
    }
  }
  changedPassword() {
    if (!this.EmpPasswordForm.value.oldPassword) {
      this.translate.get('alert.UpdateProfileSuccess').subscribe(value => { alert(value); });
      return false;
    }
    if (!this.EmpPasswordForm.value.newPassword) {
      this.translate.get('alert.EnterNewPW').subscribe(value => { alert(value); });
      return false;
    }
    if (!this.EmpPasswordForm.value.ConfirmPassword) {
      this.translate.get('alert.EnterConfPW').subscribe(value => { alert(value); });
      return false;
    }
    if (this.EmpPasswordForm.value.ConfirmPassword != this.EmpPasswordForm.value.newPassword) {
      this.translate.get('alert.NewConfMismatch').subscribe(value => { alert(value); });
      return false;
    }
    this.spinner.show();
    this.service.changedPass(this.EmpPasswordForm.value).subscribe((data) => {
      if (data.success) {
        this.translate.get('alert.UpdatePWSuccess').subscribe(value => { alert(value); });
        this.EmpPasswordForm.reset();
        this._location.back();
      } else {
        this.translate.get('alert.EnterProperPW').subscribe(value => { alert(value); });
        this.spinner.hide();
      }
    });
  }
  ngOnInit() {
  }

}


@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    setTimeout(() => {
      this.ngControl.control[action]();
    });
  }

  constructor(private ngControl: NgControl) {
  }

}