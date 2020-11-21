import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AdminTrainerComponent } from './adminTrainer.component';
import { EditAdminTrainerComponent } from './components/edit-adminTrainer/edit-adminTrainer.component';
import { AddAdminTrainerComponent } from './components/add-adminTrainer/add-adminTrainer.component';
export const routes: Routes = [
  {
    path: '',
    component: AdminTrainerComponent
  },
  {
    path: 'add',
    component: AddAdminTrainerComponent
  },
  {
    path: 'edit/:id',
    component: EditAdminTrainerComponent
  }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);