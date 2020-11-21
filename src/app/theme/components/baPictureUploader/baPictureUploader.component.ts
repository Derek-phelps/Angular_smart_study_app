import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from '../../../common/auth-guard.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ba-picture-uploader',
  styleUrls: ['./baPictureUploader.scss'],
  templateUrl: './baPictureUploader.html',
})
export class BaPictureUploader {

  @Input() defaultPicture: string = '';
  @Input() picture: string = '';
  @Input() imageTitle: string = '';
  @Input() FileuploadInput: UploadInput = {
    type: 'uploadFile',
    url: '',
    method: 'POST',
    data: {}
  };
  @Input() canDelete: boolean = true;

  @Output() onUpload = new EventEmitter<any>();
  @Output() onUploadCompleted = new EventEmitter<any>();

  @ViewChild('fileUpload', { static: true }) public _fileUpload: ElementRef;



  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;

  options: UploaderOptions;

  public uploadInProgress: boolean;

  private uploadFile: any = undefined;

  constructor(
    private renderer: Renderer2, 
    private http: HttpClient, 
    private translate: TranslateService, 
    public _globals: Globals,
    private snackbar: MatSnackBar
    ) {
    this.options = { concurrency: 1, maxUploads: 1 };

    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }

    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  beforeUpload(fi: File[]): void {
    if (fi.length) {
      this.uploadFile = fi[0];
      //this._changePicture(fi[0]);
      this.uploadInProgress = true;
      this.uploadAndProgress(fi);
    }
  }

  uploadAndProgress(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))

    this.http.post(this.FileuploadInput.url, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
        } else if (event instanceof HttpResponse) {
          this.uploadInProgress = false;
          this._onUploadCompleted(event.body);
        }
      });
  }
  bringFileSelector(): boolean {
    this._fileUpload.nativeElement.value = '';
    this._fileUpload.nativeElement.click();
    return false;
  }

  removePicture(): boolean {
    this.picture = '';
    this.onUploadCompleted.emit({ UserImg: '', success: true });
    this._fileUpload.nativeElement.value = '';
    return false;
  }

  _changePicture(file: File): void {
    const reader = new FileReader();
    reader.addEventListener('load', (event: Event) => {
      this.picture = (<any>event.target).result;
    }, false);
    reader.readAsDataURL(file);
  }



  _onUploadCompleted(data): void {
    if (data.success) { this._changePicture(this.uploadFile);} 
    else { this.snackbar.open(this.translate.instant('alert.uploadImgFail'), '', { duration: 3000 }); }
    this.uploadFile = undefined;
    this.uploadInProgress = false;
    this.onUploadCompleted.emit(data);
  }

  _canUploadOnServer(): boolean {
    return !!this.FileuploadInput['url'];
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      // this.onUpload.emit(this.FileuploadInput);
      this.uploadInput.emit(this.FileuploadInput);
    } else if (output.type === 'done') {
      this._onUploadCompleted(output.file.response);
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      this.uploadInput.emit(this.FileuploadInput);
    }
  }
}
