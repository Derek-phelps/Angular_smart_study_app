import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'login' },
  { path: '', component: LoginComponent },
  // {
  //   path: 'login',
  //   component: LoginComponent
  // },
  {
    path: 'login/:id',
    component: LoginComponent
  },
  { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes, { useHash: true });
