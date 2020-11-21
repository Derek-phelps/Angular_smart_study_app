
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';

@Injectable()
export class ResultService {


    public _getChapterBySubUrl = "Question/getResult";

    constructor(private _http: HttpClient, public globals:Globals) { 

    }
    getResultdata(resultId):any{
        var request = {
            "resultId": resultId
          };
          return this._http.post(this.globals.APIURL+this._getChapterBySubUrl ,request)
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