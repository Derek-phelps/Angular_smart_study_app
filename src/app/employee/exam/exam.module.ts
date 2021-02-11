import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Exam } from './exam.component';
import { routing } from './exam.routing';
import { ExamService } from './exam.service';
import { LayoutModule } from '../../theme/layout.module';
import { SharedModule } from '../../theme/shared.module';

import { AppMaterialModule } from '../../app-material/app-material.module';

@NgModule({
  imports: [
    CommonModule, LayoutModule, SharedModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    AppMaterialModule
  ],
  declarations: [
    Exam
  ],
  providers: [
    ExamService
  ]
})
export class ExamModule { }



