import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { GlobalService } from './services/global.service';

//import { ChartistModule } from 'ng-chartist';

import { NotificationComponent } from './components/notification/notification.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MenuComponent } from './layouts/menu/menu.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { ContentTopComponent } from './layouts/content-top/content-top.component';
import { PagesTopComponent } from './layouts/pages-top/pages-top.component';

import { NgxUploaderModule } from 'ngx-uploader';
import { ConfirmationBoxComponent } from './components/confirmation-box/confirmation-box.component';
import { BaPictureUploader } from './components/baPictureUploader/baPictureUploader.component';
import { AlertComponent } from './components/alert/alert.component';
import { PromptBoxComponent } from './components/prompt-box/prompt-box.component';
import { BaFileUploader } from './components/baFileUploader/baFileUploader.component';
// import { BaChartistChart } from './components/baChartistChart/baChartistChart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { NgxFlagIconCssModule } from 'ngx-flag-icon-css';
//ChartistModule,
import { AppMaterialModule } from '../app-material/app-material.module';
import { DialogForwardUserDialog } from '../forward-user/dialog-forward-user-dialog';
import { CertificateListComponent } from './components/certificate-list/certificate-list.component';

@NgModule({
    imports: [
        CommonModule, MatDialogModule, NgxUploaderModule, AppTranslationModule,
        RouterModule, FormsModule, ReactiveFormsModule,
        SharedModule, NgxFlagIconCssModule,
        AppMaterialModule
    ],
    providers: [
        GlobalService
    ],
    declarations: [
        MenuComponent,
        SidebarComponent,
        PagesTopComponent,
        ContentTopComponent,
        NotificationComponent,
        LoadingComponent,
        ConfirmationBoxComponent,
        DialogForwardUserDialog,
        PromptBoxComponent,
        AlertComponent,
        BaPictureUploader,
        BaFileUploader,
        //BaChartistChart,
        CertificateListComponent
    ],
    entryComponents: [
        ConfirmationBoxComponent, DialogForwardUserDialog, PromptBoxComponent, AlertComponent/*, BaChartistChart*/
    ],
    exports: [
        SidebarComponent,
        PagesTopComponent,
        ContentTopComponent,
        NotificationComponent,
        LoadingComponent,
        ConfirmationBoxComponent, DialogForwardUserDialog, PromptBoxComponent, AlertComponent, /*BaChartistChart,*/
        BaPictureUploader,
        BaFileUploader,
        CertificateListComponent
    ]
})
export class LayoutModule { }
