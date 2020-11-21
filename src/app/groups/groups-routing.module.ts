import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { ModifyGroupComponent } from './components/modify-group/modify-group.component';
import { ViewGroupComponent } from './components/view-group/view-group.component';
import { CourseAssignmentComponent } from '../course-assignment/course-assignment.component';

const routes: Routes = [
  { path: '', component: GroupsComponent },
  { path: 'add', component: ModifyGroupComponent },
  { path: 'edit/:id', component: ModifyGroupComponent },
  { path: ':id', component: ViewGroupComponent },
  { path: ':groupId/assigncourse', component: CourseAssignmentComponent },
  { path: ':groupId/assigncourse/:assId', component: CourseAssignmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
