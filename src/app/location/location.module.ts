import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLocationComponent } from './add-location/add-location.component';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { routing } from './location.routing';
import { LocationComponent } from './location.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AppTranslationModule } from '../app.translation.module';
import { LayoutModule } from '@angular/cdk/layout';
import { LocationService } from './location.service';

@NgModule({
  declarations: [
    LocationComponent, AddLocationComponent, EditLocationComponent
  ],
  imports: [
    routing, CommonModule, FormsModule, MatListModule, MatDialogModule, LayoutModule,
    MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    AppTranslationModule, MatSortModule, MatTableModule, MatPaginatorModule,
    MatCheckboxModule
  ],

  providers: [
    LocationService
  ]
})
export class LocationModule { }
