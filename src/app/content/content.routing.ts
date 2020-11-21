import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content.component';
import { ModuleWithProviders } from '@angular/core';
import { AddContentComponent } from './components/add-content/add-content.component';
import { EditContentComponent } from './components/edit-content/edit-content.component';

export const routes: Routes = [
  {
    path: '',
    component: ContentComponent
  },
  // TODO: Check why this 'disables' add component!!
  // {
  //   path: ':id',
  //   component: ContentComponent
  // },
  // {
  //   path: 'add',
  //   component: AddContentComponent
  // },
  {
    path: 'add/:id',
    component: AddContentComponent
  },
  {
    path: 'edit/:id',
    component: EditContentComponent
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);