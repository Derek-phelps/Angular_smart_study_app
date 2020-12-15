import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content.component';
import { ModuleWithProviders } from '@angular/core';
import { AddContentComponent } from './components/add-content/add-content.component';
import { EditContentComponent } from './components/edit-content/edit-content.component';
import { AddChapterComponent } from './components/add-chapter/add-chapter.component';

export const routes: Routes = [
  {
    path: '',
    component: ContentComponent
  },
  {
    path: 'add/:id',
    //component: AddContentComponent
    component : AddChapterComponent
  },
  {
    path: 'edit/:id',
    component: EditContentComponent
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);