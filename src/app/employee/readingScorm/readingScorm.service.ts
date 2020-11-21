
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';

@Injectable()
export class ReadingScormService {


    //public _getChapterBySubUrl = "Chapter/getSubChapterAndChapters";
    private _getChapterByEmpUrl = "Chapter/getChapterByEmp";
    private _getCourseByIdUrl = "Employees/getEmpCourseByCourseId";
    private _getSuspendedScormSubChapterStatusUrl = "Chapter/getSuspendedScormSubChapterStatus";
    //private _getScormSubChapByChapIdUrl = "Chapter/getScormSubChapterByChapter";
    //private _setMarkAttendanceUrl = "Employees/getConfirmChapter";
    private _addUrl = "Chapter/addSubChaptersScorm";
    private _suspendScormUrl = "Chapter/suspendSubChaptersScorm";
    private _ScormChapterInfoUrl = "Chapter/getScormChapterInfo";
    private _SaveScormChapterInfoUrl = "Chapter/saveScormChapterInfo";
    private _accessControl = 'Course/accessControl';

    constructor(private _http: HttpClient, public globals: Globals) {

    }
    accessControl(): any {
        return this._http.get(this.globals.APIURL + this._accessControl)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCourseById(Id): any {
        var request = {
            "Course": Id
        };
        return this._http.post(this.globals.APIURL + this._getCourseByIdUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError));
    }
    // getChapterBySubChapId(SubChapId): any {
    //     var request = {
    //         "SubChapId": SubChapId
    //     };
    //     return this._http.post(this.globals.APIURL + this._getChapterBySubUrl, request)
    //         .pipe(map((response: Response) => response))
    //         .pipe(catchError(this.handleError));
    // }
    getChapterListByCourseWithChapId(chapterId, empcourseId): any {

        var request = {
            "chapterId": chapterId,
            "empCourseId": empcourseId
        };
        return this._http.post(this.globals.APIURL + this._getChapterByEmpUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError));
    }
    getSuspendedScormSubChapterStatus(form: any, empCourseId): any {
        let formData: FormData = new FormData();
        formData.append('empId', form.empId);
        formData.append('chapter', form.chapter);
        formData.append('empCourseId', empCourseId);
        return this._http.post(this.globals.APIURL + this._getSuspendedScormSubChapterStatusUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError));
    }
    // getScormSubChapterByChapId(chapterId, empCourseId): any {
    //     var request = {
    //         "ChapterId": chapterId,
    //         "empCourseId": empCourseId
    //     };
    //     return this._http.post(this.globals.APIURL + this._getScormSubChapByChapIdUrl, request)
    //         .pipe(map((response: Response) => response))
    //         .pipe(catchError(this.handleError));
    // }
    // setMarkAttendance(obj, emp_courseId, subChapterId, EmpId): any {
    //     // console.log(obj);
    //     var request = {
    //         "empSubChapId": obj,
    //         "emp_courseId": emp_courseId,
    //         "SubChapId": subChapterId,
    //         "UserId": EmpId
    //     };
    //     return this._http.post(this.globals.APIURL + this._setMarkAttendanceUrl, request)
    //         .pipe(map((response: Response) => response))
    //         .pipe(catchError(this.handleError));
    // }
    addScormSubChaptersToCourse(form: any): any {
        let formData: FormData = new FormData();
        formData.append('chapter', form.chapter);
        formData.append('numSubChapters', form.numSubChapters);
        //formData.append('createdBy', 0 + "");
        return this._http.post(this.globals.APIURL + this._addUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError));
    }
    suspendScormSubChapterStatusToCourse(form: any, empCourseId): any {
        let formData: FormData = new FormData();
        formData.append('courseId', form.courseId);
        formData.append('chapter', form.chapter);
        formData.append('subChapterList', form.subChapterList);
        formData.append('empCourseId', empCourseId);
        return this._http.post(this.globals.APIURL + this._suspendScormUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError));
    }
    getScormChapterInfo(chapterId, empCourseId): any {
        let formData: FormData = new FormData();
        formData.append('chapterId', chapterId);
        formData.append('empCourseId', empCourseId);
        return this._http.post(this.globals.APIURL + this._ScormChapterInfoUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError));
    }
    saveScormChapterInfo(scormInfo, chapterId, courseId, empCourseId, empScormChapterId): any {
        let formData: FormData = new FormData();
        formData.append('chapterId', chapterId);
        formData.append('scormInfo', scormInfo);
        formData.append('courseId', courseId);
        formData.append('empCourseId', empCourseId);
        formData.append('emp_scormChapterId', empScormChapterId);
        return this._http.post(this.globals.APIURL + this._SaveScormChapterInfoUrl, formData)
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