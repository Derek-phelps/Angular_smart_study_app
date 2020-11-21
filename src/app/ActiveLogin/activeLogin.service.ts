
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class ActiveLoginService {

    private _loginUrl = 'Users/login';

    constructor(private _http: HttpClient,public _globals:Globals) { 
        //console.log(_globals.getUserId());
     }
    login(form:any,ActiveLink): any  {
       
        let formData:FormData = new FormData();
        formData.append('username', form.email);
        formData.append('password', form.password);
        formData.append('ActiveLink', ActiveLink);
        return this._http.post(this._globals.APIURL+this._loginUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error.json() || 'Server error');
    }
}