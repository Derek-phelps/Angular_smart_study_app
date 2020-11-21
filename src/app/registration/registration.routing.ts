import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: 'registration/:id',
    component: RegistrationComponent,
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);