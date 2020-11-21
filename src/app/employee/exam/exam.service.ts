
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { Globals } from '../../common/auth-guard.service';

@Injectable()
export class ExamService {


    public getQusByChapIdUrl = "Chapter/getQusByChapId";
    public SaveQustionResultUrl = "Question/SaveQustionResult";
    public _updateCourseIfCompletedUrl = "Course/updateCourseIfCompleted";

    constructor(private _http: HttpClient, public globals: Globals) {

    }
    SaveQustionResult(resultDetail, currentChpInfo, result): any {
        // console.log(resultDetail);
        // console.log(currentChpInfo);
        // console.log(result);

        var request = {
            "CourseId": resultDetail[0].CourseId,
            "ChapterId": resultDetail[0].chapterId,
            "resultDetail": JSON.stringify(resultDetail),
            "result": result,
            "emp_chapId": "0",
            "Ch_index": currentChpInfo.Ch_index,
            "emp_courseId": currentChpInfo
        };
        return this._http.post(this.globals.APIURL + this.SaveQustionResultUrl, request)
            .pipe(map((response: Response) => response))
            .pipe(catchError(this.handleError))
    }
    getQusByChapId(chapterId): any {

        var request = {
            "chapterId": chapterId
        };
        return this._http.post(this.globals.APIURL + this.getQusByChapIdUrl, request)
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