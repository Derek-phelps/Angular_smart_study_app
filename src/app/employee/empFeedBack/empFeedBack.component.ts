import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { EmpFeedBackService } from './empFeedBack.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Globals } from '../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-empFeedBack',
  templateUrl: './empFeedBack.component.html',
  styleUrls: ['./empFeedBack.component.scss']
})
export class EmpFeedBackComponent implements OnInit {

  isSelect: boolean = false;
  isNewMessage: boolean = false;
  SelectSub: string = "";
  SelectMessage: string = "";
  Message: any = [];
  UsereList: any = [];
  public MessageCom: FormGroup;
  filterMes: number = 1;
  constructor(public _globals: Globals, protected service: EmpFeedBackService, private formBuilder: FormBuilder,
    private translate: TranslateService, private spinner: NgxSpinnerService) {

    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
    
    this.MessageCom = this.formBuilder.group({
      subject: ['', Validators.required],
      mess: [''],
    });
    this.spinner.hide();
  }

  sendNewMes() {
    this.service.send(this.MessageCom.value).subscribe((data) => {
      if (data.success) {
        this.isNewMessage = false;
        this.isSelect = false;
        this.MessageCom.reset();
        this.translate.get('alert.MessageSent').subscribe(value => { alert(value); });
      }
    });
  }
  ngOnInit() {
  }

}
