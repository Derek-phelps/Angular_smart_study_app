
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';

@Injectable()
export class EmpFeedBackService {
    
    private _getMesUrl = "Message/FeedMessage";

    constructor(private _http: HttpClient,public _globals:Globals) { 

    }
    send(form): any  { 
       let formData:FormData = new FormData();
        formData.append('companyId', this._globals.companyInfo.companyId+"");
        formData.append('subject', form.subject);
        formData.append('message', form.mess);
        return this._http.post(this._globals.APIURL+this._getMesUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError));
    }
    
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error || 'Server error');
    }
} 
