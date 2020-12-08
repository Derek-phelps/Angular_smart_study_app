
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class CertificaterService {
    private _getAllCertificateUrl = 'Certificater';

    private _addCertificateUrl = 'Certificater/addCertificate';
    private _getByTrainerUrl = 'Course/getCourseByTrainerId';
    private _editCertificateUrl = 'Certificater/editCertificate';
    private _deleteCertificateUrl = 'Certificater/deleteCertificate';
    private _getCertificateByIdUrl = 'Certificater/getCertificateById';
    private _getAdminCertificateByCompanyUrl = 'Certificater/getAdminCertificateByCompany';
    private _courseNotAssineUrl = 'Certificater/getCourseNotAssine';
    private _getAllCourseUrl = 'Course';


    constructor(private _http: HttpClient, public globals: Globals) {

    }
    getCertificateByCompany(): any {
        let formData: FormData = new FormData();
        formData.append('companyId', "true");
        return this._http.post(this.globals.APIURL + this._getAllCertificateUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCertificateByUserId(): any {
        let formData: FormData = new FormData();
        formData.append('userId', "true");
        return this._http.post(this.globals.APIURL + this._getAllCertificateUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAdminCertificateByCompany(): any {
        let formData: FormData = new FormData();
        formData.append('CompanyId', this.globals.companyInfo.companyId + "");
        return this._http.post(this.globals.APIURL + this._getAdminCertificateByCompanyUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllCertificate(): any {
        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this.globals.APIURL + this._getAllCertificateUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCourseNotAssine(): any {
        let formData: FormData = new FormData();
        formData.append('companyId', this.globals.companyInfo.companyId + "");
        return this._http.post(this.globals.APIURL + this._courseNotAssineUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    addCertificate(form: any, fixed: any): any {
        let formData: FormData = new FormData();
        formData.append('CertificateName', form.CertificateName);
        formData.append('CertificateTitle', form.CertificateTitle);
        formData.append('Course', form.Course);
        formData.append('CertificateDes', form.CertificateDes);
        formData.append('Trainer', form.Trainer);

        this._appendImageUrl(formData, 'CertificateSignature', 'API/img/Certificate/', form.CertificateSignature);
        this._appendImageUrl(formData, 'CertificateBg', 'API/img/Certificate/Bg/', form.CertificateBg);
        this._appendImageUrl(formData, 'CertificateLogo', 'API/img/Certificate/banner/', form.CertificateLogo);

        formData.append('courseplease', form.courseplease);
        formData.append('bossTitleName', form.bossTitleName);
        formData.append('bossPosition', form.bossPosition);
        if (form.heldBy && form.heldBy != "") {
            formData.append('heldBy', form.heldBy);
        }
        if (fixed) {
            formData.append('fixedDate', fixed);
        }
        return this._http.post(this.globals.APIURL + this._addCertificateUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    editCertificate(form: any, fixed: any): any {
        let formData: FormData = new FormData();

        formData.append('CertificateName', form.CertificateName);
        formData.append('CertificateTitle', form.CertificateTitle);
        formData.append('Course', form.Course);
        formData.append('CertificateDes', form.CertificateDes);
        formData.append('Trainer', form.Trainer);

        this._appendImageUrl(formData, 'CertificateSignature', 'API/img/Certificate/', form.CertificateSignature);
        this._appendImageUrl(formData, 'CertificateBg', 'API/img/Certificate/Bg/', form.CertificateBg);
        this._appendImageUrl(formData, 'CertificateLogo', 'API/img/Certificate/banner/', form.CertificateLogo);

        formData.append('certificaterId', form.certificaterId);
        formData.append('courseplease', form.courseplease);
        formData.append('bossTitleName', form.bossTitleName);
        formData.append('bossPosition', form.bossPosition);
        if (form.heldBy && form.heldBy != "") {
            formData.append('heldBy', form.heldBy);
        }
        if (fixed) {
            formData.append('fixedDate', fixed);
        }

        return this._http.post(this.globals.APIURL + this._editCertificateUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    deleteCertificate(certiId): any {
        let formData: FormData = new FormData();
        formData.append('certificaterId', certiId);
        return this._http.post(this.globals.APIURL + this._deleteCertificateUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCertificateById(empId): any {
        let formData: FormData = new FormData();
        formData.append('certificaterId', empId);
        return this._http.post(this.globals.APIURL + this._getCertificateByIdUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCertificateByCource(): any {

        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this.globals.APIURL + this._getAllCertificateUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllCourse(): any {
        let formData: FormData = new FormData();
        formData.append('internet-explorer-fix', '');
        return this._http.post(this.globals.APIURL + this._getAllCourseUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllCourseByCompany(companyId): any {
        let formData: FormData = new FormData();
        formData.append('companyId', companyId);
        return this._http.post(this.globals.APIURL + this._getAllCourseUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getAllCourseByTrainer(): any {
        return this._http.get(this.globals.APIURL + this._getByTrainerUrl)
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
