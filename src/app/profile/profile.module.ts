import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent, DisableControlDirective } from './profile.component';

import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '../theme/layout.module';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { ProfileService } from './profile.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppMaterialModule } from '../app-material/app-material.module';

@NgModule({
  imports: [
    CommonModule, MatListModule, MatDialogModule, LayoutModule, MatCardModule,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatGridListModule,
    AppTranslationModule, AppMaterialModule
  ],
  declarations: [ProfileComponent, DisableControlDirective],
  providers: [ProfileService]
})
export class ProfileModule { }
