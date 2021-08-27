import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './trainers.routing';
import { TrainersComponent } from './trainers.component';
import { TrainersService } from './trainers.service';
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
import { AddTrainersComponent } from './components/add-trainers/add-trainers.component';
import { EditTrainersComponent } from './components/edit-trainers/edit-trainers.component';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  imports: [
    MatGridListModule,
    CommonModule, routing, AppTranslationModule, MatCardModule, MatFormFieldModule, MatInputModule, MatListModule, MatDialogModule,
    LayoutModule, MatTableModule, MatSortModule, MatPaginatorModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [TrainersComponent, AddTrainersComponent, EditTrainersComponent],
  providers: [
    TrainersService
  ]
})
export class TrainersModule { }
