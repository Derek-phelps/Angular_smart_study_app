
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';
@Injectable()
export class TrainersService {
    private _getAllTrainersUrl = 'Trainers';
    private _addTrainersUrl = 'Trainers/addAdminTrainer';
    private _editTrainersUrl = 'Trainers/editTrainer';
    private _deleteTrainersUrl = 'Trainers/deleteTrainers';
    private _getTrainersByIdUrl = 'Trainers/trainersById';
    private _getAllCompanyUrl = 'Company/getCompany';
    private _getCompanyByIdUrl = 'Company';
    private _getDepartmentUrl = "Department";

    constructor(private _http: HttpClient,public _globals:Globals) { 
           
    }
    getAllCompany(): any {
        let formData:FormData = new FormData();
        return this._http.post(this._globals.APIURL+this._getAllCompanyUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getCompanyById(userId): any {
        let formData:FormData = new FormData();
        formData.append('companyId', userId);
        return this._http.post(this._globals.APIURL+this._getCompanyByIdUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getAllTrainers(): any  {
        let formData:FormData = new FormData();
        return this._http.post(this._globals.APIURL+this._getAllTrainersUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    add(formField:any,webUrl): any  {

        // console.log(formField);
        let formData:FormData = new FormData();
        formData.append('FIRSTNAME', formField.FIRSTNAME);
        formData.append('LASTNAME', formField.LASTNAME);
        formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        formData.append('companyId', formField.comapnyId);
        formData.append('departmentId', formField.departmentId);
        formData.append('GENDER', formField.GENDER);
        
        formData.append('empEdu', formField.empEdu);
        formData.append('EMAIL', formField.EMAIL);
        formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);

        formData.append('webUrl', webUrl); 

        formData.append('epath', "API/img/Employee/"+formField.epath);
        formData.append('Signature', "API/img/Employee/Signature/"+formField.Signature);
       
        formData.append('Trainertitle', formField.Trainertitle);
        formData.append('TrainerPostion', formField.TrainerPostion);
        formData.append('createdByComId',this._globals.companyInfo.companyId+"");
        return this._http.post(this._globals.APIURL+this._addTrainersUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    edit(formField:any): any  {
 
        let formData:FormData = new FormData();
        formData.append('FIRSTNAME', formField.FIRSTNAME);
        formData.append('LASTNAME', formField.LASTNAME);
        formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        formData.append('comapnyId', formField.comapnyId);
        formData.append('departmentId', formField.departmentId);
        formData.append('GENDER', formField.GENDER);

        formData.append('empEdu', formField.empEdu);
        formData.append('EMAIL', formField.EMAIL);
        formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);

        if(formField.epath.indexOf("API/img") >=0){
            formData.append('epath', formField.epath);
        }else{
            formData.append('epath', "API/img/Employee/"+formField.epath);
        }
        if(formField.Signature.indexOf("API/img") >=0){
            formData.append('eSignaturepath', formField.Signature);
        }else{
            formData.append('eSignaturepath', "API/img/Employee/Signature/"+formField.Signature);
        }
        
        formData.append('trainerId', formField.trainerId);
        formData.append('Trainertitle', formField.Trainertitle);
        formData.append('TrainerPostion', formField.TrainerPostion);
      return this._http.post(this._globals.APIURL+this._editTrainersUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    deleteTrainers(companyId): any  {
        let formData:FormData = new FormData();
        formData.append('trainerId', companyId);
    return this._http.post(this._globals.APIURL+this._deleteTrainersUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    } 
    getTrainersById(companyId):any{
        let formData:FormData = new FormData();
        formData.append('trainerId', companyId);
    return this._http.post(this._globals.APIURL+this._getTrainersByIdUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getDepartment(companyId):any{
        let formData:FormData = new FormData();
        formData.append('trainerId', companyId);
    return this._http.post(this._globals.APIURL+this._getDepartmentUrl,formData)
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
