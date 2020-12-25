import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafeHtmlPipe } from 'ngx-spinner/lib/safe-html.pipe';

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
    this._imageURL = value;
  }

  @Output('imageChanged') imageChangedEvent : EventEmitter<ImageChangedEvent> = new EventEmitter<ImageChangedEvent>();

  private _imageURL : string = "/assets/img/bulb_small.png";
  
  @ViewChild('upload') _uploadButton : ElementRef;
  
  constructor(
    private sanizitzer : DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  changeImage() {
    // let element : HTMLElement = document.getElementById('upload') as HTMLElement;
    // element.click();
    this._uploadButton.nativeElement.click();
  }

  onChange(event : any) {
    if(event.target.files.length == 0) { return; }

    let image : Blob = event.target.files[0] as Blob
    this._imageURL = URL.createObjectURL(image);

    this.imageChangedEvent.emit({ 'safeUrl' : this.imageUrl, 'data' : image });
  }

  bypass(url : string) : SafeHtml {
    return this.sanizitzer.bypassSecurityTrustUrl(url);
  }

  get imageUrl() : SafeHtml { return this.bypass(this._imageURL); }

}
