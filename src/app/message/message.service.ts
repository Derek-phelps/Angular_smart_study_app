
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class MessageService {
    
    private _getMesUrl = 'Message/messages';
    private _sendMesUrl = 'Message/SendMessage';
    private _getAllUserUrl = 'Employees';
    private _getAllUserByCompanyUrl = 'Employees';
    private _isReadUrl = 'Employees/isReadMark';
    private _deleteUrl = 'Message/deleteMessage';

    constructor(private _http: HttpClient,public _globals:Globals) { 
       
    }
    getAllUser(): any  {
        let formData:FormData = new FormData();
        return this._http.post(this._globals.APIURL+this._getAllUserUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError));
    }
    getAllUserByCompany(): any  {
        let formData:FormData = new FormData();
        formData.append('companyId', this._globals.companyInfo.companyId+"");
        return this._http.post(this._globals.APIURL+this._getAllUserByCompanyUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError));
    }
    get(fil): any  {
        let formData:FormData = new FormData();
        formData.append('filter', fil+"");
        return this._http.post(this._globals.APIURL+this._getMesUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError));
    }
    Send(form:any): any  {
        let formData:FormData = new FormData();
        formData.append('subject', form.subject);
        formData.append('resiverId', form.email);  
        formData.append('message', form.mess);
       return this._http.post(this._globals.APIURL+this._sendMesUrl,formData)
       .pipe(map((response: Response) => response))
       .pipe(catchError(this.handleError));
    }
    isRead(messageId): any  {
        let formData:FormData = new FormData();
        formData.append('messageId', messageId);
       return this._http.post(this._globals.APIURL+this._isReadUrl,formData)
       .pipe(map((response: Response) => response))
       .pipe(catchError(this.handleError));
    }
    delete(messageId): any {
       let formData:FormData = new FormData();
        formData.append('messageId', messageId);
       return this._http.post(this._globals.APIURL+this._deleteUrl,formData)
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
