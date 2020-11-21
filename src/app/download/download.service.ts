
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class downloadService {

    private _getByCompanyUrl = "Certificater/getCertificaterByEmpIdAndCerId";
    // public _getByCertifiByresultIdUrl = "Certificater/getCertificaterByCerId";
    private _getCertificateLinkInfoUrl = "Users/getCertificateLinkInfo";
    private _checkPwUrl = "Users/checkPw";
    private _getAllCertiUrl = "Users/getAllCertificates";

    constructor(private _http: HttpClient, public globals: Globals) {
    }
    // getCertificateInfo(courseId, empId = undefined): any {
    //     let formData: FormData = new FormData();
    //     formData.append('courseId', courseId);
    //     if (empId != undefined) {
    //         formData.append('empId', empId);
    //     }
    //     return this._http.post(this.globals.APIURL + this._getByCompanyUrl, formData)
    //         .pipe(map((response: Response) => response))
    //         .pipe(catchError(this.handleError))
    // }
    getCertificateLinkInfo(url, linkId): any {
        let formData: FormData = new FormData();
        formData.append('linkId', linkId);
        return this._http.post(url + this._getCertificateLinkInfoUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    checkPw(pw, linkId): any {
        let formData: FormData = new FormData();
        formData.append('pw', pw);
        formData.append('linkId', linkId);
        return this._http.post(this.globals.APIURL + this._checkPwUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllCertificates(linkId, url): any {
        let formData: FormData = new FormData();
        formData.append('linkId', linkId);
        return this._http.post(url + this._getAllCertiUrl, formData)
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