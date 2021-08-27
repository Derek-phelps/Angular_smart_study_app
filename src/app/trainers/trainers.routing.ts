import { Routes, RouterModule } from '@angular/router';
import { TrainersComponent } from './trainers.component';
import { ModuleWithProviders } from '@angular/core';
import { AddTrainersComponent } from './components/add-trainers/add-trainers.component';
import { EditTrainersComponent } from './components/edit-trainers/edit-trainers.component';
export const routes: Routes = [
  {
    path: '',
    component: TrainersComponent
  },
  {
    path: 'add',
    component: AddTrainersComponent
  },
  {
    path: 'edit/:id',
    component: EditTrainersComponent
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);