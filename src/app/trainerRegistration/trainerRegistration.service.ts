
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class TrainerRegistrationService {

    private _addUrl = 'Trainers/addTrainer';

    constructor(private _http: HttpClient,public _globals:Globals) { 
           
    }
    add(formField:any): any  {

        // console.log(formField);
        let formData:FormData = new FormData();
        formData.append('companyId', formField.comapnyId);
        formData.append('userName', formField.userName);
        formData.append('departmentId', formField.departmentId);
        formData.append('FIRSTNAME', formField.FIRSTNAME);
        formData.append('LASTNAME', formField.LASTNAME);
        formData.append('GENDER', formField.GENDER);
        formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        formData.append('EMAIL', formField.EMAIL);
        formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);
        formData.append('empEdu', formField.empEdu);
        formData.append('epath', formField.epath);
        formData.append('isRegistration', "true");
        formData.append('NewPassword', formField.NewPassword);
        formData.append('Signature', formField.Signature);

        formData.append('Trainertitle', formField.Trainertitle);
        formData.append('TrainerPostion', formField.TrainerPostion);
        formData.append('createdByComId',this._globals.companyInfo.companyId+"");
        return this._http.post(this._globals.APIURL+this._addUrl,formData)
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