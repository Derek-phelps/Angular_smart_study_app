
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';


@Injectable()
export class FinelExamService {


    public getQusByChapIdUrl = "Chapter/getQusBycourseId";
    public SaveQustionResultUrl = "Question/SaveQustionResult";

    constructor(private _http: HttpClient, public globals: Globals) {

    }
    getQusBycourseId(courseId, empCourseId): any {
        var request = {
            "courseId": courseId,
            "empCourseId": empCourseId
        };
        return this._http.post(this.globals.APIURL + this.getQusByChapIdUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    SaveQustionResult(resultDetail, ChapterId, currentChpInfo, result): any {
        var request = {
            "CourseId": ChapterId,
            "ChapterId": 0,
            "resultDetail": JSON.stringify(resultDetail),
            "result": result,
            "emp_chapId": "0",
            "Ch_index": 0,
            "emp_courseId": currentChpInfo.emp_courseId
        };
        return this._http.post(this.globals.APIURL + this.SaveQustionResultUrl, request)
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