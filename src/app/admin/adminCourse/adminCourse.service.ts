
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';

export interface Question {
  feedbackId: string;
  questionText: string;
  questionType: string;
  questionSettings;
  mandatory: '0' | '1';
}

@Injectable()
export class AdminCourseService {
  private _getByCompanyUrl = 'Course';
  private _getByCompanyQuestionUrl = 'Question';
  private _getByUserUrl = 'Course/getCourseByUserId';
  private _getByTrainerUrl = 'Course/getCourseByTrainerId';
  public _getByIdUrl = 'Course/getCourseById';
  public _getCourseFeedbackListUrl = 'Course/getCourseFeedbackList';
  public _setCourseFeedbackListUrl = 'Course/setCourseFeedbackList';
  public _addUrl = 'Course/addCourse';
  public _editUrl = 'Course/editCourse';
  public _deleteUrl = 'Course/deleteCourse';
  private _deleteChapterUrl = 'Chapter/deleteChapter';
  private _editChapterUrl = 'Chapter/editChapter';
  private _deleteQustionUrl = 'Question/deleteQuestion'
  public _setClosedStateUrl = 'Course/setClosedState';
  private _getDepartmentUrl = 'Department';
  //private _getPositionsUrl = 'Position';
  //private _getEmployeeByCourseIdUrl = 'Employees/getEmployeesByCourse';
  private _getCompanyAllEmpReportUrl = 'Employees/getCompanyAllEmpReport';
  private _getTrainerByCompUrl = 'Trainers';
  private _getCourseEmpReportUrl = 'Course/getCourseEmpReport';
  private _getConfirmEmpListbyCourseIdUrl = 'Course/getConfirmEmpListbyCourseId';
  private _getConfirmSendEmpListbyCourseIdUrl = 'Course/getConfirmEmpSendListbyCourseId';
  private _getSendEmpListByMailUrl = 'Course/sendEmpListByMail';
  // private _getSendCertificateUrl = 'Course/sendCertificateByMail';
  private _getSendCertificateUrl = 'Certificater/mailCertificates';
  private _loginUrl = 'Users/login';
  private _assaineCourseUrl = 'Employees/saveEmployeesCourse';
  private _addEmpUrl = 'Employees/addEmployees';
  private _getLocationByIdUrl = 'Location/Location';
  private _getWorkGroupsByIdUrl = 'Location/getLocationWorkGroups';
  private _assaineDeleteCourseUrl = 'Employees/deleteEmployeesCourse';
  private _getEmpNameUrl = 'Employees/getEmployeeName';
  private _setEmpNameUrl = 'Employees/updateEmployeeName';
  private _addOrUpdateWorkGroupByIdUrl = 'Location/addOrUpdateWorkGroupById';
  private _deleteEmpUrl = 'Employees/deleteEmployees';
  private _getChapterByEmpUrl = "Chapter/getChapterByEmp";
  private _addPrivateWGUrl = "Location/addPrivateWGUrl";
  // Chapter urls
  //private _getChapterUrl = this.globals.APIURL + 'Chapter';
  private _getChapterByCourseUrl = 'Chapter/getChapterByCourseId';
  private _getChapterByChapterId = 'Chapter/getOfflineSubChaByChapterId';
  private _deleteCertificateUrl = 'Certificater/deleteCertificate';

