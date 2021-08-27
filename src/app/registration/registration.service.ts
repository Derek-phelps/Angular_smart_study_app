
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class RegistrationService {
    private _getDepartmentUrl = 'Users/getDepartmentById';
    private _addUrl = 'Users/addEmployees';
    constructor(private _http: HttpClient, public _globals: Globals) {

    }
    add(formField: any): any {

        // console.log(formField);
        let formData: FormData = new FormData();
        formData.append('comapnyId', formField.comapnyId);
        formData.append('userName', formField.userName);
        formData.append('departmentId', formField.departmentId);
        formData.append('FIRSTNAME', formField.FIRSTNAME);
        formData.append('LASTNAME', formField.LASTNAME);
        formData.append('FULLNAME', formField.FULLNAME);
        formData.append('GENDER', formField.GENDER);
        formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        formData.append('EMAIL', formField.EMAIL);
        formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);
        formData.append('empEdu', formField.empEdu);
        //formData.append('epath', formField.epath);
        this._appendImageUrl(formData, 'epath', 'API/img/Employee/', formField.epath);
        formData.append('isRegistration', "true");
        formData.append('NewPassword', formField.NewPassword);
        formData.append('myCompany', this._globals.companyInfo.companyId + "");
        return this._http.post(this._globals.APIURL + this._addUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getDepartment(): any {
        return this._http.get(this._globals.APIURL + this._getDepartmentUrl)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    private _appendImageUrl(formData, strAppendValue, strPath, strValue) {
        if (strValue && strValue.indexOf("API/img") >= 0) {
            formData.append(strAppendValue, strValue);
        } else if (strValue && strValue != '') {
            formData.append(strAppendValue, strPath + strValue);
        } else {
            formData.append(strAppendValue, "");
        }
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error.json() || 'Server error');
    }
}