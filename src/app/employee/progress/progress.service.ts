
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';

@Injectable()
export class progressService {

    private _getProgressUrl = "Question/getProgress";

    public _getByIdUrl = 'Course/getCourseById';
    constructor(private _http: HttpClient, public globals:Globals) { 

    } 
    getProgress(courseId):any{

        var request = {
          "courseId":courseId
        };
        return this._http.post(this.globals.APIURL+this._getProgressUrl ,request)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError));
    }
    getCourseById(Id):any{
        let formData:FormData = new FormData();
        formData.append('Course', Id);
        return this._http.post(this.globals.APIURL+this._getByIdUrl,formData)
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