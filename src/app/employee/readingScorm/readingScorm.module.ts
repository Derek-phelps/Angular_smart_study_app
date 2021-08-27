import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReadingScorm } from './readingScorm.component';
import { routing } from './readingScorm.routing';
import { ReadingScormService } from './readingScorm.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LayoutModule } from '../../theme/layout.module';
import { SharedModule } from '../../theme/shared.module';

// import { VgCoreModule } from 'videogular2/core';
// import { VgControlsModule } from 'videogular2/controls';
// import { VgOverlayPlayModule } from 'videogular2/overlay-play';
// import { VgBufferingModule } from 'videogular2/buffering';
import { SafePipe } from './readingScorm.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule, LayoutModule, SharedModule, AppTranslationModule, ReactiveFormsModule, FormsModule,
    routing, PdfViewerModule, //VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule,
    MatTooltipModule
  ],
  declarations: [
    ReadingScorm, SafePipe
  ],
  providers: [
    ReadingScormService
  ]
})
export class ReadingScormModule { }