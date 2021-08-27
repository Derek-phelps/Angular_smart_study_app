
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class LoginService {

    private _loginUrl = 'Users/login';
    private _forgetPasswordUrl = 'Users/forgetPassword';
    private _getCompanyUrl = 'Company';
    private _getDepartmentData = 'Company/getDepartmentByCom';
    private _updateUserLangUrl = 'Users/updateUserLang';
    private _getCompanyLang = 'Users/getCompanyLang';
    private _loginNetScaler = 'Users/NetScalerLogin';
    private _logoutNetScaler = 'Users/NetScalerLogout';
    private _getUserLoggedIn = 'Users/getUserLoggedIn';
    private _changePassUrl = 'Users/ChangePassword';
    private _updatePwLaterUrl = 'Users/UpdatePwLater';

    constructor(private _http: HttpClient, public _globals: Globals) {
        // console.log(_globals.getUserId());
    }
    login(form: any, activationLink: any, autoLogin: boolean = false): any {

        // console.log(form);
        // return observableThrowError('Server error');

        let formData: FormData = new FormData();
        formData.append('username', form.email);
        formData.append('password', form.password);
        if (activationLink) {
            formData.append('ActiveLink', activationLink);
        }

        if (autoLogin) {
            formData.append('autoLogin', '1');
        }

        return this._http.post(this._globals.APIURL + this._loginUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    endSession(): any {
        var url = this._globals.APIURL + "Users/endSession";
        return this._http.get(url).pipe(map((response: Response) => response)).pipe(catchError(this.handleError));
    }
    forgetPassword(form: any): any {
        let formData: FormData = new FormData();
        formData.append('username', form.email);
        return this._http.post(this._globals.APIURL + this._forgetPasswordUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCompany(WebURL, companyId): any {
        let formData: FormData = new FormData();
        formData.append('companyId', companyId);

        return this._http.post(WebURL + "/API/index.php/" + this._getCompanyUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getConfig(): any {
        return this._http.get("./assets/i18n/web.json")
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    checkDepartmentByCom(companyId, pass): any {
        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        formData.append('DepPass', pass);
        return this._http.post(this._globals.APIURL + this._getDepartmentData, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCompanyLang(url, compId, versionNumber = null): any {
        let formData: FormData = new FormData();
        formData.append('compId', compId);
        if (versionNumber) {
            formData.append('VERSION_NUMBER', versionNumber)
        }
        return this._http.post(url + this._getCompanyLang, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    updateUserLang(newLang): any {
        let formData: FormData = new FormData();
        formData.append('newLang', newLang);
        return this._http.post(this._globals.APIURL + this._updateUserLangUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    updatePw(formField: any, oldPw: any): any {
        let formData: FormData = new FormData();
        formData.append('oldPassword', oldPw);
        formData.append('NewPassword', formField.newPw);
        formData.append('ConfirmPassword', formField.newPwConf);
        return this._http.post(this._globals.APIURL + this._changePassUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    updatePwLater(): any {
        return this._http.get(this._globals.APIURL + this._updatePwLaterUrl)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    netScalerLogin(url): any {
        return this._http.get(url + this._loginNetScaler)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    netScalerLogout(): any {
        return this._http.get(this._globals.APIURL + this._logoutNetScaler)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getUserLoggedIn(url): any {
        return this._http.get(url + this._getUserLoggedIn)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    registerNewAccount(user): any {
        let formData: FormData = new FormData();
        formData.append('newUser', JSON.stringify(user));
        return this._http.post(this._globals.APIURL + 'AccountRegistration', formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    // getSessionVars(url):any{
    //     let formData:FormData = new FormData();
    //     formData.append('wuascht', '');
    //     var APIUrl = url;
    //     if (url == '') {
    //         APIUrl = this._globals.APIURL;
    //     }
    //     return this._http.post(APIUrl+'Users/userdata',formData)
    //     .pipe(map((response: Response) => response))
    //     .pipe(catchError(this.handleError))
    // }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error || 'Server error');
    }
}