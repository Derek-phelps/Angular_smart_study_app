
import { throwError as observableThrowError, Observable, from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError, switchMap, tap, toArray, mergeMap } from 'rxjs/operators';
import { Globals } from '../common/auth-guard.service';

@Injectable()
export class QuestionService {

  private _getQuestionByUrl = this._globals.APIURL + 'Question';
  private _getByCompanyUrl = this._globals.APIURL + 'Question';
  private _getByQuestionIdUrl = this._globals.APIURL + 'Question/getQuestionById';
  private _getByCourseUrl = this._globals.APIURL + 'Course';
  private _getByChapterByCouseUrl = this._globals.APIURL + 'Chapter/getChapterByCourceId';
  private _deleteQustionUrl = this._globals.APIURL + 'Question/deleteQuestion';
  private _addQustionUrl = this._globals.APIURL + 'Question/saveQuestion';
  private _editQuestionUrl = this._globals.APIURL + 'Question/UpdateQuestion';

  public excelFileUpload = this._globals.APIURL + 'Question/uploadQuestionExcel';
  public imageFileUpload = this._globals.APIURL + 'Question/uploadQuestionImage';
  constructor(private _http: HttpClient, public _globals: Globals) {

  }
  postFile(fileToUpload: File): any {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this._http
      .post(this._globals.APIURL + 'Question/uploadQustionExcel?companyId=' + this._globals.companyInfo.companyId, formData, { headers: { contentType: 'multipart/form-data' } })
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getByQuestionById(QusId): any {
    let formData: FormData = new FormData();
    formData.append('QuestionId', QusId);
    return this._http.post(this._getByQuestionIdUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  getCourse(companyId): any {
    let formData: FormData = new FormData();
    formData.append('companyId', companyId);
    return this._http.post(this._getByCourseUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  postImage(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this._http
      .post(this._globals.APIURL + 'Question/uploadQuestionImage?companyId=' + this._globals.companyInfo.companyId, formData, { headers: { contentType: 'multipart/form-data' } })
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  getAllQuestions(courseId : number): Observable<any> {
    let formData: FormData = new FormData();
    let questions : Array<any> = [];
    formData.append('companyId', ''+this._globals.companyInfo.companyId);
    formData.append('courseId', ''+courseId);
    return this._http.post(this._getQuestionByUrl, formData).pipe(
      switchMap(result => from(result['data'])),
      mergeMap(data => this.getByQuestionById(data['questionId'])),
      map(result => result['data'][0]),
      tap(data => {
        //console.log(data);
        let answers : Array<any> = []
        data['QuestionOption'].forEach(q => {
          answers.push({
            'id' : q['QuestionOptionId'],
            'index' : q['QuestionOptionIndex'],
            'text' : q['QuestionOptionName'],
            'imagePath' : q['optionImg'],
            'isCorrect' : data['CorrectAnswerOptionNumber'].split('@').find(o => o == q['QuestionOptionIndex']) != undefined,
          });
        });

        questions.push({
          'id' : data['questionId'],
          'text' : data['Question'],
          'chapterId' : data['chapterId'],
          'courseId' : data['CourseId'],
          'imagePath' : data['QuestionImg'],
          'explanation' : data['Explanation'],
          'index' : data['Q_index'],
          'answers' : answers
        });
      }),
      toArray(),
      switchMap( _ => of(questions)),
    ).pipe(catchError(this.handleError))
  }

  // getData(companyId): any {
  //   let formData: FormData = new FormData();
  //   formData.append('companyId', companyId);
  //   return this._http.post(this._getByCompanyUrl, formData)
  //     .pipe(map((response: Response) => response))
  //     .pipe(catchError(this.handleError))
  // }

  // getChaptersBYCourseId(CourceId): any {
  //   let formData: FormData = new FormData();
  //   formData.append('CourceId', CourceId);
  //   return this._http.post(this._getByChapterByCouseUrl, formData)
  //     .pipe(map((response: Response) => response))
  //     .pipe(catchError(this.handleError))
  // }

  // add(formField: any): any {

  //   let formData: FormData = new FormData();
  //   formData.append('CourceId', formField.CourceId);
  //   formData.append('ChapterId', formField.ChapterId);
  //   formData.append('qustionText', formField.qustionText);
  //   this._appendImageUrl(formData, 'qustionImg', 'API/img/Question/', formField.qustionImg);
  //   formData.append('Explanation', formField.Explanation);
  //   formData.append('companyId', this._globals.companyInfo.companyId + "");
  //   formData.append('IsTraning', formField.IsTraning);
  //   formData.append('answers', JSON.stringify(formField.answers));
  //   formData.append('createdBy', this._globals.companyInfo.companyId + "");
  //   return this._http.post(this._addQustionUrl, formData)
  //     .pipe(map((response: Response) => response))
  //     .pipe(catchError(this.handleError))
  // }

  addChapterQuestion(question : any): Observable<any> {

    let formData: FormData = new FormData();

    let correctAnswers : Array<number> = []
    formData.append('CourceId', question['courseId']);
    formData.append('ChapterId', question['chapterId']);
    formData.append('qustionText', question['text']);
    formData.append('qustionImg', question['imagePath']);
    //this._appendImageUrl(formData, 'qustionImg', 'API/img/Question/', formField.qustionImg);
    formData.append('Explanation', question['explanation']);
    formData.append('companyId', this._globals.companyInfo.companyId + "");
    formData.append('createdBy', this._globals.companyInfo.companyId + "");
    let answers : Array<any> = [];
    question['answers'].forEach( a => {
      answers.push({
        'ans' : a['text'],
        'CurAns' : ''+a['isCorrect'],
        'QuestionOptionID' : a['id'],
        'QuestionOptionIndex' : a['index'],
      })

      if(a['isCorrect']) { correctAnswers.push(a['isCorrect']); }
    })
    formData.append('answers', JSON.stringify(answers));
    formData.append('CorrectAnswerOptionNumber', correctAnswers.join('@'));
    
    return this._http.post(this._addQustionUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  editChapterQuestion(question : any): Observable<any> {

    let formData: FormData = new FormData();

    formData.append('CourceId', question['courseId']);
    formData.append('ChapterId', question['chapterId']);
    formData.append('qustionText', question['text']);
    formData.append('qustionImg', question['imagePath']);
    //this._appendImageUrl(formData, 'qustionImg', 'API/img/Question/', formField.qustionImg);
    formData.append('Explanation', question['explanation']);
    formData.append('companyId', this._globals.companyInfo.companyId + "");
    formData.append('createdBy', this._globals.companyInfo.companyId + "");
    let answers : Array<any> = [];
    question['answers'].forEach( a => {
      answers.push({
        'ans' : a['text'],
        'CurAns' : ''+a['isCorrect'],
        'QuestionOptionID' : a['id'],
      })
    })
    formData.append('answers', JSON.stringify(answers));
    
    return this._http.post(this._editQuestionUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }

  edit(formField: any, deleteOptions: any): any {

    let formData: FormData = new FormData();
    formData.append('CourceId', formField.CourceId);
    formData.append('ChapterId', formField.ChapterId);
    formData.append('qustionText', formField.qustionText);
    this._appendImageUrl(formData, 'qustionImg', 'API/img/Question/', formField.qustionImg);
    formData.append('Explanation', formField.Explanation);
    formData.append('questionId', formField.questionId);
    formData.append('answers', JSON.stringify(formField.answers));
    formData.append('createdBy', this._globals.companyInfo.companyId + "");
    formData.append('deleteOptions', JSON.stringify(deleteOptions));
    return this._http.post(this._editQuestionUrl, formData)
      .pipe(map((response: Response) => response))
      .pipe(catchError(this.handleError))
  }
  delete(qustionId): any {
    let formData: FormData = new FormData();
    formData.append('QustionId', qustionId);
    return this._http.post(this._deleteQustionUrl, formData)
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
    return observableThrowError(error.json() || 'Server error');
  }
}