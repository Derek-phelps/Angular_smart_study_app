import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './adminCertificater.routing';
import { AdminCertificater } from './adminCertificater.component';
import { AddAdminCertificaterComponent } from './components/add-admin-certificater/add-admin-certificater.component';
import { EditAdminCertificaterComponent } from './components/edit-admin-certificater/edit-admin-certificater.component';
import { CertificaterService } from './certificater.service';

import { LayoutModule } from '../theme/layout.module';

import { AppTranslationModule } from '../app.translation.module';

import { AppMaterialModule } from '../app-material/app-material.module';

@NgModule({
  imports: [
    CommonModule, LayoutModule, AppTranslationModule,
    FormsModule, ReactiveFormsModule, AppMaterialModule, routing
  ],
  declarations: [
    AdminCertificater, AddAdminCertificaterComponent, EditAdminCertificaterComponent
  ],
  providers: [
    CertificaterService
  ]
})
export class AdminCertificaterModule { }
