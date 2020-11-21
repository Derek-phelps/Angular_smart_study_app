import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PositionComponent } from './position.component';
import { positionAdd } from './components/positionAdd.component';
import { positionEdit } from './components/positionEdit.component';
export const routes: Routes = [
  {
    path: '',
    component: PositionComponent
  },
  {
    path: 'add',
    component: positionAdd
  },
  {
    path: 'edit/:id',
    component: positionEdit
  }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);