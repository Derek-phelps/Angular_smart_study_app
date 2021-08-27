import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { routing } from './certificater.routing';
// import { CertificaterComponent } from './certificater.component';

import { CertificaterService } from './certificater.service';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '../theme/layout.module';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
// import { AddCertificaterComponent } from './components/add-certificater/add-certificater.component';
// import { EditCertificaterComponent } from './components/edit-certificater/edit-certificater.component';


@NgModule({
  imports: [
    CommonModule/*,routing*/, AppTranslationModule, MatCardModule, MatFormFieldModule, MatInputModule, MatListModule, MatDialogModule,
    LayoutModule, MatTableModule, MatSortModule, MatPaginatorModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [/*CertificaterComponent,AddCertificaterComponent,EditCertificaterComponent*/],
  providers: [
    CertificaterService
  ]
})
export class CertificaterModule { }
