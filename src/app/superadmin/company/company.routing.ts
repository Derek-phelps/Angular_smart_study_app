import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';
import { ModuleWithProviders } from '@angular/core';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
export const routes: Routes = [
  {
    path: '',
    component: CompanyComponent
  },
  {
    path: 'add',
    component: AddCompanyComponent
  },
  {
    path: 'edit/:id',
    component: EditCompanyComponent
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);