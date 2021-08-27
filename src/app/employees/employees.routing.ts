import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { ModuleWithProviders } from '@angular/core';
import { AddEmployeesComponent } from './components/add-employees/add-employees.component';
import { EditEmployeesComponent } from './components/edit-employees/edit-employees.component';

export const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent
  },
  {
    path: 'add',
    component: AddEmployeesComponent
  },
  {
    path: 'edit/:id',
    component: EditEmployeesComponent
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);