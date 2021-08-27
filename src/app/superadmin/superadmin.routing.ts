import { Routes, RouterModule } from '@angular/router';
import { SuperadminComponent } from './superadmin.component';
import { ModuleWithProviders } from '@angular/core';

import { FeedbackComponent } from '../feedback/feedback.component';
import { MessageComponent } from '../message/message.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from '../profile/profile.component';
import { AuthGuardService as AuthGuard } from '../common/auth-guard.service';
import { RegistrationsComponent } from './registrations/registrations.component';
export const routes: Routes = [
  {
    path: 'superadmin',
    component: SuperadminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'course', loadChildren: '../admin/adminCourse/adminCourse.module#AdminCourseModule' },
      { path: 'content', loadChildren: '../content/content.module#ContentModule' },
      { path: 'test', loadChildren: '../question/question.module#QuestionModule' },
      { path: 'certificater', loadChildren: '../certificater/adminCertificater.module#AdminCertificaterModule' },
      { path: 'registrations', component: RegistrationsComponent },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: 'dashboard', component: DashboardComponent },
      // { path: 'company', loadChildren: './company/company.module#CompanyModule' },
      // { path: 'employees', loadChildren: '../employees/employees.module#EmployeesModule' },
      // { path: 'department', loadChildren: '../department/department.module#DepartmentModule' },
      // // { path: 'course', loadChildren: '../course/course.module#CourseModule' },
      // { path: 'content', loadChildren: '../content/content.module#ContentModule' },
      // { path: 'test', loadChildren: '../question/question.module#QuestionModule' },
      // { path: 'trainers', loadChildren: '../trainers/trainers.module#TrainersModule' },
      // // { path: 'certificater', loadChildren: '../certificater/certificater.module#CertificaterModule' },
      // { path: 'message', component: MessageComponent },
      // { path: 'feedback', component: FeedbackComponent },
      // { path: 'profile', component: ProfileComponent },
    ]
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);