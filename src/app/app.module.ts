import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl } from '@angular/material/paginator';
//import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from './theme/layout.module';
import { SharedModule } from './theme/shared.module';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuardService as AuthGuard, Globals } from './common/auth-guard.service';
import { AppTranslationModule } from './app.translation.module';

import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';

import { DownloadModule } from './download/download.module';
import { SuperAdminModule } from './superadmin/super-admin.module';
import { AdminModule } from './admin/admin.module';
import { EmployeeModule } from './employee/employee.module';
import { TrainerModule } from './trainer/trainer.module';
import { RegistrationModule } from './registration/registration.module';
import { TrainerRegistrationModule } from './trainerRegistration/trainerRegistration.module';
// import { ActiveLoginModule } from './ActiveLogin/activeLogin.module';
import { ReadingModule } from './employee/reading/reading.module';
import { ReadingScormModule } from './employee/readingScorm/readingScorm.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// import { MatListModule } from '@angular/material/list';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoutingState } from './theme/services/global.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { CdkColumnDef } from '@angular/cdk/table';
import { PaginatorI18n } from './paginator-intl';
import { TranslateService } from '@ngx-translate/core';
import { ViewGroupComponent } from './groups/components/view-group/view-group.component';

import { AppMaterialModule } from './app-material/app-material.module';

// import { BottomSheetModifyCourse } from './admin/adminCourse/components/modify-admin-course/modify-adminCourse.component';

import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent, LoginComponent,  //, ViewGroupComponent
  ],
  imports: [ReadingModule, ReadingScormModule, DownloadModule, ChartsModule, AppMaterialModule,
    BrowserModule, BrowserAnimationsModule, HttpClientModule, RouterModule, MatCardModule,
    NgbModule, /*AngularFontAwesomeModule,*/ MatFormFieldModule, MatInputModule, RegistrationModule,
    AppTranslationModule, LayoutModule, SharedModule, //ActiveLoginModule,
    TrainerRegistrationModule,
    FormsModule, ReactiveFormsModule, SuperAdminModule, AdminModule, EmployeeModule, TrainerModule,
    routing, NgxSpinnerModule, MatTooltipModule, NgxMaterialTimepickerModule,
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })
  ],
  providers: [LoginService, AuthGuard, Globals, RoutingState, CdkColumnDef,
    {
      provide: MatPaginatorIntl, deps: [TranslateService],
      useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
