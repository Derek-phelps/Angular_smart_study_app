
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';
@Injectable()
export class TrainerService {

    private _getTrainersUrl = 'Trainers/getDashbord';

    constructor(private _http: HttpClient,public _globals:Globals) { 
           
    }
    getTrainerDashnoard(): any {
        return this._http.get(this._globals.APIURL+this._getTrainersUrl)
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
