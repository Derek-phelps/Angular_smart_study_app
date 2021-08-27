import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AdminCourseService } from '../../adminCourse.service';
import { Globals } from '../../../../common/auth-guard.service';
//import { Component, OnInit , ViewChild } from '@angular/core';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup-course',
  templateUrl: './signupCourse.component.html',
  styleUrls: ['./signupCourse.component.scss']
})
export class SignupCourseComponent implements OnInit {
  public oSignUpForm: FormGroup;
  public oRadioForm: FormGroup;
  public oRegisterForm: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public isSmartStudyAccount: AbstractControl;
  public oCourse: any;
  public oCourseStartDate: Date = new Date();
  public strCourseName = "";
  public strProfilePicture = "";
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile: String = "";
  public DisableButton = false
  public wgList = [];
  public isLocReq = 0;

  constructor(
    public router: Router, 
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    protected service: AdminCourseService, 
    private translate: TranslateService, 
    private formBuilder: FormBuilder, 
    public _globals: Globals,
    private snackbar: MatSnackBar
    ) {
      
      if (this.translate.currentLang != this._globals.userInfo.userLang) {
        this.translate.use(this._globals.userInfo.userLang);
      }
      this._globals.currentTranslateService = this.translate;
      
      this.route.params.subscribe(params => {
        this.loadCourseById(params.id);
      });
      
      this.translate.get('employees.ProfilePicture').subscribe(value => { this.strProfilePicture = value; });

      this.setDefaultSignUpFormValues();

      this.email = this.oSignUpForm.controls['email'];
      this.password = this.oSignUpForm.controls['password'];

      this.oRadioForm = fb.group({
        'isSmartStudyAccount': ["1"]
      });
      this.isSmartStudyAccount = this.oRadioForm.controls['isSmartStudyAccount'];

      this.setDefaultRegisterFormValues();
  }

  setDefaultSignUpFormValues() {
    this.oSignUpForm = this.fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
  }
  setDefaultRegisterFormValues() {
    if (this.isLocReq == 1) {
      this.oRegisterForm = this.fb.group({
        userName: [''],
        FIRSTNAME: ['', Validators.required],
        LASTNAME: ['', Validators.required],
        TITLE: [''],
        AFTERTITLE: [''],
        GENDER: ['', Validators.required],
        departmentId: [''],
        MOBILEPHONE: [''],
        EMAIL: [''],
        workgroupId: ['', Validators.required],
        NewWorkGroupName: [''],
        epath: [''],
        CURRENTADDRESS: [''],
        empEdu: [''],
        comapnyId: [this._globals.companyInfo.companyId, Validators.required],
        NewPassword: [''],
        ConfirmPassword: [''],
        teamCon1: ['', Validators.requiredTrue],
        teamCon2: ['']
      });
    } 
    else {
      this.oRegisterForm = this.fb.group({
        userName: [''],
        FIRSTNAME: ['', Validators.required],
        LASTNAME: ['', Validators.required],
        TITLE: [''],
        AFTERTITLE: [''],
        GENDER: ['', Validators.required],
        departmentId: [''],
        MOBILEPHONE: [''],
        EMAIL: [''],
        workgroupId: [''],
        NewWorkGroupName: [''],
        epath: [''],
        CURRENTADDRESS: [''],
        empEdu: [''],
        comapnyId: [this._globals.companyInfo.companyId, Validators.required],
        NewPassword: [''],
        ConfirmPassword: [''],
        teamCon1: ['', Validators.requiredTrue],
        teamCon2: ['']
      });
    }

    this.oRadioForm.valueChanges.subscribe(() => { this.setDefaultRegisterFormValues(); });
  }

  ngOnInit() {
  }

