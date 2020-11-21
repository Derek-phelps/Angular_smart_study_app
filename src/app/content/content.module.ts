import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './content.routing';
import { ContentComponent } from './content.component';

import { ContentService } from './content.service';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '../theme/layout.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddContentComponent } from './components/add-content/add-content.component';
import { EditContentComponent } from './components/edit-content/edit-content.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { QRCodeModule } from 'angularx-qrcode';
import { SubChapterOverviewDialog } from './content.component';
@NgModule({
  imports: [
    NgxMaterialTimepickerModule, QRCodeModule,
    MatCheckboxModule, MatNativeDateModule, MatDatepickerModule, CommonModule, routing, AppTranslationModule, MatCardModule, MatFormFieldModule, MatInputModule, MatListModule, MatDialogModule,
    LayoutModule, MatTableModule, MatSortModule, MatPaginatorModule, FormsModule, ReactiveFormsModule
  ],
  entryComponents: [
    SubChapterOverviewDialog
  ],
  declarations: [ContentComponent,
    AddContentComponent, EditContentComponent, SubChapterOverviewDialog],
  providers: [
    ContentService
  ]
})
export class ContentModule { }
