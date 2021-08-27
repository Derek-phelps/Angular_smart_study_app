import { Component } from '@angular/core';
import { PositionService } from '../position.service'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'positionEdit',
  templateUrl: './positionEdit.html',
})
export class positionEdit {
  public EmpForm: FormGroup;
  public postList = [];
  department = [];
  DepList = [];
  constructor(public _globals: Globals, public router: Router, private route: ActivatedRoute, protected service: PositionService, private translate: TranslateService, private formBuilder: FormBuilder) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
    
    this.EmpForm = this.formBuilder.group({
      PositionId: [''],
      PositionName: ['', Validators.required]
    });
    this.route.params.subscribe(params => {
      this.loadEditPositionId(params['id']);
      // In a real app: dispatch action to load the details here.
    });

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
  loadEditPositionId(id) {
    this.service.getById(id).subscribe((data) => {
      if (data.success) {
        this.EmpForm.setValue({
          PositionId: data.data.positionId,
          PositionName: data.data.positionName
        });
      } else {
        alert(data.mes);
      }
    });
  }
  saveEmpData() {

    this.service.edit(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        this.translate.get('alert.SavePositionSuccess').subscribe(value => { alert(value); });
      } else {
        this.translate.get('alert.EditPosFail').subscribe(value => { alert(value); });
        this.postList = [];
      }
    });
  }
}
