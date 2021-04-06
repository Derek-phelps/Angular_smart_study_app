
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';
import { CourseFeedbackQuestion, CourseFeedbackResponse } from 'src/app/core/models/course-feedback-question';

@Injectable()
export class ChapterService {

    //private _getByCompanyUrl = "Employees/getEmpCourse";
    private _getChapterByEmpUrl = "Chapter/getChapterByEmp";
    private _getCourseByIdUrl = "Employees/getEmpCourseByCourseId";
    private _getSubChapByChapIdUrl = "Chapter/getSubChapterByChapter";
    private _getScormSubChapByChapIdUrl = "Chapter/getScormSubChapterByChapter";
    private _setMarkAttendanceUrl = "Employees/getConfirmChapter";
    private _addUrl = "Chapter/addSubChaptersScorm";
    private _suspendScormUrl = "Chapter/suspendSubChaptersScorm";
    //private _getSuspendedScormSubChapterStatusUrl = "Chapter/getSuspendedScormSubChapterStatus";
    private _getNewsFeedUrl = 'Newswall';
    private _addNewswallUrl = 'Newswall/addNewswall';
    private _getCourseFeedbackListUrl = 'Course/getCourseFeedbackList';
    private _submitCourseFeedbackUrl = 'Course/submitCourseFeedback'
    private _accessControl = 'Course/accessControl';
    constructor(private _http: HttpClient, public globals: Globals) {

    }
    // accessControl(): any {
    //     return this._http.get(this.globals.APIURL + this._accessControl)
    //         .pipe(map((response: Response) => response))
    //         .pipe(catchError(this.handleError))
    // }
    postImage(fileToUpload: File): any {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        return this._http.post(this.globals.APIURL + 'Newswall/uploadImage?companyId=' + this.globals.companyInfo.companyId, formData, { headers: { contentType: 'multipart/form-data' } })
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    onPostMessage(courseId, filePath, newsFeed): any {
        let formData: FormData = new FormData();
        formData.append('feedImg', filePath);
        formData.append('newsfeed', newsFeed);
        formData.append('courseId', courseId);
        formData.append('companyId', "0");

        return this._http.post(this.globals.APIURL + this._addNewswallUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getNewsFeedCourseId(courseId): any {

        let formData: FormData = new FormData();
        formData.append('courseId', courseId);
        return this._http.post(this.globals.APIURL + this._getNewsFeedUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    setMarkAttendance(obj, emp_courseId, subChapterId): any {
        // console.log(obj);
        var request = {
            "empSubChapId": obj,
            "emp_courseId": emp_courseId,
            "SubChapId": subChapterId
        };
        return this._http.post(this.globals.APIURL + this._setMarkAttendanceUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getChapterListByCourse(empCourseId): any {

        var request = {
            "empCourseId": empCourseId
        };
        return this._http.post(this.globals.APIURL + this._getChapterByEmpUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCourseById(Id, state): any {
        var request = {
            "Course": Id,
            "state": state ? 1 : 0
        };
        return this._http.post(this.globals.APIURL + this._getCourseByIdUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getSubChapterByChapId(chapterId, empCourseId): any {
        var request = {
            "ChapterId": chapterId,
            "empCourseId": empCourseId
        };
        return this._http.post(this.globals.APIURL + this._getSubChapByChapIdUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getScormSubChapterByChapId(chapterId): any {
        var request = {
            "ChapterId": chapterId
        };
        return this._http.post(this.globals.APIURL + this._getScormSubChapByChapIdUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    addScormSubChaptersToCourse(form: any): any {
        let formData: FormData = new FormData();
        formData.append('chapter', form.chapter);
        formData.append('numSubChapters', form.numSubChapters);
        //formData.append('createdBy', 0 + "");
        return this._http.post(this.globals.APIURL + this._addUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    suspendScormSubChapterStatusToCourse(form: any): any {
        let formData: FormData = new FormData();
        formData.append('empId', form.empId);
        formData.append('courseId', form.courseId);
        formData.append('chapter', form.chapter);
        formData.append('subChapterList', form.subChapterList);
        return this._http.post(this.globals.APIURL + this._suspendScormUrl, formData)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getCourseFeedbackQuestions(courseId: string) {
        return this._http.post<CourseFeedbackQuestion[]>(this.globals.APIURL + this._getCourseFeedbackListUrl, { courseId })
            .pipe(catchError(this.handleError)).toPromise();
    }
    setCourseFeedbackResponses(courseId: string, responses: CourseFeedbackResponse[]) {
        return this._http.post<void>(this.globals.APIURL + this._submitCourseFeedbackUrl, { courseId, responses })
            .pipe(catchError(this.handleError)).toPromise();
    }
    // getSuspendedScormSubChapterStatus(form: any, empCourseId): any {
    //     let formData: FormData = new FormData();
    //     formData.append('empId', form.empId);
    //     formData.append('chapter', form.chapter);
    //     formData.append('empCourseId', empCourseId);
    //     return this._http.post(this.globals.APIURL + this._getSuspendedScormSubChapterStatusUrl, formData)
    //         .pipe(map((response: Response) => response))
    //         .pipe(catchError(this.handleError))
    // }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return observableThrowError(error || 'Server error');
    }
}