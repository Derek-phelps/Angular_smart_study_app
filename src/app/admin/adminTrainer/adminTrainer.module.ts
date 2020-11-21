import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './adminTrainer.routing';


import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '../../theme/layout.module';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule } from '@angular/material/slider';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
//import {MatNativeDateModule, DateAdapter} from '@angular/material/slider';

import { AdminTrainerComponent } from './adminTrainer.component';
import { AddAdminTrainerComponent } from './components/add-adminTrainer/add-adminTrainer.component';
import { EditAdminTrainerComponent } from './components/edit-adminTrainer/edit-adminTrainer.component';
import { AdminTrainerService } from './adminTrainer.service';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  imports: [
    CommonModule, routing, MatListModule, MatDialogModule, LayoutModule, MatCardModule, MatDatepickerModule,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, AppTranslationModule,
    MatNativeDateModule, MatSliderModule, MatGridListModule
  ],
  declarations: [AdminTrainerComponent, AddAdminTrainerComponent, EditAdminTrainerComponent],
  providers: [
    AdminTrainerService
  ]
})
export class AdminTrainerModule { }
