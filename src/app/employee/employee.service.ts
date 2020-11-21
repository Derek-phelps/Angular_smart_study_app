
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class EmployeeService {
    private _getAllEmployeeUrl = 'Employees';
    private _addEmployeesUrl = 'Employees/addEmployees';
    private _editEmployeesUrl ='Employees/editEmployees'; 
    private _deleteEmployeesUrl = 'Employees/deleteEmployees';
    private _getEmployeesByIdUrl = 'Employees/getEmployeesById';
    private _getEmployeesByCompIdUrl ='Employees/GetAllEmployeesbycompany';
    private _getALlPositionUrl = 'Position';
    private _getAllEmployeesByIdUrl = 'Department/Department';
    private _getEmpDashboardUrl = 'Users/getEmployeeDashboard';
    private _getAllCompanyUrl = 'Company';
    private _getNewsFeedUrl = 'Newswall';
    constructor(private _http: HttpClient, public globals:Globals) { 
           
    }
    getNewsFeedCompanyId():any{

        let formData:FormData = new FormData();
        formData.append('companyId', this.globals.companyInfo.companyId+"");
     return this._http.post(this.globals.APIURL+this._getNewsFeedUrl,formData)
     .pipe(map((response: Response) => response))
     .pipe(catchError(this.handleError))
    }
    getNewsFeedCourseId(courseId):any{

        let formData:FormData = new FormData();
        formData.append('courseId', courseId);
     return this._http.post(this.globals.APIURL+this._getNewsFeedUrl,formData)
     .pipe(map((response: Response) => response))
     .pipe(catchError(this.handleError))
    }
    getEmpDashbord():any{
     return this._http.get(this.globals.APIURL+this._getEmpDashboardUrl)
     .pipe(map((response: Response) => response))
     .pipe(catchError(this.handleError))
    }
    getAllEmployess(): any  {

        let formData:FormData = new FormData();
        return this._http.post(this.globals.APIURL+this._getAllEmployeeUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    addEmployess(form:any,companyId): any  {
        let formData:FormData = new FormData();
        formData.append('FIRSTNAME', form.FIRSTNAME);
        formData.append('LASTNAME', form.LASTNAME);
        formData.append('GENDER', form.GENDER);
        formData.append('departmentId', form.departmentId);
        formData.append('postOfDepartment', form.postOfDepartment);
        formData.append('MARITALSTATUS', form.MARITALSTATUS);
        formData.append('MOBILEPHONE', form.MOBILEPHONE);
        formData.append('EMAIL', form.EMAIL);
        formData.append('MotherName', form.MotherName);
        formData.append('epath', form.epath);
        formData.append('CURRENTADDRESS', form.CURRENTADDRESS);
        formData.append('empEdu', form.empEdu);
        formData.append('comapnyId', companyId)
        formData.append('myCompany', this.globals.companyInfo.companyId+"");
    return this._http.post(this.globals.APIURL+this._addEmployeesUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    editEmployess(form:any): any  {
        let formData:FormData = new FormData();
        formData.append('FIRSTNAME', form.FIRSTNAME);
        formData.append('LASTNAME', form.LASTNAME);
        formData.append('GENDER', form.GENDER);
        formData.append('departmentId', form.departmentId);
        formData.append('postOfDepartment', form.postOfDepartment);
        formData.append('MOBILEPHONE', form.MOBILEPHONE);
        formData.append('EMAIL', form.EMAIL);
        formData.append('epath', form.epath);
        formData.append('CURRENTADDRESS', form.CURRENTADDRESS);
        formData.append('empEdu', form.empEdu);
        formData.append('EmpId', form.empId)
    return this._http.post(this.globals.APIURL+this._editEmployeesUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    deleteEmployess(empId): any  {
        let formData:FormData = new FormData();
        formData.append('employeeId', empId);
    return this._http.post(this.globals.APIURL+this._deleteEmployeesUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getEmployessById(empId): any {
        let formData:FormData = new FormData();
        formData.append('empId', empId);
    return this._http.post(this.globals.APIURL+this._getEmployeesByIdUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error.json() || 'Server error');
    }
    getPostByCompany(compaId): any {
        let formData:FormData = new FormData();
        formData.append('companyId',compaId);
        
    return this._http.post(this.globals.APIURL+this._getALlPositionUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getAllcompany(): any{
        let formData:FormData = new FormData();
        return this._http.post(this.globals.APIURL+this._getAllCompanyUrl,formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getDepartmentByCompany(compaId): any {
        let formData:FormData = new FormData();
        formData.append('companyId',compaId);
    return this._http.post(this.globals.APIURL+this._getAllEmployeesByIdUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getEmployeesByCompID(compaId): any{
        let formData:FormData = new FormData();
        formData.append('companyId',compaId);
        return this._http.post(this.globals.APIURL+this._getEmployeesByCompIdUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
} 
