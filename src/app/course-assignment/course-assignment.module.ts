import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppTranslationModule } from '../app.translation.module';

// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material';
// import { MatFormFieldModule, MatInputModule } from '@angular/material';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatTooltipModule } from '@angular/material/tooltip';

import { AppMaterialModule } from '../app-material/app-material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CourseAssignmentComponent } from './course-assignment.component';


@NgModule({
  declarations: [CourseAssignmentComponent],
  imports: [
    CommonModule,
    AppTranslationModule,
    // MatRadioModule,
    // MatSelectModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatCheckboxModule,
    // MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule
  ]
})
export class CourseAssignmentModule { }
