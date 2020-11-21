import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/common/auth-guard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss']
})
export class EditLocationComponent implements OnInit {

  public EmpForm: FormGroup;
  public postList = [];
  department = [];
  DepList = [];
  public fieldArray: Array<any> = [];
  private deleteLocArray: Array<any> = [];
  public newAttribute: any = {};
  private currentLocationId;

  constructor(public _globals: Globals, public router: Router, private route: ActivatedRoute, protected service: LocationService, private translate: TranslateService, private formBuilder: FormBuilder) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.EmpForm = this.formBuilder.group({
      locationId: [''],
      locationName: ['', Validators.required],
      companyId: [this._globals.companyInfo.companyId, Validators.required],
    });
    this.route.params.subscribe(params => {
      this.currentLocationId = params['id'];
      this.loadEditLocationId(params['id']);
      // In a real app: dispatch action to load the details here.
    });

    function goodbye(e) {
      if (!e) { e = window.event; }

      e.cancelBubble = true;
      e.returnValue = undefined;

      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    window.onbeforeunload = goodbye;
  }

  loadEditLocationId(id) {
    this.service.getById(id).subscribe((data) => {
      if (data.success) {
        this.EmpForm.setValue({
          locationId: data.data.locationId,
          locationName: data.data.locationName,
          companyId: this._globals.companyInfo.companyId,
        });
      } else {
        alert(data.mes);
      }
    });
    this.service.getWorkGroupsById(id).subscribe((data) => {
      if (data.success) {
        this.fieldArray = data.data;
      }
    });
  }

  saveLocData() {
    this.service.edit(this.EmpForm.value, this.fieldArray, this.deleteLocArray).subscribe((data) => {
      if (data.success) {
        this.translate.get('alert.EditLocationSuccess').subscribe(value => { alert(value); });
      } else {
        this.translate.get('alert.EditLocationFail').subscribe(value => { alert(value); });
        this.postList = [];
      }
    });
  }

  addFieldValue() {
    this.newAttribute.locationId = this.currentLocationId;
    this.newAttribute.isPrivate = "0";
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
  }
  deleteFieldValue(index) {
    this.deleteLocArray.push(this.fieldArray.splice(index, 1)[0]);
  }
  ngOnInit() {
  }

}
