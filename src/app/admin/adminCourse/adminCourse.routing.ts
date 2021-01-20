
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AdminCourseComponent } from './adminCourse.component';
//import { AddAdminCourseComponent } from './components/add-admin-course/add-adminCourse.component';
//import { EditAdminCourseComponent } from './components/edit-admin-course/edit-adminCourse.component';
import { ModifyAdminCourseComponent } from './components/modify-admin-course/modify-adminCourse.component';
import { ViewAdminCourseComponent } from './components/view-admin-course/view-adminCourse.component';

import { SignupCourseComponent } from './components/signupCourse/signupCourse.component';
import { EditParticipantComponent } from './components/edit-participant/edit-participant.component';
import { CourseAssignmentComponent } from 'src/app/course-assignment/course-assignment.component';


export const routes: Routes = [
  {
    path: '',
    component: AdminCourseComponent
  },
  {
    path: 'view/:id/:tabId',
    component: ViewAdminCourseComponent
  },
  {
    path: 'assigncourse/:courseId',
    component: CourseAssignmentComponent
  },
  {
    path: 'add',
    component: ModifyAdminCourseComponent
  },
  {
    path: 'edit/:id',
    component: ModifyAdminCourseComponent
  },
  {
    path: 'duplicatCourse/:id',
    component: ModifyAdminCourseComponent
  },
  {
    path: 'signup/:id',
    component: SignupCourseComponent
  },
  {
    path: 'participantEdit/:empId/:locId/:isLocReq',
    component: EditParticipantComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }

//export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
