import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { GroupsService } from './groups.service';

import { AppTranslationModule } from '../app.translation.module';

import { ModifyGroupComponent } from './components/modify-group/modify-group.component';
import { ViewGroupComponent } from './components/view-group/view-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { CourseAssignmentModule } from '../course-assignment/course-assignment.module';

import { AppMaterialModule } from '../app-material/app-material.module';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [GroupsComponent, ModifyGroupComponent, ViewGroupComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    AppTranslationModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    CourseAssignmentModule,
    AppMaterialModule,
    ChartsModule
  ],
  providers: [GroupsService],
  exports: [
    //ViewGroupComponent
    ViewGroupComponent
  ]
})
export class GroupsModule { }
