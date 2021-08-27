import { Routes, RouterModule } from '@angular/router';
import { AdminCertificater } from './adminCertificater.component';
import { ModuleWithProviders } from '@angular/core';
import { AddAdminCertificaterComponent } from './components/add-admin-certificater/add-admin-certificater.component';
import { EditAdminCertificaterComponent } from './components/edit-admin-certificater/edit-admin-certificater.component';


export const routes: Routes = [
  {
    path: '',
    component: AdminCertificater
  },
  {
    path: 'add',
    component: AddAdminCertificaterComponent
  },
  {
    path: 'add/:course',
    component: AddAdminCertificaterComponent
  },
  {
    path: 'edit/:id',
    component: EditAdminCertificaterComponent
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);