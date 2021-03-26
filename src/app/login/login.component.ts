import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Globals } from '../common/auth-guard.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PromptBoxComponent } from '../theme/components/prompt-box/prompt-box.component';
import { AlertComponent } from '../theme/components/alert/alert.component';
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { $ } from 'protractor';
import { trigger, state, style, transition, animate } from '@angular/animations';

const VERSION_NUMBER = '3.13.0'; // Define VERSION_NUMBER

const SECONDS_UNITL_AUTO_LOGOUT = 3550; // in s
const CHECK_INTERVAL = 10000; // in ms
//const STORE_KEY = 'lastAction';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(2000))
    ]),
    trigger('visibilityChanged2', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(500))
    ]),
    trigger('visibilityChanged3', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(500))
    ])
  ]
})

export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('email', { static: true }) emailElement: ElementRef;

  bLogout = false;
  bAutoLogout = false;

  bAutoLogin = false;

  bBackgroundIsDark = false;

  public bViewInit = false;

  //private bVersionError = false;

  errorMessage: string;
  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;

  public newPwForm: FormGroup;
  public oldPw: AbstractControl;
  public newPw: AbstractControl;
  public newPwConf: AbstractControl;

  public BGImg: string = "";
  bgImgLoaded = false;
  bgDefImgLoaded = false;
  logoImgLoaded = false;
  logoImgError = false;
  activationLink = undefined;

  bShowPwUpdateBox = false;
  bUpdateLater = false;
  userType = undefined;

  constructor(private route: ActivatedRoute, private spinner: NgxSpinnerService, public dialog: MatDialog, fb: FormBuilder,
    private translate: TranslateService, public router: Router, private _loginService: LoginService, public globals: Globals,
    private snackbar: MatSnackBar) {

    this.spinner.show();

    if (this.globals.timerInterval) {
      clearInterval(this.globals.timerInterval);
      this.globals.timerInterval = undefined;
    }

    this.globals.currentRegId = '';
    //localStorage.clear();
    this.globals.removedUser();
    this.globals.clearSortSettings();
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
    this.newPwForm = fb.group({
      'oldPw': [''],
      'newPw': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'newPwConf': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    }, { validator: this.matchingPasswords('oldPw', 'newPw', 'newPwConf') });

    this.route.params.subscribe(params => {
      this.activationLink = params.id;
    });

    if (localStorage.getItem('defaultLang')) {
      this.translate.use(localStorage.getItem('defaultLang'))
    }

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
    this.BGImg = this.globals.companyInfo.BackgroundImage;

    this.oldPw = this.newPwForm.controls['oldPw'];
    this.newPw = this.newPwForm.controls['newPw'];
    this.newPwConf = this.newPwForm.controls['newPwConf'];
  }

  ngOnInit() {
    var obj = this;
    if (localStorage.getItem('logout')) {
      this.bLogout = true;
      localStorage.removeItem('logout');
    }
    if (localStorage.getItem('auto-logout')) {
      this.bAutoLogout = true;
      localStorage.removeItem('auto-logout');
    }
    this._loginService.getConfig().subscribe(data => {
      //this.translate.use(data.defaultLang);
      var url = data.WebURL + "/API/index.php/";
      //this._loginService.endSession(url).subscribe(val => {
      if (!obj.globals.bInitialDbCommunicationError) {
        this._loginService.getCompanyLang(url, data.companyId, VERSION_NUMBER).subscribe(cmpLang => {
          this.checkVersionSetCompInfo(cmpLang, url);
        }, () => {
          //window.location.reload();
          obj.globals.incrementAndCheckOfflineError();
        });
      }
      //});
    }, () => {
      if (this.globals.companyInfo.companyId != 0) {
        this.globals.incrementAndCheckOfflineError();
      } else {
        this._loginService.getCompanyLang(this.globals.APIURL, 0, VERSION_NUMBER).pipe(take(1)).subscribe(cmpLang => {
          this.checkVersionSetCompInfo(cmpLang, this.globals.APIURL);
        });
      }
    });
  }

  ngAfterViewInit() {
    //this.emailElement.nativeElement.focus();
    // TODO: Probably remove outer ngIf
  }

  logVersionErrorAndReload(apiVersion, appVersion) {
    //this.bVersionError = true;
    console.error("VERSION MISMATCH!");
    console.log("API version: " + apiVersion);
    console.log("App version: " + appVersion);
    window.location.reload();
  }

  matchingPasswords(oldPassKey: string, passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let oldPassword = group.controls[oldPassKey];
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value || oldPassword.value === password.value || oldPassword.value !== this.form.value.password) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
  imgLoaded(event) {
    this.bViewInit = true;

    var canvas = document.createElement("canvas");
    canvas.width = event.target.width;
    canvas.height = event.target.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(event.target, 0, 0);

    var colorSum = 0;

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var r, g, b, avg;

    for (var x = 0, len = data.length; x < len; x += 4) {
      r = data[x];
      g = data[x + 1];
      b = data[x + 2];

      avg = Math.floor((r + g + b) / 3);
      colorSum += avg;
    }

    var brightness = Math.floor(colorSum / (event.target.width * event.target.height));
    // console.log(brightness);

    if (brightness > 50) {
      this.bBackgroundIsDark = true;
    }

    if (!this.globals.bInitialDbCommunicationError) {
      this.spinner.hide();
    }

    setTimeout(() => {
      this.bgImgLoaded = true;
    }, 500);
    //TODO: Maybe not do this here
    // if (this.emailElement) {
    //   //this.emailElement.nativeElement.focus();
    // }
  }
  logoLoaded(error = false) {
    this.logoImgError = error;
    this.logoImgLoaded = true;
  }
  public forgetPassword() {
    if (this.email.value != "") {
      this.spinner.show();
      this._loginService.forgetPassword(this.form.value).subscribe(user => {
        if (user.success) {
          this.showAlertDialog(this.translate.instant('alert.MailPWSent'), this.translate.instant('alert.MailPWSentH'))
        } else {
          this.showAlertDialog(this.translate.instant('alert.CheckMail'))
        }
        this.spinner.hide();
      }, error => this.errorMessage = <any>error);
    } else {
      this.showAlertDialog(this.translate.instant('alert.EnterMail'), this.translate.instant('login.forgot_password'));
    }
  }
  public registration() {

    if (this.globals.companyInfo.companyId > 0) {
      this.translate.get('dialog.NewUserRegEnterPW').subscribe(value => {
        const dialogRef = this.dialog.open(PromptBoxComponent, {
          width: '350px',
          data: { companyId: "", Action: false, UserInput: "", TextType: "password", Mes: value }
        });
        dialogRef.afterClosed().subscribe(result => {
          //console.log(result);
          if (result) {
            this.spinner.show();
            this._loginService.checkDepartmentByCom(this.globals.companyInfo.companyId, result)
              .subscribe(user => {
                if (user.success) {
                  this.globals.currentRegId = user.data.departmentId;
                  this.router.navigate(['./registration', user.data.departmentId], { skipLocationChange: false });
                } else {
                  this.showAlertDialog(this.translate.instant('alert.InvalidPW'));
                }
                this.spinner.hide();
              }, error => this.errorMessage = <any>error);
          }
        });
      });
    } else {
      this.router.navigate(['trainerRegistration'], { skipLocationChange: false });
    }

  }
  public onSubmit(values: Object): void {
    this.submitted = true;
    this.spinner.show();
    if (this.form.valid || (this.bAutoLogin && !this.bAutoLogout && !this.bLogout)) {
      //this.bAutoLogin = false;
      this._loginService.login(this.form.value, this.activationLink, this.bAutoLogin)
        .subscribe(user => {
          localStorage.removeItem("offline_counter");
          if (user.success) {
            this.globals.hasDepartments = user.menuInfo.hasDepartments;
            this.globals.hasGroups = user.menuInfo.hasGroups;
            this.globals.hasCourses = user.menuInfo.hasCourses;
            this.globals.canCreateCourses = user.menuInfo.canCreateCourses;
            if (this.globals.companyInfo.companyId == user.data.companyId) {
              //localStorage.setItem('currentUser', JSON.stringify(user.data));

              if (Number(user.data.UserType) < 3 && user.licenseWarning) {
                this.snackbar.open(this.translate.instant((user.licenseExp > 1 ? 'registrations.LicenseExpiredP' : 'registrations.LicenseExpiredS'), { days: user.licenseExp }), this.translate.instant('close'), { duration: undefined, panelClass: 'warning-snackbar' });
              }

              this.globals.setDepartment(user.data);
              this.globals.setUserInfo(user.data);
              if (user.data.userLang != '') {
                this.translate.use(user.data.userLang);
              }
              if (window.innerWidth <= 800) {
                this.globals.sidebarToggle = false;
              }

              if (Number(user.data.pwChangeNeeded) != NaN && Number(user.data.pwChangeNeeded) == 0) {
                this._NavigateToDashboard(user.data.UserType);
              } else if (Number(user.data.pwChangeNeeded) != NaN) {
                this.userType = user.data.UserType;
                this.bUpdateLater = Number(user.data.pwChangeNeeded) < 3 ? true : false;
                this.bShowPwUpdateBox = true;
                this.spinner.hide();
              }
              this.globals.bIsLoggedIn = true;
            } else {
              this.showAlertDialog(this.translate.instant('alert.UnAuth'));
              this.form.controls['password'].setValue("");
              this.spinner.hide();
            }
          } else {
            if (user.activationNeeded) {
              this.showAlertDialog(this.translate.instant('alert.NotActivated'));
            } else if (user.autoLoginFailed) {
              // automatic login failed...
              this.spinner.hide();
            } else if (user.licenseExpired) {
              this.showAlertDialog(this.translate.instant('registrations.LicenseExpired'), this.translate.instant('registrations.LicExp'));
            } else {
              this.showAlertDialog(this.translate.instant('alert.UnAuth'));
              this.form.controls['password'].setValue("");
            }
            if (!this.bAutoLogin) {
              this.spinner.hide();
            }
          }
          this.bAutoLogin = false;
        }, error => this.errorMessage = <any>error);
    }
  }
  private _NavigateToDashboard(userType) {
    this.check();
    this.initListener();
    this.initInterval();
    this.globals.lastAction = Date.now();
    localStorage.removeItem('logged_in');
    this.setLogoutListener();

    if (userType == 1) {
      this.router.navigate(['./superadmin/registrations'], { skipLocationChange: false });
    } else if (userType == 2) {
      this.router.navigate(['./admin/dashboard'], { skipLocationChange: false });
      // } else if (userType == 3) {
      //   this.router.navigate(['./trainer/dashboard'], { skipLocationChange: false });
    } else {
      this.router.navigate(['./employee/mycourses'], { skipLocationChange: false });
    }
  }
  updatePw(bUpdate: boolean) {
    if (bUpdate) {
      this._loginService.updatePw(this.newPwForm.value, this.form.value.password).subscribe(data => {
        if (data.success) {
          this.snackbar.open(this.translate.instant('alert.UpdatePWSuccess'), '', { duration: 3000 });
          this._NavigateToDashboard(this.userType);
        } else {
          this.translate.get('alert.EnterProperPW').subscribe(value => { alert(value); });
        }
      });
    } else {
      this._loginService.updatePwLater().subscribe(data => {
        if (data.success) {
          this._NavigateToDashboard(this.userType);
        } else {
          console.warn("Cannot postpone update of password...");
        }
      });
    }
  }
  getCurrentError() {
    if (this.form.value.password != this.newPwForm.value.oldPw) {
      return this.translate.instant('alert.EnterCurrentPW');
    } else if (this.newPwForm.value.newPw.length < 4) {
      return this.translate.instant('alert.EnterValidPw');
    } else if (this.newPwForm.value.newPw != this.newPwForm.value.newPwConf) {
      return this.translate.instant('alert.NewConfMismatch');
    } else if (this.form.value.password == this.newPwForm.value.newPw) {
      return this.translate.instant('alert.NewPwMustBeDiff');
    } else {
      return "ERROR";
    }
  }

  // AUTO LOGOUT STUFF
  public getLastAction() {
    // return parseInt(localStorage.getItem(STORE_KEY));
    return this.globals.lastAction;
  }
  public setLastAction(lastAction: number) {
    //localStorage.setItem(STORE_KEY, lastAction.toString());
    this.globals.lastAction = lastAction;
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    this.globals.timerInterval = setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + SECONDS_UNITL_AUTO_LOGOUT * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout) {
      // localStorage.clear();
      // this.router.navigate(['./login']);
      var companyInfo = localStorage.getItem('companyInfo');
      localStorage.clear();
      localStorage.setItem('companyInfo', companyInfo);
      localStorage.setItem('auto-logout', '1');
      localStorage.removeItem('logged_in');
      this.globals.removedUser();
      this.router.navigate([''], { skipLocationChange: false });
    }
  }

  setLogoutListener() {
    setTimeout(() => {
      localStorage.setItem('logged_in', 'true');
      window.addEventListener('storage', (event) => {
        if (event.storageArea == localStorage) {
          let token = localStorage.getItem('logged_in');
          if (token == undefined) {
            localStorage.setItem('logout', '1');
            this.router.navigate([''], { skipLocationChange: false });
          }
        }
      });
    }, 300);
  }

  checkVersionSetCompInfo(cmpLang, url) {
    //console.log(localStorage.getItem());
    if (!cmpLang || !cmpLang.VERSION_NUMBER || cmpLang.VERSION_NUMBER != VERSION_NUMBER) {
      if (!cmpLang || !cmpLang.VERSION_NUMBER) {
        this.logVersionErrorAndReload('Undefined', VERSION_NUMBER);
      }
      var ApiVersion = cmpLang.VERSION_NUMBER ? cmpLang.VERSION_NUMBER.split(".") : [];
      var AppVersion = VERSION_NUMBER.split(".");

      if (ApiVersion.length == 3 && AppVersion.length == 3) {
        if (JSON.stringify(ApiVersion) != JSON.stringify(AppVersion)) {
          if (ApiVersion[0] == AppVersion[0] && ApiVersion[1] == AppVersion[1]) {
            const snack = this.snackbar.open(this.translate.instant('login.UpdateAvailable'),
              this.translate.instant('login.Update'), { duration: 10000 });

            snack
              .onAction()
              .subscribe(() => {
                window.location.reload();
              });
          } else {
            this.logVersionErrorAndReload(cmpLang.VERSION_NUMBER, VERSION_NUMBER);
          }
        }
      } else {
        this.logVersionErrorAndReload(cmpLang.VERSION_NUMBER, VERSION_NUMBER);
      }
    }
    if (cmpLang.success) {
      this.globals.companyInfo.defaultLang = cmpLang.defaultLang;
      this.translate.use(cmpLang.defaultLang);
      localStorage.setItem('defaultLang', cmpLang.defaultLang);

      this.globals.bConnectAd = (cmpLang.connectAD == '1');

      if (this.globals.bConnectAd && !this.bAutoLogout && !this.bLogout) {
        this.bAutoLogin = true;

        this._loginService.netScalerLogin(url).subscribe(response => {
          if (response.success == true) {
            // this._loginService.getUserLoggedIn(url).subscribe(user => {
            //   console.log(user);
            // });
            this.onSubmit({});
          }
        });
      }
    }
  }

  showAlertDialog(message: string, head: string = undefined) {
    setTimeout(() => {
      this.dialog.open(AlertComponent, {
        width: '400px',
        data: { Head: head, Mes: message },
        autoFocus: false
      });
    });
  }
}
