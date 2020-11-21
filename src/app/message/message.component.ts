import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Globals } from '../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  isSelect: boolean = false;
  isNewMessage: boolean = false;
  SelectSub: string = "";
  SelectMessage: string = "";
  Message: any = [];
  UsereList: any = [];
  private MessageCom: FormGroup;
  filterMes: number = 1;
  constructor(public _globals: Globals, protected service: MessageService, private formBuilder: FormBuilder,
    private translate: TranslateService, private spinner: NgxSpinnerService) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
    
    var obj = this;
    setTimeout(function () {
      obj.loadMes();
      obj.loadUser();
    }, 100);

    this.MessageCom = this.formBuilder.group({
      email: ['', Validators.required],
      subject: ['', Validators.required],
      mess: [''],
    });
  }
  loadUser() {
    if (this._globals.getUserType() == "1") {
      this.service.getAllUser().subscribe((data) => {
        if (data.success) {
          this.UsereList = data.data;
        } else {
          this.UsereList = [];
        }
      });
    } else if (this._globals.getUserType() == "2") {
      if (this._globals.companyInfo.companyId > 0) {
        this.service.getAllUserByCompany().subscribe((data) => {
          if (data.success) {
            this.UsereList = data.data;
          } else {
            this.UsereList = [];
          }
        });
      } else {
        this.service.getAllUser().subscribe((data) => {
          if (data.success) {
            this.UsereList = data.data;
          } else {
            this.UsereList = [];
          }
        });
      }
    } else {
      this.service.getAllUserByCompany().subscribe((data) => {
        if (data.success) {
          this.UsereList = data.data;
        } else {
          this.UsereList = [];
        }
      });
    }
  }
  loadMes() {
    this.service.get(this.filterMes).subscribe((data) => {
      this.Message = data.data;
      this.spinner.hide();
    });
  }
  SelectMsg(index) {
    // console.log(index);
    this.service.isRead(this.Message[index].messageId).subscribe((data) => {

    });
    this.isSelect = true;
    this.isNewMessage = false;
    this.SelectMessage = this.Message[index].message;
    this.SelectSub = this.Message[index].messageSub;
  }
  newMessage() {
    this.isNewMessage = true;
    this.isSelect = false;
  }
  deleteMess(MessId) {
    this.translate.get('alert.deleteMessage').subscribe(value => { 
      if (window.confirm(value)) {
        this.service.delete(MessId).subscribe((data) => {
          if (data.success) {
            this.translate.get('alert.MessageDel').subscribe(value => { alert(value); });
            this.loadMes();
          }
        });
      }
    });
    
  }
  sendNewMes() {

    this.service.Send(this.MessageCom.value).subscribe((data) => {
      if (data.success) {
        this.isNewMessage = false;
        this.isSelect = false;
        this.translate.get('alert.MessageSent').subscribe(value => { alert(value); });
        this.loadMes();
        //this.baMsg.loadMsg();
      }
    });
  }
  ngOnInit() {
  }

}
