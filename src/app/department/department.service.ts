
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class DepartmentService {
    private _saveUrl = this._globals.APIURL + 'Department/saveDepartment';
    private _updateDepartmentUrl = this._globals.APIURL + 'Department/updateDepartmentById';
    //private _updateUrl = this._globals.APIURL + 'Department/updateDepartmentById';
    private _deleteUrl = this._globals.APIURL + 'Department/deleteDepartment';
    private _getAllDepartmentUrl = this._globals.APIURL + 'Department/getAllDepartment';
    private _getDepartmentUrl = this._globals.APIURL + 'Department/Department';
    private _getEmployeesUrl = this._globals.APIURL + 'Employees/getEmployees';
    private _getByIdUrl = this._globals.APIURL + 'Department/getDepartmentById';

    private _getAllCompanyUrl = this._globals.APIURL + 'Company/getCompany';

    //private _getDepartmentByUserUrl = this._globals.APIURL + 'Department/getDepartmentByUser';
    private _getDepartmentbyCompUrl = this._globals.APIURL + 'Department/getDepartmentByCompany';

    constructor(private _http: HttpClient, public _globals: Globals) {

    }
    getAllDepartment(): any {
        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this._getAllDepartmentUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getDepartmentByCom(CompId): any {
        let formData: FormData = new FormData();
        formData.append('companyId', CompId);
        return this._http.post(this._getDepartmentbyCompUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    add(data: any, comapnyId, pwList): any {
        let formData: FormData = new FormData();

        // formData.append('departmentLogo', data.departmentLogo);
        // formData.append('departmentBanner', data.departmentBanner);
        // formData.append('departmentBackground', data.departmentBackground);
        this._appendImageUrl(formData, 'departmentLogo', 'API/img/Department/', data.departmentLogo);
        this._appendImageUrl(formData, 'departmentBanner', 'API/img/Department/banner/', data.departmentBanner);
        this._appendImageUrl(formData, 'departmentBackground', 'API/img/Department/background/', data.departmentBackground);
        formData.append('departmentName', data.departmentName);
        formData.append('dep_heapId', JSON.stringify(data.dep_heapId));
        formData.append('companyId', comapnyId);
        formData.append('depPassword', data.depPassword);
        formData.append('cretedCompanyID', this._globals.companyInfo.companyId + "");
        formData.append('subDeps', JSON.stringify(data.subDepartments));
        formData.append('pwList', JSON.stringify(pwList));
        formData.append('member', JSON.stringify(data.member));

        return this._http.post(this._saveUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    updateDepartment(data: any, delSubDeps: any, pwList): any {
        let formData: FormData = new FormData();
        formData.append('departmentId', data.departmentId);
        // formData.append('departmentLogo', data.departmentLogo);
        // formData.append('departmentBanner', data.departmentBanner);
        // formData.append('departmentBackground', data.departmentBackground);
        this._appendImageUrl(formData, 'departmentLogo', 'API/img/Department/', data.departmentLogo);
        this._appendImageUrl(formData, 'departmentBanner', 'API/img/Department/banner/', data.departmentBanner);
        this._appendImageUrl(formData, 'departmentBackground', 'API/img/Department/background/', data.departmentBackground);
        formData.append('departmentName', data.departmentName);
        formData.append('dep_heapId', JSON.stringify(data.dep_heapId));
        // formData.append('userId', this._globals.getUserId().toString());
        formData.append('companyId', data.companyId);
        formData.append('depPassword', data.depPassword);
        formData.append('cretedCompanyID', this._globals.companyInfo.companyId.toString());
        formData.append('subDeps', JSON.stringify(data.subDepartments));
        formData.append('delSubDeps', JSON.stringify(delSubDeps));
        formData.append('pwList', JSON.stringify(pwList));
        formData.append('member', JSON.stringify(data.member));
        if (data.parentDepId) {
            formData.append('parentDepId', data.parentDepId);
        }

        return this._http.post(this._updateDepartmentUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    get(): any {
        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this._getDepartmentUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getById(id, gotoParent): any {
        let formData: FormData = new FormData();
        formData.append('departmentId', id + "");
        if (gotoParent) {
            formData.append('gotoParent', 'true');
        }
        return this._http.post(this._getByIdUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getEmp(compId): any {
        let formData: FormData = new FormData();
        formData.append('companyId', compId);
        return this._http.post(this._getEmployeesUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    delete(Id): any {
        let formData: FormData = new FormData();
        formData.append('departmentId', Id);
        return this._http.post(this._deleteUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllcompany(): any {
        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this._getAllCompanyUrl, formData)
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
