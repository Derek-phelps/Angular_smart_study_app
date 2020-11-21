import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { ModuleWithProviders } from '@angular/core';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { EmpFeedBackComponent } from './empFeedBack/empFeedBack.component';
import { MessageComponent } from '../message/message.component';
import { AuthGuardService as AuthGuard } from '../common/auth-guard.service';
import { ProfileComponent } from '../profile/profile.component';
import { EmployeeCourseComponent } from './empCourse/empCourse.component';
import { Chapter } from './chapter/chapter.component';
// import { progress } from './progress/progress.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { MyCertificatesComponent } from './my-certificates/my-certificates.component';
import { DepartmentComponent } from '../department/department.component';
import { GroupsComponent } from '../groups/groups.component';
import { DepartmentModule } from '../department/department.module';
import { GroupsModule } from '../groups/groups.module';

export const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: '', redirectTo: 'mycourses', pathMatch: 'full' },
      // { path: 'dashboard', redirectTo: 'mycourses', pathMatch: 'full' },
      // { path: 'dashboard', component: DashboardComponent },
      // { path: 'course',  component :EmployeeCourseComponent },
      { path: 'message', component: MessageComponent },
      { path: 'feedback', component: EmpFeedBackComponent },
      { path: 'profile', component: ProfileComponent },
      // { path: 'progress/:id', component :  progress},
      // { path: 'chapter/:id', component :  Chapter},
      // { path: 'couID/:id/chapter/:chapterId', component: Chapter },
      { path: 'mycourses', component: MyCoursesComponent },
      { path: 'mycourses/:id', component: Chapter },
      { path: 'mycertificates', component: MyCertificatesComponent },
      // { path: 'mydepartments', component: DepartmentComponent },
      // { path: 'mygroups', component: GroupsComponent }
      // { path: 'mydepartments', loadChildren: '../department/department.module#DepartmentModule' },
      // { path: 'mygroups', loadChildren: '../groups/groups.module#GroupsModule' },
      { path: 'department', loadChildren: '../department/department.module#DepartmentModule' },
      { path: 'groups', loadChildren: '../groups/groups.module#GroupsModule' },
      { path: 'course', loadChildren: '../admin/adminCourse/adminCourse.module#AdminCourseModule', canActivate: [AuthGuard] },
      { path: 'content', loadChildren: '../content/content.module#ContentModule', canActivate: [AuthGuard] },
      { path: 'test', loadChildren: '../question/question.module#QuestionModule', canActivate: [AuthGuard] },
      { path: 'certificater', loadChildren: '../certificater/adminCertificater.module#AdminCertificaterModule', canActivate: [AuthGuard] },
    ]
  }
];
//export const empRouting: ModuleWithProviders = RouterModule.forChild(routes);
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }