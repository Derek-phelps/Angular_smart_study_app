import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppTranslationModule } from '../app.translation.module';

import { AppMaterialModule } from '../app-material/app-material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CourseAssignmentComponent } from './course-assignment.component';


@NgModule({
  declarations: [CourseAssignmentComponent],
  imports: [
    CommonModule,
    AppTranslationModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule
  ]
})
export class CourseAssignmentModule { }
