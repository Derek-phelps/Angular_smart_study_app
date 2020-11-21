import { Routes, RouterModule } from '@angular/router';
import { ReadingScorm } from './readingScorm.component';
import { AuthGuardService as AuthGuard } from '../../common/auth-guard.service';
const routes: Routes = [
  {
    path: 'readScorm/:empCourseId/:id',
    canActivate: [AuthGuard],
    component: ReadingScorm
  }
];

export const routing = RouterModule.forChild(routes);
