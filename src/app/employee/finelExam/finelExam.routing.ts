import { Routes, RouterModule } from '@angular/router';
import { FinelExam } from './finelExam.component';
import { AuthGuardService as AuthGuard } from '../../common/auth-guard.service';
const routes: Routes = [
  {
    path: 'finelExam/:empCourseId/:id',
    canActivate: [AuthGuard],
    component: FinelExam,
  }
];

export const routing = RouterModule.forChild(routes);
