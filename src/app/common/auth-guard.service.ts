import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class Globals {
    public bIsRegister: boolean = false;
    public userInfo = {
        departmentId: 0,
        EmailID: '',
        NumOfEmp: 0,
        // UserId: 0,
        UserName: '',
        UserType: '',
        // empId: 0,
        EmpName: '',
        userLang: 'en',
        isAdmin: false
    };
    public errorScormSave = false;
    public timerInterval = undefined;
    public lastAction = undefined;
    public bIsLoggedIn = false;
    public openCourseState = false;
    public currentRegId = '';
    public WebURL = "";
    public APIURL = "";
    //public IMAGEURL = "";
    public JsonURL = "";
    public adminURL = "";
    private lastRouteUrl = "";
    public companyInfo = {
        BackgroundImage: '',
        baner: '',
        companyId: 0,
        companyLogo: '',
        companyName: '',
        companyRegNo: '',
        isAuth: 1,
        specialist: '',
        webUrl: '',
        DLogo: null,
        DBackGround: null,
        DBanner: null,
        bannerColor: '#ffffff',
        defaultLang: 'en',
        isSet: false
    };
    public sidebarToggle = true;
    public sortCourse1 = "EndTime";
    public sortCourse2 = "EndTime";
    public sortCourse3 = "EndTime";
    public empFilter = "active";
    public spinnerText = "";
    public isEmpReading = false;
    public currentTranslateService: any = undefined;
    public currentCertificateDownloadWindow: any = undefined;
    public certificaterCourseId: Number = undefined;
    public certificaterEmpId: Number = undefined;
    public hasDepartments = false;
    public hasGroups = false;
    public hasCourses = false;
    public canCreateCourses = false;
    public bConnectAd = false;
    public bIsAppOffline = false;
    public bInitialDbCommunicationError = false;
    incrementAndCheckOfflineError() {
        var nOfflineCounter = 0;
        if (localStorage.getItem("offline_counter")) {
            nOfflineCounter = JSON.parse(localStorage.getItem("offline_counter"));
        }

        this.bInitialDbCommunicationError = true;

        if (nOfflineCounter >= 5) {
            this.bIsAppOffline = true;
            localStorage.removeItem("offline_counter");
        } else {
            nOfflineCounter += 1;
            localStorage.setItem("offline_counter", JSON.stringify(nOfflineCounter));
            window.location.reload();
        }
    }
    clearSortSettings() {
        this.sortCourse1 = "EndTime";
        this.sortCourse2 = "EndTime";
        this.sortCourse3 = "EndTime";
    }
    setServerInfo(server = undefined) {
        if (server != undefined) {
            this.WebURL = server.WebURL;
            this.APIURL = this.WebURL + "/API/index.php/";
            //this.IMAGEURL = this.WebURL + "/API/img/";
            this.JsonURL = this.WebURL + "/API/";
            this.adminURL = server.adminURL;
        } else {
            this.WebURL = ".";
            this.APIURL = this.WebURL + "/API/index.php/";
            this.JsonURL = this.WebURL + "/API/";
            this.adminURL = "";
        }
    }
    getAPIWeb() {
        return this.APIURL;
    }
    // getImageWeb() {
    //     return this.IMAGEURL;
    // }
    setUserInfo(userData) {
        this.userInfo.EmailID = userData.EmailID;
        this.userInfo.NumOfEmp = userData.NumOfEmp;
        // this.userInfo.UserId = userData.UserId;
        this.userInfo.UserName = userData.UserName;
        if (userData.UserType == '3') {
            this.userInfo.UserType = '4';
        } else {
            this.userInfo.UserType = userData.UserType;
        }
        this.userInfo.isAdmin = (Number(this.userInfo.UserType) < 3);
        // this.userInfo.empId = userData.empId;
        this.userInfo.departmentId = userData.departmentId;
        this.userInfo.EmpName = userData.EmpName;
        this.userInfo.userLang = userData.userLang;
    }
    setCompany(compData) {
        this.companyInfo.BackgroundImage = compData.BackgroundImage;
        this.companyInfo.baner = compData.baner;
        this.companyInfo.companyId = compData.companyId;
        this.companyInfo.companyLogo = compData.companyLogo;
        this.companyInfo.companyName = compData.companyName;
        this.companyInfo.companyRegNo = compData.companyRegNo;
        this.companyInfo.bannerColor = compData.bannerColor;
        this.companyInfo.webUrl = compData.webUrl;
        this.companyInfo.isSet = true;
    }
    setDepartment(departmentData) {
        this.companyInfo.DLogo = departmentData.DLogo == '' ? null : departmentData.DLogo;
        this.companyInfo.DBackGround = departmentData.DBackGround == '' ? null : departmentData.DBackGround;
        this.companyInfo.DBanner = departmentData.DBanner == '' ? null : departmentData.DBanner;
    }
    // getUserId() {
    //     return this.userInfo.UserId;
    // }
    // getEmpId() {
    //     return this.userInfo.empId;
    // }
    getUserType() {
        return this.userInfo.UserType
    }
    removedUser() {
        this.bIsLoggedIn = false;
        this.userInfo = {
            departmentId: 0,
            EmailID: '',
            NumOfEmp: 0,
            // UserId: 0,
            UserName: '',
            UserType: '',
            // empId: 0,
            EmpName: '',
            userLang: 'en',
            isAdmin: false
        };
    }
    removedCompany() {
        this.companyInfo = {
            BackgroundImage: '',
            baner: '',
            companyId: 0,
            companyLogo: '',
            companyName: '',
            companyRegNo: '',
            isAuth: 1,
            specialist: '',
            webUrl: '',
            DLogo: null,
            DBackGround: null,
            DBanner: null,
            bannerColor: '#ffffff',
            defaultLang: 'en',
            isSet: false
        };
    }
    setLastRoutURL(lastRouteUrl) {
        this.lastRouteUrl = lastRouteUrl;
    }
    getLastRouteUrl() {
        var lastRouteUrl = this.lastRouteUrl;
        this.lastRouteUrl = "";
        return lastRouteUrl;
    }
}

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public router: Router, public _globals: Globals) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (route.url.length > 0) {
            var bValid = true;

            // http://localhost:4200/#/employee/content/add/13
            if (route.url[0].path == 'trainer') {
                bValid = false;
            } else {
                if (route.url[0].path != 'register') {
                    if (this._globals.userInfo.UserType == '' || !this._globals.bIsLoggedIn) { // user type not set or not logged in
                        bValid = false;
                    } else if (route.url[0].path == 'admin' && Number(this._globals.userInfo.UserType) > 2) { // admin route, but not admin
                        bValid = false;
                    } else if (route.url[0].path == 'employee' && Number(this._globals.userInfo.UserType) < 3) { // employee route, but not employee
                        bValid = false;
                    } else if ((route.url[0].path == 'course' || route.url[0].path == 'content' || route.url[0].path == 'test' || route.url[0].path == 'certificater') &&
                        !(Number(this._globals.userInfo.UserType) > 2) &&
                        !this._globals.hasCourses && !this._globals.canCreateCourses) { // course, content, test or certificater route, but neither admin nor has courses nor can create courses
                        bValid = false;
                    }
                }
            }

            if (!bValid) {
                this._globals.removedUser();
                this.router.navigate([''], { skipLocationChange: false });
                return false;
            }

            // if (this._globals.userInfo.UserType == '' || !this._globals.bIsLoggedIn || // user type not set or not logged in
            //     (route.url[0].path == 'admin' && Number(this._globals.userInfo.UserType) > 2) || // admin route, but not admin
            //     // (route.url[0].path == 'trainer' && Number(this._globals.userInfo.UserType) != 3) || // trainer route, but not trainer
            //     (route.url[0].path == 'employee' && Number(this._globals.userInfo.UserType) < 3)) { // employee route, but not employee
            //     //console.log(route.url);
            //     this._globals.removedUser();
            //     this.router.navigate([''], { skipLocationChange: false });
            //     return false;
            // }
        }
        return true;
    }
}

