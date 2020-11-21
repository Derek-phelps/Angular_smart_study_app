import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '../theme/layout.module';
import { SharedModule } from '../theme/shared.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { MessageModule } from '../message/message.module';

import { AppTranslationModule } from '../app.translation.module';
import { routing } from './admin.routing';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyComponent } from './company/company.component';

import { AdminService } from './admin.service';
import { DashboardService } from './dashboard/dashboard.service';
import { ProfileModule } from '../profile/profile.module';

import { NgxFlagIconCssModule } from 'ngx-flag-icon-css';

import { ColorPickerModule } from 'ngx-color-picker';

// import { MatTooltipModule } from '@angular/material/tooltip';

import { AppMaterialModule } from '../app-material/app-material.module';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule, LayoutModule, SharedModule, AppTranslationModule, routing, FeedbackModule, MessageModule,
    ProfileModule, FormsModule, ReactiveFormsModule, NgxFlagIconCssModule, AppMaterialModule,
    ColorPickerModule, ChartsModule
  ],
  declarations: [AdminComponent, DashboardComponent, CompanyComponent],
  providers: [
    AdminService, DashboardService
  ]
})
export class AdminModule { }
