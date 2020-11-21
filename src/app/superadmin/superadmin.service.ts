
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class SuperadminService {
    private _getAllCompanyUrl = 'Company/getCompanyWithCourse';
    private _addCompanyUrl = 'Company/saveCompany';
    private _editCompanyUrl = 'Company/editCompany';
    private _deleteCompanyUrl = 'Company/deleteCompany';
    private _getCompanyByIdUrl = 'Company';
    private _MapCourseUrl = 'Company/SaveCourseMap';

    private _getCourseByCompId = 'Course/getMapCourse';
    private _deleteMapUrl = 'Course/deleteMapUrl';
    
    private _getAllDepartment ="Department";
    private _getAllCourseUrl = 'Course';
    private _addCourseUrl = 'Course/saveCompany';
    private _editCourseUrl = 'Course/editCompany';
    private _deleteCourseUrl = 'Course/deleteCourse';

    private _getAllChapterUrl = 'Chapter/getAllChapters';
    private _addChapterUrl = 'Chapter/saveCompany';
    private _editChapterUrl = 'Chapter/editCompany';
    private _deleteChapterUrl = 'Chapter/deleteCompany';
    

    private _getAllQuestionUrl = 'Question/getAllQuestion';
    private _addQuestionUrl = 'Question/saveCompany';
    private _editQuestionUrl = 'Question/editCompany';
    private _deleteQuestionUrl = 'Question/deleteCompany';

    private _getAllCertificateUrl = 'Certificater/AllCertificate';
    private _addCertificateUrl = 'Certificater/addCertificate';
    private _editCertificateUrl = 'Certificater/editCertificate';
    private _deleteCertificateUrl = 'Certificater/deleteCertificate';

    private _getSuperAdminUrl = 'Users/getSuperAdminDashnoard';

    private _checkUserEmailUrl = 'Users/validEmail';
    constructor(private _http: HttpClient,public _globals: Globals) { 
           
    }
    getAllDepartment(companyId):any{
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this._globals.APIURL+this._getAllDepartment,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }

    deletMapCourseByComp(courseMapId): any{
        let formData:FormData = new FormData();
        
        formData.append('courseMapId', courseMapId);
 
        return this._http.post(this._globals.APIURL+this._deleteMapUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getSuperAdminDashnoard(): any{
        let formData:FormData = new FormData();

        return this._http.post(this._globals.APIURL+this._getSuperAdminUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError));
    }
    getAllCompany(): any  {
        let formData:FormData = new FormData();
        return this._http.post(this._globals.APIURL+this._getAllCompanyUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    addCompany(form:any): any  {
        let formData:FormData = new FormData();
        
        formData.append('companyName', form.companyName);
        formData.append('companyLogo', form.companyLogo);
        formData.append('companyRegNo', form.companyRegNo);
        formData.append('NumOfEmp', form.NumOfEmp);
        formData.append('compUrl', form.compUrl);
        formData.append('webUrl', form.webUrl);
        formData.append('baner', form.baner);
        formData.append('BackgroundImage', form.BackgroundImage);
        formData.append('adminEmail', form.adminEmail);
        formData.append('adminPassword', form.adminPassword);
        formData.append('CourseList', JSON.stringify(form.CourseList) );

    return this._http.post(this._globals.APIURL+this._addCompanyUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    editCompany(form:any): any  {
        let formData:FormData = new FormData();
        
        formData.append('companyName', form.companyName);
        formData.append('companyLogo', form.companyLogo);
        formData.append('companyRegNo', form.companyRegNo);
        formData.append('NumOfEmp', form.NumOfEmp);
        formData.append('compUrl', form.compUrl);
        formData.append('webUrl', form.webUrl);
        formData.append('baner', form.baner);
        formData.append('BackgroundImage', form.BackgroundImage);
        formData.append('companyId', form.companyId);
        formData.append('adminEmail', form.adminEmail);
        formData.append('CourseList', JSON.stringify(form.CourseList) );
        
    return this._http.post(this._globals.APIURL+this._editCompanyUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    deleteCompany(companyId): any  {
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
    return this._http.post(this._globals.APIURL+this._deleteCompanyUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    getCompanyById(companyId):any{
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
    return this._http.post(this._globals.APIURL+this._getCompanyByIdUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getCompanyWithCompanyById(companyId):any{
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
    return this._http.post(this._globals.APIURL+this._getAllCompanyUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    emailExist(email):any{
        let formData:FormData = new FormData();
        formData.append('email', email);
    return this._http.post(this._globals.APIURL+this._checkUserEmailUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    saveMapCourseByComp(form):any{
        let formData:FormData = new FormData();
        
        formData.append('companyId', form.companyId);   
        formData.append('CourseList', JSON.stringify(form.CourseList) );
        
    return this._http.post(this._globals.APIURL+this._MapCourseUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getCourseByCompId(companyId):any{
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this._globals.APIURL+this._getCourseByCompId,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getAllCourse(): any  {

        let formData:FormData = new FormData();

        return this._http.post(this._globals.APIURL+this._getAllCourseUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    addCourse(form:any,img): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._addCourseUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    editCourse(form:any): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._editCourseUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    deleteCourse(courseId): any  {
        let formData:FormData = new FormData();
        formData.append('CourseId', courseId);
    return this._http.post(this._globals.APIURL+this._deleteCourseUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }

    getAllChapter(): any  {

        let formData:FormData = new FormData();

        return this._http.post(this._globals.APIURL+this._getAllChapterUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    addChapter(form:any,img): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._addChapterUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    editChapter(form:any): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._editChapterUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    deleteChapter(companyId): any  {
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
    return this._http.post(this._globals.APIURL+this._deleteChapterUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }

    getAllQuestion(): any  {

        let formData:FormData = new FormData();

        return this._http.post(this._globals.APIURL+this._getAllQuestionUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    addQuestion(form:any,img): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._addQuestionUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    editQuestion(form:any): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._editQuestionUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    deleteQuestion(companyId): any  {
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
    return this._http.post(this._globals.APIURL+this._deleteQuestionUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }

    getAllCertificate(): any  {

        let formData:FormData = new FormData();

        return this._http.post(this._globals.APIURL+this._getAllCertificateUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    addCertificate(form:any,img): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._addCertificateUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    editCertificate(form:any): any  {
        let formData:FormData = new FormData();
        formData.append('username', form.email);
    return this._http.post(this._globals.APIURL+this._editCertificateUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }
    deleteCertificate(companyId): any  {
        let formData:FormData = new FormData();
        formData.append('companyId', companyId);
    return this._http.post(this._globals.APIURL+this._deleteCertificateUrl,formData)
        .pipe(map((response: Response) => response.json()))
        .pipe(catchError(this.handleError))
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error || 'Server error');
    }
} 