  constructor(private _http: HttpClient, public globals: Globals) {

  }
  deleteCertificate(certiId): any {
    let formData: FormData = new FormData();
    formData.append('certificaterId', certiId);
    return this._http.post(this.globals.APIURL + this._deleteCertificateUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  deleteEmp(employeeId): any {

    let formData: FormData = new FormData();
    formData.append('employeeId', employeeId);
    return this._http.post(this.globals.APIURL + this._deleteEmpUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  deleteEmpCouse(CourseAssId): any {

    let formData: FormData = new FormData();
    formData.append('CourseAssId', CourseAssId);
    return this._http.post(this.globals.APIURL + this._assaineDeleteCourseUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getAllCourseByUser(): any {
    return this._http.get(this.globals.APIURL + this._getByUserUrl)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getCourseQuestions(courseId: string) {
    return this._http.post<Question[]>(this.globals.APIURL + this._getCourseFeedbackListUrl, { courseId })
      .pipe(catchError(this.handleError));
  }
  setCourseQuestions(courseId: string, questions: Question[]) {
    return this._http.post<Question[]>(this.globals.APIURL + this._setCourseFeedbackListUrl, { courseId, questions })
      .pipe(catchError(this.handleError));
  }
  passUserCourse(empId, courseId, justPass): any {
    let formData: FormData = new FormData();
    formData.append('courseId', courseId);
    formData.append('empId', empId);
    formData.append('justPass', justPass)
    return this._http.post(this.globals.APIURL + 'Course/passUserCourse', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getCompanyAllEmpReport(): any {
    let formData: FormData = new FormData();
    formData.append('companyId', this.globals.companyInfo.companyId + "");
    return this._http.post(this.globals.APIURL + this._getCompanyAllEmpReportUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  // getEmployeeByCourseId(CourseId, companyId): any {
  //   let formData: FormData = new FormData();
  //   formData.append('CourseId', CourseId);
  //   formData.append('companyId', companyId);
  //   return this._http.post(this.globals.APIURL + this._getEmployeeByCourseIdUrl, formData)
  //     .pipe(map((response: Response) => response))
  //     .pipe(catchError(this.handleError))
  // }
  getDepartment(): any {
    let formData: FormData = new FormData();
    formData.append('internet-explorer-fix', '');
    return this._http.post(this.globals.APIURL + this._getDepartmentUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  // getPositions(companyId): any {
  //   let formData: FormData = new FormData();
  //   formData.append('companyId', companyId);

  //   return this._http.post(this.globals.APIURL + this._getPositionsUrl, formData)
  //     .pipe(map((response: Response) => response))
  //     .pipe(catchError(this.handleError))
  // }
  getAllCourseByCompany(companyId): any {
    let formData: FormData = new FormData();
    formData.append('companyId', companyId);
    return this._http.post(this.globals.APIURL + this._getByCompanyUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getAllCourseByTrainer(): any {
    return this._http.get(this.globals.APIURL + this._getByTrainerUrl)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getCourseById(Id): any {
    let formData: FormData = new FormData();
    formData.append('Course', Id);
    return this._http.post(this.globals.APIURL + this._getByIdUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getLocationsByComp(): any {
    return this._http.get(this.globals.APIURL + this._getLocationByIdUrl)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getWorkGroupsById(Id): any {
    let formData: FormData = new FormData();
    formData.append('locationId', Id);
    return this._http.post(this.globals.APIURL + this._getWorkGroupsByIdUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getEmployeeNameById(Id): any {
    let formData: FormData = new FormData();
    formData.append('empId', Id);
    return this._http.post(this.globals.APIURL + this._getEmpNameUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  // setEmployeeNameById(Id, name, workgroupId): any {
  //   let formData: FormData = new FormData();
  //   formData.append('empId', Id);
  //   formData.append('FIRSTNAME', name);
  //   formData.append('workgroupId', workgroupId);
  //   return this._http.post(this.globals.APIURL + this._setEmpNameUrl, formData)
  //     .pipe(map((response: Response) => response))
  //     .pipe(catchError(this.handleError))
  // }
  addOrUpdateWorkGroupById(workingGroup): any {
    let formData: FormData = new FormData();
    formData.append('workingGroup', JSON.stringify(workingGroup));
    return this._http.post(this.globals.APIURL + this._addOrUpdateWorkGroupByIdUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  add(formField: any, CopyCourse, informEmp: any, viewList, adminList): any {
    //console.log(formField);
    let formData: FormData = new FormData();
    formData.append('courseName', formField.courseName);
    formData.append('duration', formField.duration);
    formData.append('courseRate', formField.courseRate);
    formData.append('courseDes', formField.courseDes);
    formData.append('departmentIds', JSON.stringify(formField.departmentIds));
    formData.append('mandatoryDepartmentIds', JSON.stringify(formField.mandatoryDepartmentIds));
    formData.append('positionIds', JSON.stringify(formField.positionIds));
    formData.append('mandatoryPositionIds', JSON.stringify(formField.mandatoryPositionIds));
    formData.append('minResult', formField.minResult);
    formData.append('startDate', formField.StartTime);
    formData.append('EndTime', formField.EndTime);

    this._appendImageUrl(formData, 'imgPath', 'API/img/Course/', formField.courseImg);

    formData.append('trainerId', formField.trainerId);
    formData.append('locationId', formField.locationId);
    formData.append('isLocReq', formField.isLocReq);
    formData.append('isOffline', formField.isOffline);
    formData.append('isScormCourse', formField.isScormCourse);
    formData.append('scormPath', formField.scormPath);
    formData.append('CopyCourse', CopyCourse);
    formData.append('informEmp', informEmp);

    formData.append('viewList', JSON.stringify(viewList));
    formData.append('adminList', JSON.stringify(adminList));

    return this._http.post(this.globals.APIURL + this._addUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  edit(formField: any, informEmp: any, viewList, adminList, bNewScormFile: boolean): any {
    let formData: FormData = new FormData();
    formData.append('courseId', formField.courseId);
    formData.append('courseName', formField.courseName);
    formData.append('duration', formField.duration);
    formData.append('courseRate', formField.courseRate);
    formData.append('courseDes', formField.courseDes);
    // formData.append('departmentIds', JSON.stringify(formField.departmentIds));
    // formData.append('mandatoryDepartmentIds', JSON.stringify(formField.mandatoryDepartmentIds));
    formData.append('positionIds', JSON.stringify(formField.positionIds));
    // formData.append('mandatoryPositionIds', JSON.stringify(formField.mandatoryPositionIds));
    formData.append('minResult', formField.minResult);
    formData.append('startDate', formField.StartTime);
    formData.append('EndTime', formField.EndTime);

    this._appendImageUrl(formData, 'imgPath', 'API/img/Course/', formField.courseImg);

    formData.append('trainerId', formField.trainerId);
    formData.append('locationId', formField.locationId);
    formData.append('isLocReq', formField.isLocReq);
    formData.append('isOffline', formField.isOffline);
    formData.append('isScormCourse', formField.isScormCourse);
    formData.append('scormPath', formField.scormPath);
    //formData.append('course_trainerId', formField.courseMapId);
    formData.append('informEmp', informEmp);
    //formData.append('informChanges', informChanges);

    formData.append('viewList', JSON.stringify(viewList));
    formData.append('adminList', JSON.stringify(adminList));

    if (bNewScormFile) {
      formData.append('newScormFile', 'true');
    }

    return this._http.post(this.globals.APIURL + this._editUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  editCourseIgnoreOrder(courseId: number, ignoreOrder: boolean): any {
    let formData: FormData = new FormData();
    formData.append('courseId', '' + courseId);
    formData.append('ignore_ordering', ignoreOrder ? '1' : '0');

    return this._http.post(this.globals.APIURL + 'Course/ignoreOrdering', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  delete(CourseId): any {
    let formData: FormData = new FormData();
    formData.append('CourseId', CourseId);
    return this._http.post(this.globals.APIURL + this._deleteUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  deleteChapter(ChapterId): any {
    let formData: FormData = new FormData();
    formData.append('ChapterId', ChapterId);
    return this._http.post(this.globals.APIURL + this._deleteChapterUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  deleteQuestion(qustionId): any {
    let formData: FormData = new FormData();
    formData.append('QustionId', qustionId);
    return this._http.post(this.globals.APIURL + this._deleteQustionUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  setClosedState(CourseId, isClosed): any {
    let formData: FormData = new FormData();
    formData.append('CourseId', CourseId);
    formData.append('isClosed', isClosed);
    return this._http.post(this.globals.APIURL + this._setClosedStateUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getSubChapterByChapId(courseId, EmpId): any {

    let formData: FormData = new FormData();
    formData.append('UserId', EmpId);
    formData.append('courseId', courseId);
    return this._http.post(this.globals.APIURL + this._getChapterByEmpUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getTrainerByComp(companyId): any {
    let formData: FormData = new FormData();
    formData.append('companyId', companyId);
    return this._http.post(this.globals.APIURL + this._getTrainerByCompUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  // getCourseEmpReport(CourseId): any {
  //   let formData: FormData = new FormData();
  //   formData.append('CourseId', CourseId);
  //   formData.append('companyId', this.globals.companyInfo.companyId + "");
  //   return this._http.post(this.globals.APIURL + this._getCourseEmpReportUrl, formData)
  //     .pipe(map((response: Response) => response))
  //     .pipe(catchError(this.handleError))
  // }
  getCourseData(courseId): any {
    let formData: FormData = new FormData();
    formData.append('courseId', courseId);
    return this._http.post(this.globals.APIURL + 'Course/getCourseData', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getEmployeeConfirmarionByCourseId(CourseId): any {
    let formData: FormData = new FormData();
    formData.append('CourseId', CourseId);
    formData.append('companyId', this.globals.companyInfo.companyId + "");
    return this._http.post(this.globals.APIURL + this._getConfirmEmpListbyCourseIdUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getCourseEmpReportSend(CourseId, emailId): any {
    let formData: FormData = new FormData();
    formData.append('CourseId', CourseId);
    formData.append('EMAIL', emailId);
    formData.append('companyId', this.globals.companyInfo.companyId + "");
    return this._http.post(this.globals.APIURL + this._getSendEmpListByMailUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  markConfirmed(course): any {
    //console.log(JSON.stringify(course));
    let formData: FormData = new FormData();
    formData.append('empCourse', JSON.stringify(course));
    return this._http.post(this.globals.APIURL + this._getConfirmSendEmpListbyCourseIdUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  sendCertificate(courseId, form, bIsSmartStudyUser, bSetPassword, bSendAll, empList): any {
    //console.log(JSON.stringify(chpId));
    let formData: FormData = new FormData();
    // formData.append('CourseId', chpId);
    // formData.append('EmailId', EmailId);
    formData.append('courseId', courseId);
    formData.append('isPublic', bIsSmartStudyUser ? '0' : '1');
    formData.append('hasPassword', bSetPassword ? '1' : '0');
    formData.append('password', form.password);
    formData.append('expiresIn', form.expiresIn);
    formData.append('expirationUnit', form.expirationUnit);
    formData.append('mail', form.mail);
    formData.append('sendAll', bSendAll ? '1' : '0');
    formData.append('empList', JSON.stringify(empList));

    return this._http.post(this.globals.APIURL + this._getSendCertificateUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getUserData(form: any): any {
    let formData: FormData = new FormData();
    formData.append('username', form.email);
    formData.append('password', form.password);
    return this._http.post(this.globals.APIURL + this._loginUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  assignCourse(courseId, empId): any {
    // let formData: FormData = new FormData();
    // formData.append('CourseId', courseId + "");
    // formData.append('EmpId', empId + "");
    // formData.append('companyId', this.globals.companyInfo.companyId + "");
    // return this._http.post(this.globals.APIURL + this._assaineCourseUrl, formData)
    //   .pipe(map((response: Response) => response))
    //   .pipe(catchError(this.handleError))
  }
  addPrivateNewWorkingGroup(workgroupName: any, locationId: any): any {
    let formData: FormData = new FormData();
    formData.append('workgroupName', workgroupName);
    formData.append('locationId', locationId);
    return this._http.post(this.globals.APIURL + this._addPrivateWGUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  registerNewUser(formField: any): any {
    //console.log(formField);
    let formData: FormData = new FormData();
    formData.append('comapnyId', formField.comapnyId);
    formData.append('userName', formField.userName);
    formData.append('departmentId', formField.departmentId);
    let name = '';
    if (formField.TITLE != '') {
      name = name + formField.TITLE + ' ';
    }
    name = name + formField.FIRSTNAME + ' ' + formField.LASTNAME;
    if (formField.AFTERTITLE != '') {
      name = name + ' ' + formField.AFTERTITLE;
    }
    //formData.append('FIRSTNAME', formField.TITLE + ' ' + formField.FIRSTNAME + ' ' + formField.LASTNAME + ' ' + formField.AFTERTITLE);
    formData.append('FIRSTNAME', name);
    //formData.append('LASTNAME', formField.LASTNAME);
    formData.append('LASTNAME', "");
    formData.append('GENDER', formField.GENDER);
    formData.append('MOBILEPHONE', formField.MOBILEPHONE);
    formData.append('EMAIL', formField.EMAIL);
    formData.append('CURRENTADDRESS', formField.CURRENTADDRESS);
    formData.append('empEdu', formField.empEdu);
    //formData.append('epath', formField.epath);
    this._appendImageUrl(formData, 'epath', 'API/img/Employee/', formField.epath);
    formData.append('isRegistration', "true");
    formData.append('NewPassword', formField.NewPassword);
    formData.append('myCompany', this.globals.companyInfo.companyId + "");
    formData.append('workgroupId', formField.workgroupId);
    return this._http.post(this.globals.APIURL + this._addEmpUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  postCourse(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    return this._http
      .post(this.globals.APIURL + 'Course/uploadScormCourse?companyId=' + this.globals.companyInfo.companyId, formData, { headers: { contentType: 'multipart/form-data' }, reportProgress: true, observe: 'events' })
      //.pipe(map((response: Response) => response))
      .pipe(map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total) + "%";
            return { progress: progress };
          case HttpEventType.Response:
            return event.body;
          default:
            return { eventType: event.type };
        }
      }))
      .pipe(catchError(this.handleError));
  }

  // Chapter stuff
  // getChapter(): any {
  //   let formData: FormData = new FormData();
  //   formData.append('companyId', this.globals.companyInfo.companyId + "");
  //   return this._http.post(this._getChapterUrl, formData)
  //     .pipe(map((response: Response) => response))
  //     .pipe(catchError(this.handleError))
  // }
  getChapterByCourseId($courseId): any {
    let formData: FormData = new FormData();
    formData.append('companyId', this.globals.companyInfo.companyId + "");
    formData.append('courseId', $courseId);
    return this._http.post(this.globals.APIURL + this._getChapterByCourseUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  // Question stuff
  getData(companyId, courseId = undefined): any {
    let formData: FormData = new FormData();
    formData.append('companyId', companyId);
    if (courseId) {
      formData.append('courseId', courseId);
    }
    return this._http.post(this.globals.APIURL + this._getByCompanyQuestionUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  postFile(fileToUpload: File): any {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this._http
      .post(this.globals.APIURL + 'Question/uploadQustionExcel?companyId=' + this.globals.companyInfo.companyId, formData, { headers: { contentType: 'multipart/form-data' } })
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  postImage(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this._http
      .post(this.globals.APIURL + 'Question/uploadQuestionImage?companyId=' + this.globals.companyInfo.companyId, formData, { headers: { contentType: 'multipart/form-data' } })
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  postQuestionZip(fileToUpload: File, courseId): any {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('companyId', this.globals.companyInfo.companyId.toString());
    formData.append('courseId', courseId);
    return this._http
      .post(this.globals.APIURL + 'Question/uploadQuestionZip', formData, { headers: { contentType: 'multipart/form-data' } })
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getSubChapterByChapter(chapId): any {
    let formData: FormData = new FormData();
    formData.append('ChapterId', chapId);
    return this._http.post(this.globals.APIURL + this._getChapterByChapterId, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getUserList(companyId): any {

    let formData: FormData = new FormData();
    formData.append('companyId', companyId);
    return this._http.post(this.globals.APIURL + 'Employees', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  deleteCourseAssignment(courseAssId): any {
    let formData: FormData = new FormData();
    formData.append('courseAssId', courseAssId);
    return this._http.post(this.globals.APIURL + 'Course/deleteCourseAssignment', formData)
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

  editChapterOrder(chapter: any): Observable<any> {
    // yes, this really IS necessary.
    chapter['course'] = chapter['courseId'];
    chapter['ChapterName'] = chapter['chapterName'];

    return this._http.post(this.globals.APIURL + this._editChapterUrl, chapter)
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
