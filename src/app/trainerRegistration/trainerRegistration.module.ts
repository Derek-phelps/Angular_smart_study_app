import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';

import { LayoutModule } from '../theme/layout.module';
import { SharedModule } from '../theme/shared.module';


import { AppTranslationModule } from '../app.translation.module';
import { routing } from './trainerRegistration.routing';

import { TrainerRegistrationComponent } from './trainerRegistration.component';
import { TrainerRegistrationService } from './trainerRegistration.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  imports: [
    CommonModule, LayoutModule, SharedModule, AppTranslationModule, routing, MatCheckboxModule,
    MatListModule, MatDialogModule, MatCardModule, MatFormFieldModule, MatInputModule, MatGridListModule,
    FormsModule, ReactiveFormsModule, MatSortModule, MatTableModule, MatPaginatorModule
  ],
  declarations: [TrainerRegistrationComponent],
  providers: [
    TrainerRegistrationService
  ]
})
export class TrainerRegistrationModule { }
