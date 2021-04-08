import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionContainerComponent } from './components/question-container/question-container.component';
import { QuestionService } from './services/question.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AppTranslationModule } from '../app.translation.module';
import { QuestionComponent } from './components/question/question.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxUploaderModule } from 'ngx-uploader';
import { LayoutModule } from '../theme/layout.module';
import { MaxLengthPipe } from './pipes/max-length.pipe';



@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    MatExpansionModule,
    MatTooltipModule,
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule,
    AppTranslationModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatListModule, 
    MatDialogModule,
    MatCheckboxModule, 
    NgxMaterialTimepickerModule, 
    MatNativeDateModule, 
    MatDatepickerModule, 
    LayoutModule,
  ],
  declarations : [
    QuestionComponent,
    QuestionContainerComponent,
    MaxLengthPipe,
  ],
  exports : [
    QuestionContainerComponent,
    DragDropModule,
    MatExpansionModule,
    MatTooltipModule,
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule,
    AppTranslationModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatListModule, 
    MatDialogModule,
    MatCheckboxModule, 
    NgxMaterialTimepickerModule, 
    MatNativeDateModule, 
    MatDatepickerModule, 
    LayoutModule,
    MaxLengthPipe,
  ],
  providers : [
    QuestionService,
  ]

})
export class CoreModule { }
