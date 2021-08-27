import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatSortModule } from '@angular/material/sort';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatListModule } from '@angular/material/list';
// import { MatDialogModule } from '@angular/material/dialog';

import { LayoutModule } from '../theme/layout.module';
import { SharedModule } from '../theme/shared.module';


import { AppTranslationModule } from '../app.translation.module';
import { routing } from './registration.routing';

import { RegistrationComponent } from './registration.component';
import { RegistrationService } from './registration.service';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatIconModule } from '@angular/material/icon';
// import { MatTooltipModule } from '@angular/material/tooltip';
import { AppMaterialModule } from '../app-material/app-material.module';

@NgModule({
  imports: [
    CommonModule, LayoutModule, SharedModule, AppTranslationModule, routing,
    FormsModule, ReactiveFormsModule, AppMaterialModule
  ],
  declarations: [RegistrationComponent],
  providers: [
    RegistrationService
  ]
})
export class RegistrationModule { }
