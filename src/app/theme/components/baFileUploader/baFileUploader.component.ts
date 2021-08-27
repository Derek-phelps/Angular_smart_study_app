import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'ba-file-uploader',
  styleUrls: ['./baFileUploader.scss'],
  templateUrl: './baFileUploader.html',
})
export class BaFileUploader {
  @Input() defaultPicture: string = '';
  @Input() picture: string = '';
  @Input() fileTitle: string = '';

  @Input() FileuploadInput: UploadInput = {
    type: 'uploadAll',
    url: '',
    method: 'POST',
    data: {}
  };
  @Input() canDelete: boolean = true;

  //@Input() allowedFileTypes:Array<string> = undefined;
  @Input() isAudioOrVideo = false;
  @Input() isPdf = false;

  @Input() translate = undefined;

  @Output() onUpload = new EventEmitter<any>();
  @Output() onUploadCompleted = new EventEmitter<any>();

  @ViewChild('fileUpload', {static: true}) public _fileUpload: ElementRef;



  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;

  options: UploaderOptions;

  public uploadInProgress: boolean = false;
  public uploadProgress = 0;


  constructor(private renderer: Renderer2, private http: HttpClient) {
    this.options = { concurrency: 1, maxUploads: 1 };

    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  beforeUpload(fi): void {
    if (fi.length) {
      if (!this.isAudioOrVideo && !this.isPdf) {
        //this._changePicture(fi[0]);
        this.uploadInProgress = true;
        this.onUpload.emit();
        this.uploadAndProgress(fi);
      } else if (this.isAudioOrVideo) {
        if (fi[0].type.startsWith('video/') || fi[0].type.startsWith('audio/')) {
          this.uploadInProgress = true;
          this.onUpload.emit();
          this.uploadAndProgress(fi);
        } else {
          this.translate.get('alert.FileTypeInvalid').subscribe(value => { alert(value); });
        }
      } else if (this.isPdf) {
        if (fi[0].type == 'application/pdf') {
          this.uploadInProgress = true;
          this.onUpload.emit();
          this.uploadAndProgress(fi);
        } else {
          this.translate.get('alert.FileTypeInvalid').subscribe(value => { alert(value); });
        }
      }
    }
    /*let files = this._fileUpload.nativeElement.files;

    if (files.length) {
      const file = files[0];
      this._changePicture(file);
      if (!this._canUploadOnServer()) {
        uploadingFile.setAbort();
      } else {
        this.uploadInProgress = true;
      }
    }*/
  }
  doUpload(fi) {

  }
  uploadAndProgress(files: File[]) {
    // console.log(files)
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))

    this.http.post(this.FileuploadInput.url, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(event.loaded / event.total * 100);
        } else if (event instanceof HttpResponse) {
          this.uploadInProgress = false;
          // console.log(event.body);
          this._onUploadCompleted(event.body);
          this.uploadProgress = 0;
        }
      });
  }
  bringFileSelector(): boolean {
    this._fileUpload.nativeElement.click();
    return false;
  }

  removePicture(): boolean {
    this.picture = '';
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
    // console.log("OK");
    this.uploadInProgress = false;
    this.fileTitle = data.data;
    this.onUploadCompleted.emit(data);
  }

  _canUploadOnServer(): boolean {
    // console.log(this.FileuploadInput);
    return !!this.FileuploadInput['url'];
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      this.uploadInput.emit(this.FileuploadInput);
      this.onUpload.emit(this.FileuploadInput);
    } else if (output.type === 'done') {
      this._onUploadCompleted(output.file.response);
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    }
  }
}
