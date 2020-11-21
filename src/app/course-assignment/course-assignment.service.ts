import { Injectable } from '@angular/core';

import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';
//import { FOCUS_MONITOR_PROVIDER_FACTORY } from '@angular/cdk/a11y';

@Injectable({
  providedIn: 'root'
})
export class CourseAssignmentService {

  constructor(private _http: HttpClient, public _globals: Globals) { }

  getCourseAssignment(courseAssId): any {
    let formData: FormData = new FormData();
    formData.append('courseAssId', courseAssId);
    return this._http.post(this._globals.APIURL + 'Course/getCourseAssignment', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  getMyAssignmentCourseList(): any {
    let formData: FormData = new FormData();
    formData.append('internet-explorer-fix', '');
    return this._http.post(this._globals.APIURL + 'Course/getAssignmentCourseList', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  loadGroups(groupId = undefined, departmentId = undefined): any {
    let formData: FormData = new FormData();
    if (groupId) {
      formData.append('groupId', groupId);
    }
    if (departmentId) {
      formData.append('departmentId', departmentId);
    }
    formData.append('internet-explorer-fix', '');
    return this._http.post(this._globals.APIURL + 'Groups/getGroupList', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  getEmployees(userId = undefined): any {
    if (userId) {
      let formData: FormData = new FormData();
      formData.append('userId', userId + "");
      return this._http.post(this._globals.APIURL + 'Employees/getEmployeeByUserId', formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    } else {
      let formData: FormData = new FormData();
      formData.append('internet-explorer-fix', '');
      return this._http.post(this._globals.APIURL + 'Employees', formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
  }

  addOrUpdateCourseAssignment(courseAssId, courseId, userId, groupId, departmentId, isMandatory, startDate, timeSpan,
    isRecurring, recurringSpan, recurringUnit, endDate, catchUp, forceSeries, applyToSubDeps): any {
    let formData: FormData = new FormData();
    if (courseAssId) {
      formData.append('courseAssId', courseAssId);
    }
    formData.append('courseId', courseId);
    if (userId) {
      formData.append('userId', userId);
    }
    if (groupId) {
      formData.append('groupId', groupId);
    }
    if (departmentId) {
      formData.append('departmentId', departmentId);
      if (applyToSubDeps) {
        formData.append('applyToSubDeps', applyToSubDeps);
      }
    }
    formData.append('isMandatory', isMandatory);
    formData.append('startDate', startDate);
    formData.append('timeSpan', timeSpan);
    if (isRecurring) {
      formData.append('isRecurring', isRecurring);
      formData.append('recurringSpan', recurringSpan);
      formData.append('recurringUnit', recurringUnit);
      if (catchUp) {
        formData.append('catchUp', catchUp);
      }
      if (forceSeries) {
        formData.append('forceSeries', forceSeries);
      }
    }
    if (endDate) {
      formData.append('endDate', endDate);
    }
    return this._http.post(this._globals.APIURL + 'Course/modifyCourseAssignment', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    //console.error(error);
    return observableThrowError(error || 'Server error');
  }
}