  disableButton() {
    this.DisableButton = true;
  }
  imgUpload(e) {
    if (e.success) {
      this.oRegisterForm.controls['epath'].setValue(e.UserImg);
    } else {
      this.profile = "";
    }

    this.DisableButton = false;
  }
  loadCourseById(couId) {
    this.service.getCourseById(couId).subscribe((data) => {
      if (data.success) {
        this.oCourse = data.data;
        if (data.data.isLocReq == "1") { this.isLocReq = 1; }
        this.oCourseStartDate = new Date(data.data.startDate);
        this.strCourseName = data.data.courseName;
        this.loadWorkGroupIds(data.data.locationId);
      }
    });
  }
  signUpUserForCourse() {
    if (this.oSignUpForm.valid) {
      // TODO: make 1 query out of it
      this.service.getUserData(this.oSignUpForm.value).subscribe(user => {
        if (user.success) {
          if (this._globals.companyInfo.companyId == user.data.companyId) {
            if (user.data.UserType == 4) {
              this.service.assignCourse(this.oCourse.courseId, user.data.empId).subscribe((data) => {
                if (data.success) {
                  this.snackbar.open(this.translate.instant('alert.SuccessSignUp') + ": " + this.oCourse.courseName, '', { duration: 3000 });
                } 
                else if (data.code == 1) {
                  this.snackbar.open(this.translate.instant('alert.AddCourseEmpFailDuplicate'), '', { duration: 3000 });
                } 
                else {
                  this.snackbar.open(this.translate.instant('alert.AddCourseEmpFail'), '', { duration: 3000 });
                }
              });
            } 
            else {
              this.snackbar.open(this.translate.instant('alert.SignupAsEmp'), '', { duration: 3000 });
            }
          } 
          else {
            this.snackbar.open(this.translate.instant('alert.UnAuthCompSignup'), '', { duration: 3000 });
          }
        } 
        else {
          this.snackbar.open(this.translate.instant('alert.UnAuth'), '', { duration: 3000 });
        }
      });
    }
    this.setDefaultRegisterFormValues();
    this.oSignUpForm.controls['email'].setValue("");
    this.oSignUpForm.controls['password'].setValue("");
  }
  addPrivateWGRegisterAndSignupUserForCourse() {
    if (this.checkRegisterFormValidityAndAlert()) {
      if (this.oRegisterForm.value.workgroupId == '-1') {
        this.service.addPrivateNewWorkingGroup(this.oRegisterForm.value.NewWorkGroupName, this.oCourse.locationId).subscribe((data) => {
          if (data.success) {
            this.oRegisterForm.value.workgroupId = data.workgroupId;
            this.registerAndSignUpUserForCourse();
          } else {
            // TODO: alert!!!!
            console.warn(data);
          }
        });
      } else {
        this.registerAndSignUpUserForCourse();
      }
    } // else?
  }
  registerAndSignUpUserForCourse() {
    this.service.registerNewUser(this.oRegisterForm.value).subscribe((data) => {
      if (data.success && data.empId) {
        this.setDefaultRegisterFormValues();
        this.setDefaultSignUpFormValues();
        this.profile = 'assets/img/theme/no-photo.png';
        this.service.assignCourse(this.oCourse.courseId, data.empId).subscribe((data) => {
          if (data.success) {
            this.snackbar.open(this.translate.instant('alert.SuccessSignUp'), '', { duration: 3000 });
          } 
          else if (data.code == 1) {
            this.snackbar.open(this.translate.instant('alert.AddCourseEmpFailDuplicate'), '', { duration: 3000 });
          } 
          else {
            this.snackbar.open(this.translate.instant('alert.AddCourseEmpFail'), '', { duration: 3000 });
          }
        });
      } 
      else if (data.code) {
        if (data.code == 1) {
          this.snackbar.open(this.translate.instant('alert.RegEmpFailDupRec'), '', { duration: 3000 });
        } 
        else if (data.code == 2) {
          this.snackbar.open(this.translate.instant('alert.RegEmpFailNumEmpExc'), '', { duration: 3000 });
        } 
        else {
          this.snackbar.open(this.translate.instant('alert.AddEmpFail'), '', { duration: 3000 });
        }
      } 
      else {
        this.snackbar.open(this.translate.instant('alert.AddEmpFail'), '', { duration: 3000 });
      }
    });
  }
  checkRegisterFormValidityAndAlert() {
    if (!this.oRegisterForm.valid) {
      return false;
    }
    if (this.isSmartStudyAccount.value == '1') {
      // Create Smart Study account
      if (this.oRegisterForm.value.userName == "" && this.oRegisterForm.value.EMAIL == "") {
        this.snackbar.open(this.translate.instant('alert.EnterMailOrUserName'), '', { duration: 3000 });
        return false;
      }
      if (this.oRegisterForm.value.NewPassword == "") {
        this.snackbar.open(this.translate.instant('alert.EnterPW'), '', { duration: 3000 });
        return false;
      } 
      else if (this.oRegisterForm.value.NewPassword.length < 4) {
        this.snackbar.open(this.translate.instant('alert.EnterProperPW'), '', { duration: 3000 });
        return false;
      } 
      else if (this.oRegisterForm.value.NewPassword != this.oRegisterForm.value.ConfirmPassword) {
        this.snackbar.open(this.translate.instant('alert.NewConfMismatch'), '', { duration: 3000 });
        return false;
      }
    }
    if (this.oRegisterForm.value.workgroupId == '-1' && this.oRegisterForm.value.NewWorkGroupName == '') {
      this.snackbar.open(this.translate.instant('alert.EnterNewWGName'), '', { duration: 3000 });
      return false;
    }

    return true;
  }
  loadWorkGroupIds(locId) {
    this.service.getWorkGroupsById(locId).subscribe((data) => {
      if (data.success) {
        this.wgList = data.data;
      }
    });
  }
}
