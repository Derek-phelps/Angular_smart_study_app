import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AdminComponent } from './admin.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MessageComponent } from '../message/message.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyComponent } from './company/company.component';
import { AuthGuardService as AuthGuard } from '../common/auth-guard.service';
import { ProfileComponent } from '../profile/profile.component';
//import { EmployeeCourseComponent } from '../employee/empCourse/empCourse.component';
import { MyCoursesComponent } from '../employee/my-courses/my-courses.component';
import { Chapter } from '../employee/chapter/chapter.component';
import { MyCertificatesComponent } from '../employee/my-certificates/my-certificates.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'employees', loadChildren: './adminEmployee/adminEmployee.module#AdminEmployeeModule' },
      { path: 'department', loadChildren: '../department/department.module#DepartmentModule' },
      { path: 'course', loadChildren: './adminCourse/adminCourse.module#AdminCourseModule' },
      { path: 'content', loadChildren: '../content/content.module#ContentModule' },
      { path: 'test', loadChildren: '../question/question.module#QuestionModule' },
      // { path: 'trainer', loadChildren: './adminTrainer/adminTrainer.module#AdminTrainerModule' },
      { path: 'certificater', loadChildren: '../certificater/adminCertificater.module#AdminCertificaterModule' },
      { path: 'message', component: MessageComponent },
      // { path: 'position', loadChildren: './position/position.module#PositionModule' },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'profile', component: ProfileComponent },
      // { path: 'location', loadChildren: '../location/location.module#LocationModule' },
      { path: 'groups', loadChildren: '../groups/groups.module#GroupsModule' },
      { path: 'mycourses', component: MyCoursesComponent },
      { path: 'mycourses/:id', component: Chapter },
      //{ path: 'couID/:id/mycourses/:chapterId', component: Chapter },
      { path: 'mycertificates', component: MyCertificatesComponent }
    ]
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);