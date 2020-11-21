import { Injectable } from '@angular/core';

import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class MyCoursesService {

  constructor(private _http: HttpClient, public _globals: Globals) { }

  getMyCourseAssignments(): any {
    let formData: FormData = new FormData();
    formData.append('internet-explorer-fix', '');
    return this._http.post(this._globals.APIURL + 'Course/getMyCourses', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  getMyCertificates(empId = undefined, adminReq = false): any {
    let formData: FormData = new FormData();
    if (empId && adminReq) {
      formData.append('empId', empId);
      formData.append('userId', 'true');
    } else {
      formData.append('internet-explorer-fix', '');
    }
    return this._http.post(this._globals.APIURL + 'Course/getMyCertificates', formData)
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
