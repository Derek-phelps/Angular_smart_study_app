import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private _registerForm: FormGroup;
  matcher = new MailErrorStateMatcher();

  private _disableButton: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private _loginService: LoginService) {

    this._registerForm = this._formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^.+[@].+[.].+$")]),
      confMail: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.pattern("^(\\+|0)[0-9]{5,}$")]),
      cond1: new FormControl(false, Validators.requiredTrue),
      cond2: new FormControl(false, Validators.requiredTrue),
      cond3: new FormControl(false, Validators.requiredTrue),
      lang: new FormControl('en', Validators.required)
    }, { validators: this.checkMail });

    this.route.params.subscribe(params => {
      if (params.lang) {
        switch (params.lang) {
          case 'de':
            this.translate.use(params.lang);
            this._registerForm.get('lang').setValue(params.lang);
            break;
          default:
            this.translate.use('en');
            break;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  registerUser(): void {
    if (this.registerForm.valid) {
      // console.log(this.registerForm.value);
      this._disableButton = true;
      this._loginService.registerNewAccount(this.registerForm.value).pipe(take(1)).subscribe(result => {
        // console.warn(result);
        if (result && result.success) {
          // worked
        } else if (result && result.code) {
          switch (result.code) {
            case 2:
              this._registerForm.get('mail').setErrors({ notUnique: true });
              break;
            default:
              alert(this.translate.instant('register.DefaultError'));
              break;
          }
        } else {
          alert(this.translate.instant('register.DefaultError'));
        }
        this._disableButton = false;
      }, () => {
        alert(this.translate.instant('register.DefaultError'));
        this._disableButton = false;
      });
    } else {
      // console.error("invalid form");
      this.registerForm.markAllAsTouched();
    }
  }

  checkMail(group: FormGroup) {
    const mail = group.get('mail').value.toLowerCase();
    const confMail = group.get('confMail').value.toLowerCase();

    return mail === confMail ? null : { notSame: true }
  }

  get registerForm(): FormGroup { return this._registerForm; };
  get disableButton(): boolean { return this._disableButton; };
  // get mailAlreadyInUse(): boolean { return this._mailAlreadyInUse; }
}

export class MailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control?.parent?.hasError('notSame') && control?.dirty || control?.touched && control?.value == '');
  }
}