
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class ProfileService {

    private _getByIdUrl = 'Employees/getEmployeesById';
    private _editUrl = 'Employees/editEmployees';
    private _editTrainerUrl = 'Trainers/editTrainer';
    private _getPostUrl = 'Position/positionBycompanyId';
    private _getDepartmentUrl = 'Department/Department';
    private _changePassUrl = 'Users/ChangePassword';

    constructor(private _http: HttpClient, public _globals: Globals) {
    }
    getById(): any {
        let formData: FormData = new FormData();
        formData.append('fullInfo', 'true');
        formData.append('appendNames', 'true');
        return this._http.post(this._globals.APIURL + this._getByIdUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllDepartment(): any {
        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this._globals.APIURL + this._getDepartmentUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getDepartment(): any {
        let formData: FormData = new FormData();
        formData.append('companyId', this._globals.companyInfo.companyId + "");
        return this._http.post(this._globals.APIURL + this._getDepartmentUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllpost(): any {
        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this._globals.APIURL + this._getPostUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getpost(): any {
        let formData: FormData = new FormData();
        formData.append('companyId', this._globals.companyInfo.companyId + "");
        return this._http.post(this._globals.APIURL + this._getPostUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    edit(formField: any): any {
        let formData: FormData = new FormData();
        formData.append("updateProfile", 'update-profile');
        formData.append('companyId', this._globals.companyInfo.companyId + "");
        formData.append('departmentId', formField.departmentId);
        formData.append('FIRSTNAME', formField.FIRSTNAME);
        formData.append('LASTNAME', formField.LASTNAME);
        formData.append('FULLNAME', formField.FULLNAME);
        formData.append('GENDER', formField.GENDER);
        formData.append('postOfDepartment', formField.postOfDepartment);
        formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        formData.append('EMAIL', formField.EMAIL);
        formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);
        formData.append('empEdu', formField.empEdu);
        //formData.append('epath', formField.epath);
        this._appendImageUrl(formData, 'epath', 'API/img/Employee/', formField.epath);
        // if(formField.epath.indexOf("API/img") >=0){
        //     formData.append('epath', formField.epath);
        // }else{
        //     formData.append('epath', "API/img/Employee/"+formField.epath);
        // }

        if (formField.eSignaturepath.indexOf("API/img") >= 0) {
            formData.append('eSignaturepath', formField.eSignaturepath);
        } else {
            formData.append('eSignaturepath', "API/img/Employee/Signature/" + formField.eSignaturepath);
        }


        formData.append('Trainertitle', formField.Trainertitle);
        formData.append('TrainerPostion', formField.TrainerPostion);

        formData.append('EmpId', "");
        var ServerUrl = this._globals.APIURL + this._editUrl;

        // if(this._globals.getUserType()=="3"){
        //     ServerUrl = this._globals.APIURL+this._editTrainerUrl;
        // }
        return this._http.post(ServerUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    changedPass(formField: any): any {
        let formData: FormData = new FormData();
        formData.append('oldPassword', formField.oldPassword);
        formData.append('NewPassword', formField.newPassword);
        formData.append('ConfirmPassword', formField.ConfirmPassword);
        return this._http.post(this._globals.APIURL + this._changePassUrl, formData)
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
        return observableThrowError(error || 'Server error');
    }
} 
