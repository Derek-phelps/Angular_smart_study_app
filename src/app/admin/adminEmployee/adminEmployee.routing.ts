import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AdminEmployeeComponent } from './adminEmployee.component';
// import { AddEmployeesComponent } from './components/add-employees/add-employees.component';
// import { EditEmployeesComponent } from './components/edit-employees/edit-employees.component';
import { ViewEmployeeComponent } from './components/view-employee/view-employee.component';
import { ModifyEmployeeComponent } from './components/modify-employee/modify-employee.component';
//import { EmployeesChart } from './components/chart-employees/employeesChart.component';
import { CourseAssignmentComponent } from 'src/app/course-assignment/course-assignment.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminEmployeeComponent
  },
  {
    path: 'add',
    component: ModifyEmployeeComponent
  },
  {
    path: 'edit/:id',
    component: ModifyEmployeeComponent
  },
  // {
  //   path: 'progressChart/:id',
  //   component: EmployeesChart
  // },
  {
    path: ':id', component: ViewEmployeeComponent
  },
  {
    path: ':userId/assigncourse', component: CourseAssignmentComponent
  },
  {
    path: ':userId/assigncourse/:assId', component: CourseAssignmentComponent
  }
]; export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);