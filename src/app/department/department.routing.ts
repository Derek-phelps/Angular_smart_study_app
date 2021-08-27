import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentComponent } from './department.component';
import { ModuleWithProviders } from '@angular/core';
import { ModifyDepartmentComponent } from './components/modify-department/modify-department.component';
import { ViewDepartmentComponent } from './components/view-department/view-department.component';
//import { EditDepartmentComponent } from './components/edit-department/edit-department.component';
import { CourseAssignmentComponent } from '../course-assignment/course-assignment.component'

export const routes: Routes = [
  {
    path: '',
    component: DepartmentComponent
  },
  {
    path: 'add',
    component: ModifyDepartmentComponent
  },
  {
    path: 'edit/:id',
    component: ModifyDepartmentComponent
  },
  {
    path: ':id',
    component: ViewDepartmentComponent
  },
  { path: ':departmentId/assigncourse', component: CourseAssignmentComponent },
  { path: ':departmentId/assigncourse/:assId', component: CourseAssignmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }

//export const routing: ModuleWithProviders = RouterModule.forChild(routes);