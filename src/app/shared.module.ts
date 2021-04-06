import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from "primeng/api";

import { OrderByPipe } from './order-by.pipe';

@NgModule({
  imports: [
    ButtonModule,
    ChartModule,
    DialogModule,
    TableModule,
    ToastModule,
    ToolbarModule,
  ],
  declarations: [
    OrderByPipe
  ],
  exports: [
    ButtonModule,
    ChartModule,
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