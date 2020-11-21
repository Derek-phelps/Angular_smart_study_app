
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class LocationService {

  private _addUrl = this._globals.APIURL + 'Location/addLocation';
  private _getByIdUrl = this._globals.APIURL + 'Location/getLocationById';
  private _updateUrl = this._globals.APIURL + 'Location/updateLocationById';
  private _deleteUrl = this._globals.APIURL + 'Location/deleteLocation';
  private _getLocationUrl = this._globals.APIURL + 'Location/Location';
  private _getWGByIdUrl = this._globals.APIURL + 'Location/getLocationWorkGroups';

  constructor(private _http: HttpClient, public _globals: Globals) { }

  add(form, workingGroups): any {
    let formData: FormData = new FormData();
    formData.append('locationName', form.locationName);
    formData.append('workingGroups', JSON.stringify(workingGroups));
    return this._http.post(this._addUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError));
  }
  get(): any {
    return this._http.get(this._getLocationUrl).pipe(map((response: Response) => response)).pipe(catchError(this.handleError));
  }
  edit(form, wgs, delWgs): any {
    let formData: FormData = new FormData();
    formData.append('locationName', form.locationName);
    formData.append('locationId', form.locationId);
    formData.append('wgs', JSON.stringify(wgs));
    formData.append('delWgs', JSON.stringify(delWgs));
    return this._http.post(this._updateUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError));
  }
  getById(id): any {
    let formData: FormData = new FormData();
    formData.append('locationId', id);
    return this._http.post(this._getByIdUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getWorkGroupsById(id): any {
    let formData: FormData = new FormData();
    formData.append('locationId', id);
    return this._http.post(this._getWGByIdUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  delete(locationId): any {
    let formData: FormData = new FormData();
    formData.append('locationId', locationId);
    return this._http.post(this._deleteUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError));
  }
  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return observableThrowError(error.json() || 'Server error');
  }

}
