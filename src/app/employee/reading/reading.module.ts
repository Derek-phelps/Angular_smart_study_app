import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Reading } from './reading.component';
import { routing } from './reading.routing';
import { ReadingService } from './reading.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LayoutModule } from '../../theme/layout.module';
import { SharedModule } from '../../theme/shared.module';

import { AppMaterialModule } from '../../app-material/app-material.module';

import { VgCoreModule } from '@videogular/ngx-videogular/core'
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

import { SafePipe } from './reading.component';

import { EditorModule } from 'primeng/editor';

// import {VgCoreModule} from 'videogular2/compiled/core';
// import {VgControlsModule} from 'videogular2/compiled/controls';
// import {VgOverlayPlayModule} from 'videogular2/compiled/overlay-play';
// import {VgBufferingModule} from 'videogular2/compiled/buffering';

@NgModule({
  imports: [
    CommonModule, LayoutModule, SharedModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    PdfViewerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    AppMaterialModule,
    EditorModule
  ],
  declarations: [
    Reading,
    SafePipe
  ],
  providers: [
    ReadingService
  ]
})
export class ReadingModule { }