
import {throwError as observableThrowError,  Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import {  HttpClient,HttpHeaders } from "@angular/common/http";
import { map,catchError, tap } from 'rxjs/operators';
import { Globals} from '../common/auth-guard.service';

export interface SubChapterResponse {
  id : number,
  title : string,
  chapterId : number,
  index : number,
  text : string,
  filePath : string,
  isDownloadable : boolean
}

export interface ChapterResponse {
  id : number,
  title : string,
  courseId : number,
  courseName : string,
  ignoreOrder : boolean,
  index : number,
  subChapters : SubChapterResponse[]
}

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

  getChapterById( chapterId : number ) : any {
      let formData:FormData = new FormData();
      formData.append('chapterId', chapterId + '');

    return this._http.post(this._getChapterById,formData)
    .pipe(
      map((response: Response) => response),
      tap( res => console.log(res)),
      ).pipe(catchError(this.handleError))
  }

  getChapterByIdFixed( chapterId : number ) : Observable<ChapterResponse> {
    let formData:FormData = new FormData();
    formData.append('chapterId', chapterId + '');

    return this._http.post(this._getChapterById,formData)
    .pipe(
      tap(response => console.log(response)),
      map(response  => this._parseChapter(response as Response)),
      tap(res => console.log(res)),
      ).pipe(catchError(this.handleError))
  }

  addFixed(chapter : ChapterResponse): Observable<any> {  
    return this._http.post(this._addUrl, this._unparseChapter(chapter))
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError));
  }

  editFixed(chapter : ChapterResponse): Observable<any>  {
    // var formData = this._unparseChapter(chapter);
    // for(var key of formData.entries())
    // {
    //   console.log(key[0] + ' : ' + key[1]);
    // }
    
    //return of(1);
    return this._http.post(this._editUrl, this._unparseChapter(chapter))
    .pipe(map((response: Response) => response))
    .pipe(catchError(this.handleError));
  }

  private _parseChapter( response : Response ) : ChapterResponse {
    let data : Object = response['data'][0];
    let chapterResponse : ChapterResponse = {
      id : data['chapterId'],
      title : data['chapterName'],
      courseId : data['courseId'],
      courseName : data['courseName'],
      index : data['Ch_index'],
      ignoreOrder : data['ignore_ordering'],
      subChapters : []
    }

    data['SubChapter'].forEach( subChap => {
      chapterResponse.subChapters.push( {
        id : subChap['subChapterId'],
        title : subChap['subChapterTitle'],
        chapterId : subChap['ChapterId'],
        filePath : subChap['FilePath'],
        index : subChap['Sc_index'],
        text : subChap['chapterTxt'],
        isDownloadable : subChap['isDownloadable']
      })
    });
    return chapterResponse;
  }

  private _unparseChapter( chapter : any ) : FormData {
    
    let formData : FormData = new FormData();
    formData.append('Ch_index', ''+chapter.index);
    formData.append('chapterId', ''+chapter.id);
    formData.append('ChapterName', chapter.title);
    formData.append('course', ''+chapter.courseId);
    formData.append('ignore_ordering', ''+chapter.ignoreOrder);
    formData.append('isOffline', '0');
    formData.append('createdBy', ''+this._globals.companyInfo.companyId);

    let subChapters : Object[] = []
    chapter.subChapters.forEach( sc => {
      let subChapter : Object = {
        ChapterId : sc.chapterId+'',
        FilePath : sc.filePath+'',
        IsVideo: '3',
        Sc_index : sc.index+'',
        ChapterTxt : sc.text,
        isDownloadable : sc.isDownloadable,
        subChapterId : sc.id,
        subChapterTitle : sc.title,
        // trainerId : '0',
        // trainingConfirmdEndTime : '',
        // trainingConfirmdStartTime : '',
        // trainingDate : '',
        // trainingEndTime : '',
        // trainingPlace : '',
        // trainingstartTime : '',
      }
      subChapters.push(subChapter);
    });

    console.log(JSON.stringify(subChapters));
    formData.append('SubChapter', JSON.stringify(subChapters));
    return formData;
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
    deleteSubchapter(id : number ) : Observable<any>{
        let formData:FormData = new FormData();
        formData.append('subChapterId', id+'');
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
            formData.append('ChapterName', form.chapterName);
            formData.append('course', form.courseId);
            formData.append('isOffline', form.isOffline ? '1' : '0');
            formData.append('SubChapter', JSON.stringify(form.subChapter) );
            formData.append('SubModel', JSON.stringify(form.SubModel) );
            formData.append('createdBy', this._globals.companyInfo.companyId+"" );
        return this._http.post(this._addUrl,formData)
        .pipe(map((response: Response) => response))
        .pipe(catchError(this.handleError))
    }
    edit(form:any): Observable<any>  {
        let formData:FormData = new FormData();
        formData.append('ChapterName', form.chapterName);
        formData.append('course', form.courseId);
        formData.append('chapterId', form.chapterId);
        formData.append('isOffline', form.isOffline ? '1' : '0');
        formData.append('SubChapter', JSON.stringify(form.subChapters) );
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
