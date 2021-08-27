import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './adminEmployee.routing';


import { LayoutModule } from '../../theme/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';

import { BottomSheetEditEmployees } from './components/edit-employees/edit-employees.component';

import { AdminEmployeeComponent, DialogUploadEmpDialog } from './adminEmployee.component';
import { AddEmployeesComponent } from './components/add-employees/add-employees.component';
import { EditEmployeesComponent } from './components/edit-employees/edit-employees.component';
//import { EmployeesChart } from './components/chart-employees/employeesChart.component';

import { AdminEmployeeService } from './adminEmployee.service';
import { ViewEmployeeComponent, CertificateDialog } from './components/view-employee/view-employee.component';
import { ModifyEmployeeComponent, DisableControlDirective } from './components/modify-employee/modify-employee.component';

import { AppMaterialModule } from '../../app-material/app-material.module';
import { CourseAssignmentModule } from 'src/app/course-assignment/course-assignment.module';

@NgModule({
  imports: [
    CommonModule, routing, LayoutModule, FormsModule, ReactiveFormsModule, AppTranslationModule, AppMaterialModule, CourseAssignmentModule
  ],
  entryComponents: [BottomSheetEditEmployees, DialogUploadEmpDialog, CertificateDialog],
  declarations: [AdminEmployeeComponent, AddEmployeesComponent, EditEmployeesComponent, /*EmployeesChart,*/ BottomSheetEditEmployees,
    ViewEmployeeComponent, CertificateDialog, ModifyEmployeeComponent, DialogUploadEmpDialog, DisableControlDirective],
  providers: [
    AdminEmployeeService
  ]
})
export class AdminEmployeeModule { }
