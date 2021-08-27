
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Injectable()
export class EmployeeCourseService {

  private _getAllByUserUrl = 'Course/getAllCourseByUserId';
  //private _getByDepartmentUrl = 'Course/getCourseByDepartmentId';
  private _getVolByUserUrl = 'Course/getVoluntaryEmpCourses';
  private _assaineCourseUrl = 'Employees/signupEmployeeCourse';
  private _getAssignedCoursesUrl = 'Course/getAssignedCourses';
  private _getAvailableCourseUrl = 'Course/getAvailableCourse';


  constructor(private _http: HttpClient, public globals: Globals) {

  }
  getAssignedCoursesByUser(): any {
    return this._http.get(this.globals.APIURL + this._getAssignedCoursesUrl)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError));
  }
  getAvailableCoursesUser(): any {
    return this._http.get(this.globals.APIURL + this._getAvailableCourseUrl)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError));
  }
  getAllCourseByUser(): any {
    return this._http.get(this.globals.APIURL + this._getAllByUserUrl)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError));
  }

  getAllVolCourseByUser(): any {
    return this._http.get(this.globals.APIURL + this._getVolByUserUrl)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError));
  }
  assignCourse(courseId, signUp): any {
    let formData: FormData = new FormData();
    formData.append('CourseId', courseId + "");
    formData.append('signUp', signUp);
    return this._http.post(this.globals.APIURL + this._assaineCourseUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return observableThrowError(error || 'Server error');
  }
} 
