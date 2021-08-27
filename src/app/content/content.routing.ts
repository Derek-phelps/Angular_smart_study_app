import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content.component';
import { ModuleWithProviders } from '@angular/core';
import { AddChapterComponent } from './components/add-chapter/add-chapter.component';
import { PendingChangesGuardGuard } from './pending-changes-guard.guard';

export const routes: Routes = [
  {
    path: '',
    component: ContentComponent
  },
  {
    path: 'add/:id',
    component : AddChapterComponent,
    canDeactivate : [PendingChangesGuardGuard]
  },
  {
    path: 'edit/:id',
    component: AddChapterComponent,
    canDeactivate : [PendingChangesGuardGuard]
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);