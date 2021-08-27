import { Component, Input } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Globals } from '../../../common/auth-guard.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../../login/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'pages-top',
  templateUrl: './pages-top.component.html',
  styleUrls: ['./pages-top.component.scss'],
})
export class PagesTopComponent {
  avatarImgSrc: string = 'assets/img/logoakt.png';
  userName: string = '';
  //userPost: string = '';
  @Input() pagInfo: boolean = false;
  @Input() chapterId = 0;
  @Input() showMenuIcon: boolean = true;
  @Input() showLangProfile: boolean = true;
  sidebarToggle: boolean = true;
  tip = { ring: false, email: false };

  constructor(private _config: PrimeNGConfig, private spinner: NgxSpinnerService, private _globalService: GlobalService, private _loginService: LoginService,
    private translate: TranslateService, public _globals: Globals, public router: Router, public dialog: MatDialog) {
    this.userName = _globals.userInfo.EmpName;
    //this.userPost = '';

    this.sidebarToggle = this._globals.sidebarToggle;

    this._globalService.data$.subscribe(data => {
      if (data.ev === 'sidebarToggle') {
        this.sidebarToggle = data.value;
      }
    }, error => {
      console.log('Error: ' + error);
    });

    var obj = this;
    window.onresize = function resize() {
      if (window.innerWidth <= 800) {
        obj._globalService.dataBusChanged('sidebarToggle', false);
      } else {
        obj._globalService.dataBusChanged('sidebarToggle', true);
      }
    };

    this.translate.get('primeng').subscribe(res => this._config.setTranslation(res));
  }
  public _sidebarToggle() {
    this._globalService.dataBusChanged('sidebarToggle', !this.sidebarToggle);
  }
  openProfile() {
    if (this._globals.getUserType() == "1") {
      this.router.navigate(['superadmin/profile'], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "2") {
      this.router.navigate(['admin/profile'], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "3") {
      this.router.navigate(['trainer/profile'], { skipLocationChange: false });
    } else {
      this.router.navigate(['employee/profile'], { skipLocationChange: false });
    }
  }
  LogoutApp() {
    this.spinner.show();
    //localStorage.removeItem('currentUser');
    //localStorage.clear();
    var companyInfo = localStorage.getItem('companyInfo');
    localStorage.clear();
    localStorage.setItem('logout', '1');
    localStorage.setItem('companyInfo', companyInfo);
    this._globals.removedUser();
    this._loginService.endSession().subscribe({ error: e => console.error(e) });
    if (this._globals.bConnectAd) {
      this._loginService.netScalerLogout().subscribe(() => {
        this.router.navigate([''], { skipLocationChange: false });
      }, () => window.location.reload());
    } else {
      this.router.navigate([''], { skipLocationChange: false });
    }
  }
  BackBut() {
    this.spinner.show();
    var userType = this._globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/mycourses', this.chapterId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/mycourses', this.chapterId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/mycourses', this.chapterId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./employee/mycourses', this.chapterId], { skipLocationChange: false });
    }
    //this.router.navigate(['employee/chapter/' + this.chapterId], { skipLocationChange: false });
  }
  setLang(lang) {
    if (lang != '') {
      this.spinner.show();
      //this._globals.userInfo.userLang = lang;
      this.translate.use(lang);
      this.translate.get('primeng').subscribe(res => this._config.setTranslation(res));
      // console.log("Lang: " + lang);
      // console.log("New current language: " + this.translate.currentLang);
      this._loginService.updateUserLang(lang).subscribe((data) => {
        if (data.success) {
          // TODO: Reload
          if (!this._globals.bIsLoggedIn) {
            //this.router.navigate([''], { skipLocationChange: false });
            this._globals.removedUser();
            this.router.navigate([''], { skipLocationChange: false });
          } else {
            // var User = JSON.parse(localStorage.getItem('currentUser'));
            //console.warn(User);
            // User.userLang = lang;
            this._globals.userInfo.userLang = lang;
            // localStorage.setItem('currentUser', JSON.stringify(User));
            if (this._globals.currentTranslateService != undefined) {
              //console.log(this._globals.currentTranslateService);
              this._globals.currentTranslateService.use(lang);
            }
          }
        } else {
          // TODO: Error message
        }
        this.spinner.hide();
      });
    }
  }
}
