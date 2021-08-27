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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { QRCodeModule } from 'angularx-qrcode';
import { SubChapterOverviewDialog } from './content.component';
import { AddChapterComponent } from './components/add-chapter/add-chapter.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from 'primeng/editor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PendingChangesGuardGuard } from './pending-changes-guard.guard';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CoreModule,
    CommonModule, 
    routing, 
    MatCardModule, 
    LayoutModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatTabsModule,
    EditorModule,
  ],
  entryComponents: [
    SubChapterOverviewDialog
  ],
  declarations: [
    ContentComponent,
    SubChapterOverviewDialog, 
    AddChapterComponent],
  providers: [
    ContentService,
    PendingChangesGuardGuard
  ]
})
export class ContentModule { }
