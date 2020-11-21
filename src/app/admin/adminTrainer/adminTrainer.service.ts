
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';
@Injectable()
export class AdminTrainerService {
    private _getUrl = this.globals.APIURL + 'Trainers';
    private _getByComapnyUrl = this.globals.APIURL + 'Trainers';

    private _addUrl = this.globals.APIURL + 'Trainers/addTrainer';
    private _editUrl = this.globals.APIURL + 'Trainers/editTrainer';
    private _deleteUrl = this.globals.APIURL + 'Trainers/deleteTrainer';
    private _getDepartmentUrl = this.globals.APIURL + 'Department/Department';
    private _getPostUrl = this.globals.APIURL + 'Position/positionBycompanyId';
    private _getByIdUrl = this.globals.APIURL + 'Trainers/getTrainerById';
    private _getCertificateByIdUrl = this.globals.APIURL + 'Trainers/Certificate';
    private _getCourseByIdUrl = this.globals.APIURL + 'Trainers/Course';
    private _addCourseUrl = this.globals.APIURL + 'Trainers/addCourse';
    private _EditCourseUrl = this.globals.APIURL + 'Trainers/editCourse';
    private _deleteCourseUrl = this.globals.APIURL + 'Trainers/deleteCourse';
    private _getByCompanyUrl = this.globals.APIURL + 'Course';
    constructor(private _http: HttpClient, public globals: Globals) {

    }
    saveTrainerCouse(CourseId, userId): any {

        let formData: FormData = new FormData();
        formData.append('courseId', CourseId);
        formData.append('trainerId', userId);
        formData.append('companyId', this.globals.companyInfo.companyId + '');
        return this._http.post(this._addCourseUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    editTrainerCouse(CourseId, userId, mapId): any {

        let formData: FormData = new FormData();
        formData.append('courseId', CourseId);
        formData.append('trainerId', userId);
        formData.append('companyId', this.globals.companyInfo.companyId + '');
        formData.append('mapId', mapId);
        return this._http.post(this._EditCourseUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    deleteTrainerCouse(mapId): any {

        let formData: FormData = new FormData();
        formData.append('mapId', mapId);
        return this._http.post(this._deleteCourseUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    add(formField: any): any {
        let formData: FormData = new FormData();
        formData.append('companyId', formField.comapnyId);

        formData.append('departmentId', formField.departmentId);
        formData.append('FIRSTNAME', formField.FIRSTNAME);
        formData.append('LASTNAME', formField.LASTNAME);
        formData.append('GENDER', formField.GENDER);
        formData.append('postOfDepartment', formField.postOfDepartment);
        formData.append('MARITALSTATUS', formField.MARITALSTATUS);
        formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        formData.append('EMAIL', formField.EMAIL);
        formData.append('FatherName', formField.FatherName);
        formData.append('MotherName', formField.MotherName);
        formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);
        formData.append('empEdu', formField.empEdu);
        this._appendImageUrl(formData, 'epath', 'API/img/Employee/', formField.epath);
        this._appendImageUrl(formData, 'Signature', 'API/img/Employee/Signature/', formField.eSignaturepath);
        formData.append('Trainertitle', formField.Trainertitle);
        formData.append('TrainerPostion', formField.TrainerPostion);
        formData.append('createdByComId', this.globals.companyInfo.companyId + "");
        return this._http.post(this._addUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    edit(formField: any): any {

        let formData: FormData = new FormData();
        formData.append('companyId', formField.comapnyId);
        formData.append('FIRSTNAME', formField.FIRSTNAME);
        formData.append('LASTNAME', formField.LASTNAME);
        formData.append('GENDER', formField.GENDER);
        formData.append('postOfDepartment', formField.postOfDepartment);
        formData.append('MARITALSTATUS', formField.MARITALSTATUS);
        formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        formData.append('EMAIL', formField.EMAIL);
        formData.append('FatherName', formField.FatherName);
        formData.append('MotherName', formField.MotherName);
        formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);
        formData.append('empEdu', formField.empEdu);
        formData.append('trainerId', formField.trainerId);
        formData.append('Trainertitle', formField.Trainertitle);
        formData.append('TrainerPostion', formField.TrainerPostion);
        this._appendImageUrl(formData, 'epath', 'API/img/Employee/', formField.epath);
        this._appendImageUrl(formData, 'eSignaturepath', 'API/img/Employee/Signature/', formField.eSignaturepath);
        return this._http.post(this._editUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    delete(employeeId): any {

        let formData: FormData = new FormData();
        formData.append('employeeId', employeeId);
        return this._http.post(this._deleteUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    get(): any {

        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this._getUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getTrainer(compId): any {

        let formData: FormData = new FormData();
        formData.append('companyId', compId);
        return this._http.post(this._getUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllCourseByCompany(companyId): any {

        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this._getByCompanyUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllpost(companyId): any {

        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this._getPostUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getDepartment(companyId): any {
        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this._getDepartmentUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getById(Id): any {
        let formData: FormData = new FormData();
        formData.append('trainerId', Id);
        return this._http.post(this._getByIdUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getloadCertificateByTrainer(Id): any {
        let formData: FormData = new FormData();
        formData.append('trainerId', Id);
        return this._http.post(this._getCertificateByIdUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getloadCourseByTrainer(Id): any {
        let formData: FormData = new FormData();
        formData.append('trainerId', Id);
        return this._http.post(this._getCourseByIdUrl, formData)
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
