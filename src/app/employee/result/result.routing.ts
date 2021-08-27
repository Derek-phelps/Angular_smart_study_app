import { Routes, RouterModule } from '@angular/router';
import { Result } from './result.component';
import { AuthGuardService as AuthGuard } from '../../common/auth-guard.service';
const routes: Routes = [
  {
    path: 'result/:empCourseId/:id',
    canActivate: [AuthGuard],
    component: Result,
  }
];

export const routing = RouterModule.forChild(routes);
