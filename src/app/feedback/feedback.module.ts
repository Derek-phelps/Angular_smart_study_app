import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { FeedbackService } from './feedback.service';

import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '../theme/layout.module';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule, FormsModule, MatListModule, MatDialogModule, LayoutModule,
    MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    AppTranslationModule, MatSortModule, MatTableModule, MatPaginatorModule
  ],
  declarations: [FeedbackComponent],
  providers: [
    FeedbackService
  ]
})
export class FeedbackModule { }
