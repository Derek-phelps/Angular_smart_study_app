import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';

import { LayoutModule } from '../theme/layout.module';
import { SharedModule } from '../theme/shared.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { MessageModule } from '../message/message.module';
import { ProfileModule } from '../profile/profile.module';

import { AppTranslationModule } from '../app.translation.module';
import { routing } from './superadmin.routing';

import { SuperadminComponent } from './superadmin.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { SuperadminService } from './superadmin.service';
import { RegistrationsComponent } from './registrations/registrations.component';

import { TableModule } from 'primeng/table';
import { TagModule } from "primeng/tag";
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule, LayoutModule, SharedModule, AppTranslationModule, routing, FeedbackModule, MessageModule,
    MatListModule, MatDialogModule, MatCardModule, MatFormFieldModule, MatInputModule, ProfileModule,
    FormsModule, ReactiveFormsModule, MatSortModule, MatTableModule, MatPaginatorModule,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    TooltipModule
  ],
  declarations: [SuperadminComponent, DashboardComponent, RegistrationsComponent,
  ],
  providers: [
    SuperadminService
  ]
})
export class SuperAdminModule { }
