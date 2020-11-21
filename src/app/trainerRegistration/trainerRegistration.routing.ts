import { Routes, RouterModule } from '@angular/router';
import { TrainerRegistrationComponent } from './trainerRegistration.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: 'trainerRegistration',
    component: TrainerRegistrationComponent,
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);