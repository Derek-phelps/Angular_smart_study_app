import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './download.routing';
import { download } from './download.component';
import { downloadService } from './download.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    NgbRatingModule,
    routing,
    AppTranslationModule,
    MatTooltipModule
  ],
  declarations: [
    download
  ],
  providers: [
    downloadService
  ]
})
export class DownloadModule {
}
