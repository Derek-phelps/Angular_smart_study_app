
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';
@Injectable()
export class FeedbackService {
    private _getDepartmentUrl = 'Message/feed';

    constructor(private _http: HttpClient,public _globals:Globals) { 
    }
    get(): any  {
        let formData:FormData = new FormData();
        if(this._globals.companyInfo.companyId>0){
            formData.append('companyId', this._globals.companyInfo.companyId+"");
        }
      return this._http.post(this._globals.APIURL+this._getDepartmentUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError));
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error.json() || 'Server error');
    }
} 
