import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './question.routing';
import { QuestionComponent } from './question.component';

import { QuestionService } from './question.service';
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
import { QuestionEdit } from './components/edit/questionEdit.component';
import { QuestionAdd } from './components/add/questionAdd.component';


@NgModule({
  imports: [
    CommonModule, routing, AppTranslationModule, MatCardModule, MatFormFieldModule, MatInputModule, MatListModule, MatDialogModule,
    LayoutModule, MatTableModule, MatSortModule, MatPaginatorModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [QuestionComponent, QuestionAdd, QuestionEdit],
  providers: [
    QuestionService
  ]
})
export class QuestionModule { }
