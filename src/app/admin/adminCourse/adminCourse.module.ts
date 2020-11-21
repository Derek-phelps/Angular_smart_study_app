import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './adminCourse.routing';


import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '../../theme/layout.module';

import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';

// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule, MatSliderModule } from '@angular/material';
// import { MatGridListModule } from '@angular/material/grid-list';

import { AdminCourseComponent } from './adminCourse.component';
import { ModifyAdminCourseComponent, BottomSheetModifyCourse, ModifyAdminCourseDatepickerYearComponent/*, ModifyAdminCourseDatepickerMonthComponent*/ } from './components/modify-admin-course/modify-adminCourse.component';
//import { AddAdminCourseComponent } from './components/add-admin-course/add-adminCourse.component';
//import { EditAdminCourseComponent } from './components/edit-admin-course/edit-adminCourse.component';
import { ViewAdminCourseComponent } from './components/view-admin-course/view-adminCourse.component';
import { SignupCourseComponent } from './components/signupCourse/signupCourse.component';

import { AdminCourseService } from './adminCourse.service';
import { NumberDirective } from './components/numbers-only.directive';
import { EditParticipantComponent } from './components/edit-participant/edit-participant.component';
//import { OrderByPipe } from '../../order-by.pipe';
// import { MatSelectModule } from '@angular/material/select';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SubChapterOverviewDialog } from './components/view-admin-course/view-adminCourse.component';
import { QRCodeModule } from 'angularx-qrcode';
// import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedAppModule } from '../../shared.module';
//import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { SafePipe } from './components/view-admin-course/view-adminCourse.component';

import { AppMaterialModule } from '../../app-material/app-material.module';
import { ChartsModule } from 'ng2-charts';
import { ViewAdminCourseOverviewComponent } from './components/view-admin-course/view-admin-course-overview/view-admin-course-overview.component';
import { CourseDataComponent } from './components/view-admin-course/course-data/course-data.component';

@NgModule({
  imports: [
    CommonModule, routing, MatListModule, MatDialogModule, LayoutModule,
    FormsModule, ReactiveFormsModule, AppTranslationModule,
    MatCheckboxModule,
    MatSortModule, MatTableModule, MatPaginatorModule,
    QRCodeModule, SharedAppModule, /*SatDatepickerModule, SatNativeDateModule,*/ AppMaterialModule,
    ChartsModule
  ],
  entryComponents: [BottomSheetModifyCourse, SubChapterOverviewDialog],
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
    ViewAdminCourseOverviewComponent,
    CourseDataComponent,
    ],
  providers: [
    AdminCourseService
  ],

})
export class AdminCourseModule { }
