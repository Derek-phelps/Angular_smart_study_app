import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentRoutingModule } from './department.routing';

import { OrgChartModule } from '@mondal/org-chart';

// import { MatListModule } from '@angular/material/list';
// import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '../theme/layout.module';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
// import { MatSortModule } from '@angular/material/sort';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { DepartmentComponent } from './department.component';
import { DepartmentService } from './department.service';
import { ModifyDepartmentComponent, DisableControlDirective } from './components/modify-department/modify-department.component';
//import { EditDepartmentComponent } from './components/edit-department/edit-department.component';

// import { MatTabsModule } from '@angular/material/tabs';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatSelectModule } from '@angular/material/select';


import { ViewDepartmentComponent } from './components/view-department/view-department.component';

import { AppMaterialModule } from '../app-material/app-material.module';

import { ChartsModule } from 'ng2-charts';
import { GroupsModule } from '../groups/groups.module';
// import { ViewGroupComponent } from '../groups/components/view-group/view-group.component';
//import { GroupsModule } from '../groups/groups.module';
//import { ViewGroupComponent } from '../groups/components/view-group/view-group.component';

@NgModule({
  imports: [
    OrgChartModule, CommonModule, DepartmentRoutingModule, AppTranslationModule, LayoutModule, FormsModule, ReactiveFormsModule,
    AppMaterialModule, ChartsModule, GroupsModule
  ],
  declarations: [DepartmentComponent, ModifyDepartmentComponent, ViewDepartmentComponent, DisableControlDirective],
  providers: [
    DepartmentService
  ]
})
export class DepartmentModule { }

