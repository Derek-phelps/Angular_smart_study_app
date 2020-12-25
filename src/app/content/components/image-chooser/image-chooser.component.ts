import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SafeHtmlPipe } from 'ngx-spinner/lib/safe-html.pipe';
import { Globals } from 'src/app/common/auth-guard.service';

export interface ImageChangedEvent {
  safeUrl : SafeHtml, 
  data : Blob
}

@Component({
  selector: 'image-chooser',
  templateUrl: './image-chooser.component.html',
  styleUrls: ['./image-chooser.component.scss']
})
export class ImageChooserComponent implements OnInit {

  @Input('imageUrl')
  set(value : string )
  {
    this._imageUrl = value;
  }

  @Output('imageChanged') imageChangedEvent : EventEmitter<ImageChangedEvent> = new EventEmitter<ImageChangedEvent>();

  private _imageUrl : string = "/assets/img/bulb_small.png";
  private _originalImageUrl : string = null;
  
  @ViewChild('upload') _uploadButton : ElementRef;
  
  constructor(
    private sanizitzer : DomSanitizer,
    private translate: TranslateService,
    private globals: Globals
  ) {
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;
   }

  ngOnInit(): void {
  }

  changeImage() {
    this._uploadButton.nativeElement.click();
  }

  onChange(event : any) {
    if(event.target.files.length == 0) { return; }

    let image : Blob = event.target.files[0] as Blob
    
    if(this._originalImageUrl == null) { this._originalImageUrl = this._imageUrl; }
    this._imageUrl = URL.createObjectURL(image);

    this.imageChangedEvent.emit({ 'safeUrl' : this.imageUrl, 'data' : image });
  }

  clearImage() {
    this._imageUrl = this._originalImageUrl;
    this._originalImageUrl = null;
    this.imageChangedEvent.emit({ 'safeUrl' : null, 'data' : null });
  }

  private _bypass(url : string) : SafeHtml {
    return this.sanizitzer.bypassSecurityTrustUrl(url);
  }


  get imageUrl() : SafeHtml { return this._bypass(this._imageUrl); }
  get hasChanges() : boolean { return this._originalImageUrl != null; }

}
