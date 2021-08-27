import { Component } from '@angular/core';
import { PositionService } from '../position.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'positionAdd',
  templateUrl: './positionAdd.html',
})
export class positionAdd {
  public EmpForm: FormGroup;
  public postList = [];
  department = [];
  DepList = [];
  constructor(protected service: PositionService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
    
    this.setDefaultFormValues();

    function goodbye(e) {
      if (!e) e = window.event;
      //e.cancelBubble is supported by IE - this will kill the bubbling process.
      e.cancelBubble = true;
      e.returnValue = undefined; //This is displayed on the dialog

      //e.stopPropagation works in Firefox.
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    window.onbeforeunload = goodbye;
  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
  }
  setDefaultFormValues() {
    this.EmpForm = this.formBuilder.group({
      PositionName: ['', Validators.required]
    });
  }
  saveEmpData() {

    this.service.add(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        //this.EmpForm.reset();
        this.setDefaultFormValues();
        this.translate.get('alert.SavePositionSuccess').subscribe(value => { alert(value); });
      } else {
        this.translate.get('alert.AddPosFail').subscribe(value => { alert(value); });
        this.postList = [];
      }
    });
  }
}
