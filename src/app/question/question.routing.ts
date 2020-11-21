import { Routes, RouterModule } from '@angular/router';
import { QuestionComponent } from './question.component';
import { ModuleWithProviders } from '@angular/core';
import { QuestionAdd } from './components/add/questionAdd.component';
import { QuestionEdit } from './components/edit/questionEdit.component';
export const routes: Routes = [
  {
    path: '',
    component: QuestionComponent
  },
  // {
  //   path: 'add',
  //   component: QuestionAdd
  // },
  {
    path: 'add/:id',
    component: QuestionAdd
  },
  {
    path: 'edit/:id',
    component: QuestionEdit
  }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);