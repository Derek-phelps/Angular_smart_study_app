
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class SuperadminService {
    private _getAllCompanyUrl = 'Company/getCompany';
    private _addCompanyUrl = 'Company/saveCompany';
    private _editCompanyUrl = 'Company/editCompany';
    private _deleteCompanyUrl = 'Company/deleteCompany';
    private _getCompanyByIdUrl = 'Company';
    constructor(private _http: HttpClient,public _globals:Globals) { 
           
    }
    getAllCompany(): any  {

        let formData:FormData = new FormData();

        return this._http.post(this._globals.APIURL+this._getAllCompanyUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    addCompany(form:any,img): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._addCompanyUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    editCompany(form:any): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._editCompanyUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    deleteCompany(companyId): any  {
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
    return this._http.post(this._globals.APIURL+this._deleteCompanyUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    getCompanyById(companyId){
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
    return this._http.post(this._globals.APIURL+this._getCompanyByIdUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error || 'Server error');
    }
} 
