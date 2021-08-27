import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CourseRoutingModule } from './adminCourse.routing';

import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '../../theme/layout.module';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { AdminCourseComponent } from './adminCourse.component';
import { ModifyAdminCourseComponent, BottomSheetModifyCourse, ModifyAdminCourseDatepickerYearComponent } from './components/modify-admin-course/modify-adminCourse.component';
import { ViewAdminCourseComponent } from './components/view-admin-course/view-adminCourse.component';
import { SignupCourseComponent } from './components/signupCourse/signupCourse.component';

import { AdminCourseService } from './adminCourse.service';
import { NumberDirective } from './components/numbers-only.directive';
import { EditParticipantComponent } from './components/edit-participant/edit-participant.component';
import { SubChapterOverviewDialog } from './components/view-admin-course/view-adminCourse.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedAppModule } from '../../shared.module';
import { SafePipe } from './components/view-admin-course/view-adminCourse.component';

import { AppMaterialModule } from '../../app-material/app-material.module';
import { ChartsModule } from 'ng2-charts';
import { CourseAssignmentModule } from '../../course-assignment/course-assignment.module';

import { CourseOverviewComponent } from './components/view-admin-course/course-overview/course-overview.component';
import { CourseDataComponent } from './components/view-admin-course/course-data/course-data.component';
import { CourseParticipantsComponent } from './components/view-admin-course/course-participants/course-participants.component';
import { CourseChaptersComponent } from './components/view-admin-course/course-chapters/course-chapters.component';
import { CourseCertificateComponent } from './components/view-admin-course/course-certificate/course-certificate.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CourseTestComponent } from './components/view-admin-course/course-test/course-test.component';
import { ContentModule } from 'src/app/content/content.module';
import { CoreModule } from 'src/app/core/core.module';

import { CourseQuestionsComponent } from './components/view-admin-course/course-questions/course-questions.component';
import { QuestionEditorComponent } from './components/view-admin-course/course-questions/question-editor/question-editor.component';

import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ParticipantsExportDialogComponent } from './components/view-admin-course/course-participants/participants-export-dialog/participants-export-dialog.component';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  imports: [
    CommonModule, CoreModule,
    CourseRoutingModule, MatListModule, MatDialogModule, LayoutModule,
    FormsModule, ReactiveFormsModule, AppTranslationModule,
    MatCheckboxModule,
    MatSlideToggleModule, MatSortModule, MatTableModule, MatPaginatorModule,
    QRCodeModule, SharedAppModule, /*SatDatepickerModule, SatNativeDateModule,*/ AppMaterialModule,
    ChartsModule, CourseAssignmentModule,
    DragDropModule,
    ContentModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    AccordionModule,
    DynamicDialogModule,
    MatRadioModule
  ],
  entryComponents: [BottomSheetModifyCourse, SubChapterOverviewDialog, ParticipantsExportDialogComponent],
  declarations: [
    AdminCourseComponent,
    ModifyAdminCourseComponent,
    NumberDirective,
    ViewAdminCourseComponent,
    SignupCourseComponent,
    EditParticipantComponent,
    BottomSheetModifyCourse,
    SubChapterOverviewDialog,
    ModifyAdminCourseDatepickerYearComponent,
    SafePipe,
    CourseOverviewComponent,
    CourseDataComponent,
    CourseParticipantsComponent,
    CourseChaptersComponent,
    CourseTestComponent,
    CourseCertificateComponent,
    CourseQuestionsComponent,
    QuestionEditorComponent,
    ParticipantsExportDialogComponent
  ],
  providers: [
    AdminCourseService,
    DatePipe
  ],

})
export class AdminCourseModule { }
