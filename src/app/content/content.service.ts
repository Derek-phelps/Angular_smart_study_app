
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError } from 'rxjs/operators';
import { Globals} from '../common/auth-guard.service';

@Injectable()
export class ContentService {
    private _addUrl = this._globals.APIURL+'Chapter/addChapter';
    private _editUrl = this._globals.APIURL+'Chapter/editChapter';
    private _deleteUrl = this._globals.APIURL+'Chapter/deleteChapter';
    private _getDeleteSubChapUrl = this._globals.APIURL+'Chapter/deleteSubChapter';
    private _getChapterUrl = this._globals.APIURL+'Chapter';
    public _videoUpload = this._globals.APIURL+'Chapter/videoUpload';
    public _getAllChapterByUrl = this._globals.APIURL+'Chapter/getAllChapters';
    private _getByCompanyUrl = this._globals.APIURL+'Course';
    private _getChapterById = this._globals.APIURL+'Chapter/getChapterById';

    private _getChaptersByUserUrl = this._globals.APIURL+'Chapter/getChaptersByUser';

    private _getByComapnyUrl = this._globals.APIURL+'Trainers';

    private _getChapterByChapterId = this._globals.APIURL+'Chapter/getOfflineSubChaByChapterId';

    constructor(private _http: HttpClient,public _globals:Globals) { 
           
    }
    getSubChapterByChapter(chapId):any{
      let formData:FormData = new FormData();
        formData.append('ChapterId', chapId);
      return this._http.post(this._getChapterByChapterId,formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
    }
    getAllTrainerByCompany(compId):any{
        let formData:FormData = new FormData();

        formData.append('companyId', compId);
      return this._http.post(this._getByComapnyUrl,formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
    }
    getChapterById(conId):any{
        let formData:FormData = new FormData();

        formData.append('chapterId', conId);
      return this._http.post(this._getChapterById,formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
    }
    getChaptersByUser():any{
        return this._http.get(this._getChaptersByUserUrl)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    getAllChapters():any{
        let formData:FormData = new FormData();
      return this._http.post(this._getAllChapterByUrl,formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
    }
    deleteSubchapter(subChp):any{
        let formData:FormData = new FormData();

        formData.append('subChapterId', subChp.value.subChapterId);
      return this._http.post(this._getDeleteSubChapUrl,formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
    }
    getChapter():any{
        let formData:FormData = new FormData();
        formData.append('companyId', this._globals.companyInfo.companyId+"");
      return this._http.post(this._getChapterUrl,formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
    }
    getAllCourseByCompany(): any  {
       let formData:FormData = new FormData();
        formData.append('companyId', this._globals.companyInfo.companyId+"");
        return this._http.post(this._getByCompanyUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    add(form:any): Observable<any>  {
            let formData:FormData = new FormData();
            formData.append('ChapterName', form.ChapterName);
            formData.append('course', form.course);
            formData.append('isOffline', form.isOffline ? '1' : '0');
            formData.append('SubChapter', JSON.stringify(form.SubChapter) );
            formData.append('SubModel', JSON.stringify(form.SubModel) );
            formData.append('createdBy', this._globals.companyInfo.companyId+"" );
        return this._http.post(this._addUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    edit(form:any): any  {
        let formData:FormData = new FormData();
        formData.append('ChapterName', form.ChapterName);
        formData.append('course', form.course);
        formData.append('chapterId', form.chapterId);
        formData.append('isOffline', form.isOffline ? '1' : '0');
        formData.append('SubChapter', JSON.stringify(form.SubChapter) );
        formData.append('SubModel', JSON.stringify(form.SubModel) );
        formData.append('createdBy', this._globals.companyInfo.companyId+"" );
        return this._http.post(this._editUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    delete(ChapterId): any  {
        let formData:FormData = new FormData();
        formData.append('ChapterId', ChapterId);
         return this._http.post(this._deleteUrl,formData)
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
