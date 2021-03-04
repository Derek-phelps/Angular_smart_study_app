import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private _registerForm: FormGroup;
  matcher = new MailErrorStateMatcher();

  constructor(private _formBuilder: FormBuilder) {
    this._registerForm = this._formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, Validators.email]),
      confMail: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.pattern("^(\\+|0)[0-9]{5,}$")]),
      cond1: new FormControl(false, Validators.requiredTrue),
      cond2: new FormControl(false, Validators.requiredTrue),
      cond3: new FormControl(false, Validators.requiredTrue),
    }, { validators: this.checkMail });
  }

  ngOnInit(): void {
  }

  registerUser(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    } else {
      console.error("invalid form");
      this.registerForm.markAllAsTouched();
    }
  }

  checkMail(group: FormGroup) {
    const mail = group.get('mail').value.toLowerCase();
    const confMail = group.get('confMail').value.toLowerCase();

    return mail === confMail ? null : { notSame: true }
  }

  get registerForm(): FormGroup { return this._registerForm; };
}

export class MailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control?.parent?.hasError('notSame') && control?.dirty || control?.touched && control?.value == '');
  }
}