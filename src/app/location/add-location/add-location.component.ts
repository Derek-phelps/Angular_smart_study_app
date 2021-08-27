import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LocationService } from '../location.service';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/common/auth-guard.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  public EmpForm: FormGroup;
  public newAttribute: any = {};
  public fieldArray: Array<any> = [];

  constructor(protected service: LocationService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
    
    this.setDefaultFormValues();
  }

  setDefaultFormValues() {
    this.EmpForm = this.formBuilder.group({
      locationName: ['', Validators.required]
    });
  }

  saveLocData() {
    this.service.add(this.EmpForm.value, this.fieldArray).subscribe((data) => {
      if (data.success) {
        this.translate.get('alert.SaveLocationSuccess').subscribe(
          value => {
            alert(value);
          }
        );
      } else {
        this.translate.get('alert.AddLocationFail').subscribe(
          value => {
            alert(value);
          }
        );
      }
    });
  }
  addFieldValue() {
    //this.newAttribute.locationId = this.currentLocationId;
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
  }
  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1)[0];
  }
  ngOnInit() {
  }

}
