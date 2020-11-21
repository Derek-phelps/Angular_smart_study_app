import { Routes, RouterModule } from '@angular/router';
import { TrainerComponent } from './trainer.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuardService as AuthGuard } from '../common/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MessageComponent } from '../message/message.component';
import { ProfileComponent } from '../profile/profile.component';

export const routes: Routes = [
  {
    path: 'trainer',
    component: TrainerComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'course', loadChildren: '../admin/adminCourse/adminCourse.module#AdminCourseModule' },
      { path: 'content', loadChildren: '../content/content.module#ContentModule' },
      { path: 'certificater', loadChildren: '../certificater/certificater.module#CertificaterModule' },
      { path: 'message', component: MessageComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);