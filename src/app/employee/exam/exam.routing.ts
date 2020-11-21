import { Routes, RouterModule } from '@angular/router';
import { Exam } from './exam.component';
import { AuthGuardService as AuthGuard } from '../../common/auth-guard.service';
const routes: Routes = [
  {
    path: 'exam/:empCourseId/:id',
    canActivate: [AuthGuard],
    component: Exam,
  }
];

export const routing = RouterModule.forChild(routes);
