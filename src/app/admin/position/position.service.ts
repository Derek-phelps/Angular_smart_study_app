
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';
@Injectable()
export class PositionService {

    private _saveUrl = this._globals.APIURL+'Position/savePosition';
    private _updateUrl = this._globals.APIURL+'Position/updatePositionById';
    private _deleteUrl = this._globals.APIURL+'Position/deletePosition';
    private _getPositionUrl = this._globals.APIURL+'Position/Position';
    private _getByIdUrl = this._globals.APIURL+'Position/getpositionById';

    constructor(private _http: HttpClient,public _globals:Globals) { 
        
    }
    add(form): any  {
            let formData:FormData = new FormData();
            formData.append('positionName', form.PositionName);
        return this._http.post(this._saveUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    get(): any  {
      return this._http.get(this._getPositionUrl)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
    }
    getById(id): any {
        let formData:FormData = new FormData();
        formData.append('PositionId', id);
        formData.append('companyId', this._globals.companyInfo.companyId+"");
      return this._http.post(this._getByIdUrl,formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
    }
    edit(form): any  {
        let formData:FormData = new FormData();
        formData.append('positionName', form.PositionName);
        formData.append('positionId', form.PositionId);
        return this._http.post(this._updateUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    delete(Id): any  {
        let formData:FormData = new FormData();
        formData.append('positionId', Id);
        return this._http.post(this._deleteUrl,formData)
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
