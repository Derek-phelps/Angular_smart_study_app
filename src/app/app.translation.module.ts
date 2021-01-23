import { NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader, DefaultLangChangeEvent, LangChangeEvent } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateService } from '@ngx-translate/core';
import { Globals } from './common/auth-guard.service';

export function createTranslateLoader(http: HttpClient) {
  // Iterate cache buster here to avoid cached translation files
  return new TranslateHttpLoader(http, './assets/i18n/translations/', '.json?cacheBuster=20');
}

const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslateLoader),
    deps: [HttpClient]
  }
};

@NgModule({
  imports: [TranslateModule.forRoot(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService]
})
export class AppTranslationModule {
  constructor(translate: TranslateService, public globals: Globals) {
    translate.addLangs(["de", "en"]);
    translate.setDefaultLang('en');
    translate.use('en');
    if (this.globals.companyInfo.defaultLang && this.globals.companyInfo.defaultLang != '') {
      translate.setDefaultLang(this.globals.companyInfo.defaultLang);
      translate.use(this.globals.companyInfo.defaultLang)
    }
    if (this.globals.userInfo.userLang && this.globals.userInfo.userLang != '') {
      translate.use(this.globals.userInfo.userLang);
    }
  }
}
