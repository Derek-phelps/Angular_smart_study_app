import { NgModule } from '@angular/core';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from "primeng/api";

import { OrderByPipe } from './order-by.pipe';

@NgModule({
  imports: [
    ConfirmDialogModule,
    DialogModule,
    TableModule,
    ToastModule,
    ToolbarModule,
  ],
  declarations: [
    OrderByPipe
  ],
  exports: [
    ConfirmDialogModule,
    DialogModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    OrderByPipe,
  ],
  providers: [
    ConfirmationService,
    MessageService,
  ]
})

export class SharedAppModule { }