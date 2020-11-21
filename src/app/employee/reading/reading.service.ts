
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';

@Injectable()
export class ReadingService {


    public _getChapterBySubUrl = "Chapter/getSubChapterAndChapters";
    public _updateCourseIfCompletedUrl = "Course/updateCourseIfCompleted";

    constructor(private _http: HttpClient, public globals: Globals) {

    }
    getChapterBySubChapId(SubChapId, empCourseId): any {
        var request = {
            "SubChapId": SubChapId,
            "empCourseId": empCourseId
        };
        return this._http.post(this.globals.APIURL + this._getChapterBySubUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    updateCourseIfCompleted(courseId, empCourseId): any {
        let formData: FormData = new FormData();
        formData.append('courseId', courseId);
        formData.append('empCourseId', empCourseId);
        return this._http.post(this.globals.APIURL + this._updateCourseIfCompletedUrl, formData)
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