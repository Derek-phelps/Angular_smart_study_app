
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';
@Injectable()
export class AdminEmployeeService {
    private _getEmployeesUrl = 'Employees';
    private _getByIdUrl = 'Employees/getEmployeesById';
    private _addUrl = 'Employees/addEmployees';
    private _editUrl = 'Employees/editEmployees';
    private _deleteUrl = 'Employees/deleteEmployees';

    private _assaineCourseUrl = 'Employees/saveEmployeesCourse';
    private _editAssaineCourseUrl = 'Employees/editEmployeesCourse';
    private _assaineDeleteCourseUrl = 'Employees/deleteEmployeesCourse';

    private _getPostUrl = 'Position/positionBycompanyId';
    private _getCourseByEmpIdUrl = 'Employees/getCourse';
    private _getByCertificateUrl = 'Employees/getCertificate';

    private _getByCompanyUrl = 'Course';
    private _getDepartmentUrl = 'Department/Department';
    private _getProgressUrl = 'Question/getProgress';

    constructor(private _http: HttpClient, public _globals: Globals) {

    }
    getloadCourseByEmp(EmpId): any {
        let formData: FormData = new FormData();
        formData.append('EmpId', EmpId);
        return this._http.post(this._globals.APIURL + this._getCourseByEmpIdUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getDepartment(companyId): any {

        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this._globals.APIURL + this._getDepartmentUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getloadCertificateByEmp(EmpId): any {

        let formData: FormData = new FormData();
        formData.append('EmpId', EmpId);
        return this._http.post(this._globals.APIURL + this._getByCertificateUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    deleteEmpCouse(CourseAssId): any {

        let formData: FormData = new FormData();
        formData.append('CourseAssId', CourseAssId);
        return this._http.post(this._globals.APIURL + this._assaineDeleteCourseUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    saveEmpCouse(CourseId, EmpId): any {

        let formData: FormData = new FormData();
        formData.append('CourseId', CourseId);
        formData.append('EmpId', EmpId);
        formData.append('companyId', this._globals.companyInfo.companyId + "");
        return this._http.post(this._globals.APIURL + this._assaineCourseUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    editEmpCouse(CourseId, EmpId, StartDate, CourseAssId): any {

        let formData: FormData = new FormData();
        formData.append('CourseId', CourseId);
        formData.append('EmpId', EmpId);
        formData.append('StartDate', StartDate);
        formData.append('CourseAssId', CourseAssId);
        return this._http.post(this._globals.APIURL + this._editAssaineCourseUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    passUserCourse(empId, courseId, justPass): any {
        let formData: FormData = new FormData();
        formData.append('courseId', courseId);
        formData.append('empId', empId);
        formData.append('justPass', justPass)
        return this._http.post(this._globals.APIURL + 'Course/passUserCourse', formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllCourseByCompany(companyId): any {

        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this._globals.APIURL + this._getByCompanyUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getById(Id, fullInfo = false, appendNames = false): any {
        let formData: FormData = new FormData();
        formData.append('empId', Id + "");
        if (fullInfo) {
            formData.append('fullInfo', '1');
        }
        if (appendNames) {
            formData.append('appendNames', '1');
        }
        return this._http.post(this._globals.APIURL + this._getByIdUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    get(companyId, includeInactive = false): any {

        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        if (includeInactive) {
            formData.append('includeInactive', '1');
        }
        return this._http.post(this._globals.APIURL + this._getEmployeesUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    addUserGroupDep(userId, groupId = undefined, departmentId = undefined): any {
        let formData: FormData = new FormData();
        formData.append('userId', userId);
        if (groupId) {
            formData.append('groupId', groupId);
        } else if (departmentId) {
            formData.append('departmentId', departmentId);
        }
        return this._http.post(this._globals.APIURL + 'Employees/addUserGroupDep', formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    deleteUserGroupDep(userId, groupId = undefined, departmentId = undefined): any {
        let formData: FormData = new FormData();
        formData.append('userId', userId);
        if (groupId) {
            formData.append('groupId', groupId);
        }
        if (departmentId) {
            formData.append('departmentId', departmentId);
        }
        return this._http.post(this._globals.APIURL + 'Employees/deleteUserGroupDep', formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    deleteCourseAssignment(courseAssId): any {
        let formData: FormData = new FormData();
        formData.append('courseAssId', courseAssId);
        return this._http.post(this._globals.APIURL + 'Course/deleteCourseAssignment', formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    add(formField: any, viewGroups: any, adminGroups: any): any {

        //console.log(formField);
        let formData: FormData = new FormData();
        formData.append('comapnyId', formField.comapnyId);
        formData.append('userType', formField.userType);
        formData.append('departmentIds', JSON.stringify(formField.departmentIds));
        formData.append('groupIds', JSON.stringify(formField.groupIds));
        formData.append('FIRSTNAME', formField.FIRSTNAME);
        formData.append('LASTNAME', formField.LASTNAME);
        formData.append('FULLNAME', formField.FULLNAME);
        formData.append('staffNumber', formField.staffNumber);
        formData.append('GENDER', formField.GENDER);
        formData.append('postOfDepartment', formField.postOfDepartment);
        formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        formData.append('EMAIL', formField.EMAIL);
        formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);
        if (viewGroups.length > 0) {
            formData.append('viewGroups', JSON.stringify(viewGroups));
        }
        if (adminGroups.length > 0) {
            formData.append('adminGroups', JSON.stringify(adminGroups));
        }
        //formData.append('epath', formField.epath);
        this._appendImageUrl(formData, 'epath', 'API/img/Employee/', formField.epath);
        formData.append('myCompany', this._globals.companyInfo.companyId + "");
        return this._http.post(this._globals.APIURL + this._addUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    edit(formField: any, viewGroups: any, adminGroups: any): any {

        let formData: FormData = new FormData();
        formData.append('empId', formField.empId);
        formData.append('userId', formField.userId);
        formData.append('companyId', formField.comapnyId);
        formData.append('userType', formField.userType);
        formData.append('departmentIds', JSON.stringify(formField.departmentIds));
        formData.append('groupIds', JSON.stringify(formField.groupIds));
        formData.append('FIRSTNAME', formField.FIRSTNAME);
        formData.append('LASTNAME', formField.LASTNAME);
        formData.append('FULLNAME', formField.FULLNAME);
        formData.append('staffNumber', formField.staffNumber);
        formData.append('GENDER', formField.GENDER);
        formData.append('postOfDepartment', formField.postOfDepartment);
        formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        formData.append('EMAIL', formField.EMAIL);
        formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);
        if (viewGroups.length > 0) {
            formData.append('viewGroups', JSON.stringify(viewGroups));
        }
        if (adminGroups.length > 0) {
            formData.append('adminGroups', JSON.stringify(adminGroups));
        }
        //formData.append('epath', formField.epath);
        this._appendImageUrl(formData, 'epath', 'API/img/Employee/', formField.epath);
        return this._http.post(this._globals.APIURL + this._editUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))

        // let formData: FormData = new FormData();
        // formData.append('companyId', formField.comapnyId);
        // formData.append('departmentId', formField.departmentId);
        // formData.append('FIRSTNAME', formField.FIRSTNAME);
        // formData.append('LASTNAME', formField.LASTNAME);
        // formData.append('GENDER', formField.GENDER);
        // formData.append('postOfDepartment', formField.postOfDepartment);
        // formData.append('MOBILEPHONE', formField.MOBILEPHONE);
        // formData.append('EMAIL', formField.EMAIL);
        // formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);
        // formData.append('empEdu', formField.empEdu);
        // //formData.append('epath', formField.epath);
        // this._appendImageUrl(formData, 'epath', 'API/img/Employee/', formField.epath);
        // formData.append('EmpId', formField.empId);
        // formData.append('handlePreviousPosAss', handlePreviousPosAss.toString());
        // formData.append('handlePreviousDepAss', handlePreviousDepAss.toString());
        // return this._http.post(this._globals.APIURL + this._editUrl, formData)
        //     .pipe(map((response: Response) => response))
        //     .pipe(catchError(this.handleError))
    }
    delete(employeeId): any {

        let formData: FormData = new FormData();
        formData.append('employeeId', employeeId);
        return this._http.post(this._globals.APIURL + this._deleteUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    setActivation(empId, activate): any {
        let formData: FormData = new FormData();
        formData.append('empId', empId);
        if (activate) {
            formData.append('activate', 'true');
        }
        return this._http.post(this._globals.APIURL + 'Employees/setActivationEmployee', formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getProgress(employeeId, courseId): any {

        let formData: FormData = new FormData();
        formData.append('UserId', employeeId);
        formData.append('courseId', courseId);
        return this._http.post(this._globals.APIURL + this._getProgressUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    // getAllpost(companyId): any {

    //     let formData: FormData = new FormData();
    //     formData.append('companyId', companyId);
    //     return this._http.post(this._globals.APIURL + this._getPostUrl, formData)
    //         .pipe(map((response: Response) => response))
    //         .pipe(catchError(this.handleError))
    // }
    postFile(fileToUpload: File): any {
        const formData: FormData = new FormData();
        formData.append('fileKey', fileToUpload, fileToUpload.name);
        return this._http
            .post(this._globals.APIURL + 'Employees/uploadEmployeeExcel', formData, { headers: { contentType: 'multipart/form-data' } })
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    finishEmpUpload(sendMail): any {
        let formData: FormData = new FormData();
        if (sendMail) {
            formData.append('sendMail', 'true');
        }
        formData.append('internet-explorer-fix', '');
        return this._http.post(this._globals.APIURL + 'Employees/finishEmpUpload', formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getGroups(): any {
        return this._http.get(this._globals.APIURL + 'Groups')
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    loadEmpCourseData(userId, empId): any {
        let formData: FormData = new FormData();
        formData.append('userId', userId);
        formData.append('empId', empId);
        return this._http.post(this._globals.APIURL + 'Course/getMyCourses', formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    generateNewPw(userId): any {
        let formData: FormData = new FormData();
        formData.append('userId', userId);
        return this._http.post(this._globals.APIURL + 'Users/changePwAdmin', formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError));
    }
    syncAdUsers(): any {
        return this._http.get(this._globals.APIURL + 'Users/syncAdUsers')
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
