import { Injectable } from '@angular/core';

import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable({
  providedIn: 'root'  // <--provides this service in the root ModuleInjector
})
export class GroupsService {

  constructor(private _http: HttpClient, public _globals: Globals) { }

  add(form): any {
    // let formData: FormData = new FormData();
    // formData.append('positionName', form.PositionName);
    // return this._http.post(this._saveUrl, formData)
    //   .pipe(map((response: Response) => response))
    //   .pipe(catchError(this.handleError))
  }

  addGroup(group): any {
    let formData: FormData = new FormData();
    formData.append('name', group.name);
    formData.append('color', group.color);
    return this._http.post(this._globals.APIURL + 'Groups/addGroup', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  updateGroup(group): any {
    let formData: FormData = new FormData();
    formData.append('groupId', group.id);
    formData.append('name', group.name);
    formData.append('color', group.color);
    return this._http.post(this._globals.APIURL + 'Groups/updateGroup', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  deleteUserFromGroup(userId, groupId): any {
    let formData: FormData = new FormData();
    formData.append('userId', userId);
    formData.append('groupId', groupId);
    return this._http.post(this._globals.APIURL + 'Groups/deleteUserFromGroup', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  deleteUserGroup(groupId): any {
    let formData: FormData = new FormData();
    formData.append('groupId', groupId);
    return this._http.post(this._globals.APIURL + 'Groups/deleteGroup', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  addUserToGroup(userId, groupId): any {
    let formData: FormData = new FormData();
    formData.append('userId', userId);
    formData.append('groupId', groupId);
    return this._http.post(this._globals.APIURL + 'Groups/addUserToGroup', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  getGroup(groupId, departmentId, fullInfo = false): any {
    let formData: FormData = new FormData();
    if (groupId) {
      formData.append('groupId', groupId);
    }
    if (departmentId) {
      formData.append('departmentId', departmentId);
    }
    if (fullInfo) {
      formData.append('fullInfo', 'true');
    }
    formData.append('internet-explorer-fix', '');
    return this._http.post(this._globals.APIURL + 'Groups/getGroup', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  updateGroupMember(groupId, memberList): any {
    let formData: FormData = new FormData();
    formData.append('groupId', groupId);
    formData.append('memberList', JSON.stringify(memberList));
    return this._http.post(this._globals.APIURL + 'Groups/updateGroupMember', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  updateGroupRights(groupId, viewList, adminList): any {
    let formData: FormData = new FormData();
    formData.append('groupId', groupId);
    formData.append('viewList', JSON.stringify(viewList));
    formData.append('adminList', JSON.stringify(adminList));
    return this._http.post(this._globals.APIURL + 'Groups/updateGroupRights', formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  getGroupCategories(): any {
    return this._http.get(this._globals.APIURL + 'Groups/getGroupCategories')
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  getGroups(): any {
    return this._http.get(this._globals.APIURL + 'Groups')
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  getUserList(companyId): any {

    let formData: FormData = new FormData();
    formData.append('companyId', companyId);
    return this._http.post(this._globals.APIURL + 'Employees', formData)
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

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    //console.error(error);
    return observableThrowError(error || 'Server error');
  }
}
