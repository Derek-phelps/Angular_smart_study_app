import { Routes, RouterModule } from '@angular/router';
import { Reading } from './reading.component';
import { AuthGuardService as AuthGuard } from '../../common/auth-guard.service';
const routes: Routes = [
  {
    path: 'read/:empCourseId/:id',
    canActivate: [AuthGuard],
    component: Reading
  }
];

export const routing = RouterModule.forChild(routes);
