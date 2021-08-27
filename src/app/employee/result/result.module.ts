import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Result } from './result.component';
import { routing }       from './result.routing';
import { ResultService } from './result.service';
import { PdfViewerModule } from 'ng2-pdf-viewer'; 
import { LayoutModule } from '../../theme/layout.module';
import { SharedModule } from '../../theme/shared.module';

@NgModule({
  imports: [
    CommonModule,LayoutModule,SharedModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    PdfViewerModule
  ],
  declarations: [
    Result
  ],
  providers:[
    ResultService
  ]
})
export class ResultModule {}