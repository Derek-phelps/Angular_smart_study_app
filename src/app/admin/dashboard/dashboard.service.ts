
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';


@Injectable()
export class DashboardService {
    private _getDashboardUrl = 'Users/getDashboard';
    private _getEmpDashboardUrl = 'Users/getEmployeeDashboard';
    private _getTopCourseByCompanyUrl = 'Course/getTopCourse';

    constructor(private _http: HttpClient,private _globals:Globals) { 
       
    }
    getLoadTopCourse():any{
        let formData:FormData = new FormData();
        formData.append('companyId', this._globals.companyInfo.companyId+"");
     return this._http.post(this._globals.APIURL+this._getTopCourseByCompanyUrl,formData)
     .pipe(map((response: Response) => response))
     .pipe(catchError(this.handleError))
    }
    getDashbord():any{
     return this._http.get(this._globals.APIURL+this._getDashboardUrl)
     .pipe(map((response: Response) => response))
     .pipe(catchError(this.handleError))
    }
    getEmpDashbord():any{
     return this._http.get(this._globals.APIURL+this._getEmpDashboardUrl)
     .pipe(map((response: Response) => response))
     .pipe(catchError(this.handleError))
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error || 'Server error');
    }
}