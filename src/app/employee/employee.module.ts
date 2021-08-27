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
import { MatIconModule } from '@angular/material/icon';

import { LayoutModule } from '../theme/layout.module';
import { SharedModule } from '../theme/shared.module';

import { AppTranslationModule } from '../app.translation.module';
import { EmployeeRoutingModule } from './employee.routing';

import { EmployeeComponent } from './employee.component';
import { EmpFeedBackService } from './empFeedBack/empFeedBack.service';
import { EmployeeCourseService } from './empCourse/empCourse.service';
import { ChapterService } from './chapter/chapter.service';
//import { DashboardComponent } from './dashboard/dashboard.component';

import { progressService } from './progress/progress.service';
import { EmployeeService } from './employee.service';
import { ProfileModule } from '../profile/profile.module';

import { MessageModule } from '../message/message.module';
import { EmpFeedBackComponent } from './empFeedBack/empFeedBack.component';
import { EmployeeCourseComponent } from './empCourse/empCourse.component';
import { Chapter, SnackBarComponent } from './chapter/chapter.component';
//import { progress } from './progress/progress.component';

import { ResultModule } from './result/result.module';
import { ReadingModule } from './reading/reading.module';
import { ReadingScormModule } from './readingScorm/readingScorm.module';
import { FinelExamModule } from './finelExam/finelExam.module';
import { ExamModule } from './exam/exam.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
//import { OrderByPipe } from '../order-by.pipe';
import { SharedAppModule } from '../shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { MyCertificatesComponent } from './my-certificates/my-certificates.component';
import { AppMaterialModule } from '../app-material/app-material.module';

@NgModule({
  imports: [
    CommonModule, MessageModule, MatCardModule, EmployeeRoutingModule, AppTranslationModule, ResultModule, ReadingModule, ReadingScormModule,
    FinelExamModule, ExamModule, MatTabsModule, MatSelectModule,
    SharedModule, LayoutModule, MatDialogModule, MatListModule, MatPaginatorModule, MatTableModule,
    MatSortModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, ProfileModule, SharedAppModule, MatButtonModule,
    MatButtonToggleModule, MatIconModule, MatTooltipModule, AppMaterialModule
  ],
  exports: [MatSnackBarModule],
  declarations: [EmployeeComponent, /*progress,*/ EmpFeedBackComponent, /*DashboardComponent,*/
    EmployeeCourseComponent, Chapter, SnackBarComponent, MyCoursesComponent, MyCertificatesComponent],
  providers: [
    EmployeeService, EmpFeedBackService, EmployeeCourseService, ChapterService, progressService
  ],
  entryComponents: [SnackBarComponent]
})
export class EmployeeModule { }
