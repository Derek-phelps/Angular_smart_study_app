
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';


@Injectable()
export class AdminService {

    private _getAllCompanyUrl = 'Company/getCompany';
    private _addCompanyUrl = 'Company/saveCompany';
    private _editCompanyUrl = 'Company/editCompanyByAdmin';
    private _deleteCompanyUrl = 'Company/deleteCompany';
    private _getCompanyByIdUrl = 'Company';
    private _getCourseByIdUrl = 'Course';

    constructor(private _http: HttpClient, public globals: Globals) {

    }
    getAllCompany(): any {

        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this.globals.APIURL + this._getAllCompanyUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    addCompany(form: any, img): any {
        let formData: FormData = new FormData();
        formData.append('username', form.email);
        return this._http.post(this.globals.APIURL + this._addCompanyUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    editCompany(form: any, bannerColor): any {
        let formData: FormData = new FormData();
        formData.append('companyName', form.companyName);
        //formData.append('companyLogo', form.companyLogo);
        formData.append('companyRegNo', form.companyRegNo);

        formData.append('compUrl', form.compUrl);

        // formData.append('baner', form.baner);
        formData.append('bannerColor', bannerColor);
        // formData.append('BackgroundImage', form.BackgroundImage);
        formData.append('companyId', form.companyId);
        formData.append('defaultLang', form.defaultLang);
        formData.append('assFilterBehaviour', form.assFilterBehaviour);

        formData.append('reminderInterval', form.reminderInterval);
        formData.append('reminderDay', form.reminderDay);

        formData.append('showAllCourses', form.showAllCourses);

        this._appendImageUrl(formData, 'companyLogo', 'API/img/Company/', form.companyLogo);
        this._appendImageUrl(formData, 'baner', 'API/img/Company/banner/', form.baner);
        this._appendImageUrl(formData, 'BackgroundImage', 'API/img/Company/background/', form.BackgroundImage);

        return this._http.post(this.globals.APIURL + this._editCompanyUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    deleteCompany(companyId): any {
        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this.globals.APIURL + this._deleteCompanyUrl, formData)
            .pipe(map((response: Response) => response.json()))
            .pipe(catchError(this.handleError))
    }
    getCompanyById(companyId): any {

        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this.globals.APIURL + this._getCompanyByIdUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCourseByCompany(companyId): any {
        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this.globals.APIURL + this._getCourseByIdUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    private _appendImageUrl(formData, strAppendValue, strPath, strValue) {
        if (strValue && strValue.indexOf("API/img") >= 0) {
            formData.append(strAppendValue, strValue);
        } else if (strValue && strValue != '') {
            formData.append(strAppendValue, strPath + strValue);
        } else {
            formData.append(strAppendValue, "");
        }
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        return observableThrowError(error || 'Server error');
    }
} 
