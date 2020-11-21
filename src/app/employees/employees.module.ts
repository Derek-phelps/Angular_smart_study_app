import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './employees.routing';
import { EmployeesComponent } from './employees.component';

import { EmployeeService } from '../employee/employee.service';
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
import { AddEmployeesComponent } from './components/add-employees/add-employees.component';
import { EditEmployeesComponent } from './components/edit-employees/edit-employees.component';


@NgModule({
  imports: [
    CommonModule, routing, AppTranslationModule, MatCardModule, MatFormFieldModule, MatInputModule, MatListModule, MatDialogModule,
    LayoutModule, MatTableModule, MatSortModule, MatPaginatorModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [EmployeesComponent, AddEmployeesComponent, EditEmployeesComponent],
  providers: [
    EmployeeService
  ]
})
export class EmployeesModule { }
