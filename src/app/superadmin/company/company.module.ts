import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './company.routing';
import { CompanyComponent } from './company.component';
import { SuperadminService } from '../superadmin.service';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '../../theme/layout.module';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
import { AddCourseComponent } from './components/addCourse/addCourse.component';
import { MatGridListModule } from '@angular/material/grid-list';
@NgModule({
  imports: [
    MatGridListModule,
    CommonModule, routing, AppTranslationModule, MatCardModule, MatFormFieldModule, MatInputModule, MatListModule, MatDialogModule,
    LayoutModule, MatTableModule, MatSortModule, MatPaginatorModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [CompanyComponent, AddCompanyComponent, EditCompanyComponent, AddCourseComponent],
  entryComponents: [AddCourseComponent],
  providers: [
    SuperadminService
  ]
})
export class CompanyModule { }
