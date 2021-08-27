import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './position.routing';


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

import { PositionComponent } from './position.component';
import { positionAdd } from './components/positionAdd.component';
import { positionEdit } from './components/positionEdit.component';
import { PositionService } from './position.service';

@NgModule({
  imports: [
    CommonModule, routing, MatListModule, MatDialogModule, LayoutModule, MatCardModule,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, AppTranslationModule,
    MatSortModule, MatTableModule, MatPaginatorModule
  ],
  declarations: [PositionComponent, positionAdd, positionEdit],
  providers: [
    PositionService
  ]
})
export class PositionModule { }
