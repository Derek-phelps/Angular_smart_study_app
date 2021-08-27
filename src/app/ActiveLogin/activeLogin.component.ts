// import { Component, OnInit } from '@angular/core';

// import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ActiveLoginService } from './activeLogin.service';
// import { Globals } from '../common/auth-guard.service';
// import { ActivatedRoute } from "@angular/router";
// import { TranslateService } from '@ngx-translate/core';

// @Component({
//   selector: 'app-activeLogin',
//   templateUrl: './activeLogin.component.html',
//   styleUrls: ['./activeLogin.component.scss']
// })
// export class ActiveLoginComponent implements OnInit {

//   errorMessage: string;
//   public form: FormGroup;
//   public email: AbstractControl;
//   public password: AbstractControl;
//   public submitted: boolean = false;

//   public BGImg: string = "";
//   public ActiveLink = "";
//   constructor(private route: ActivatedRoute, fb: FormBuilder, public router: Router, private _loginService: ActiveLoginService, private translate: TranslateService, public globals: Globals) {
//     this.form = fb.group({
//       'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
//       'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
//     });
//     this.route.params.subscribe(params => {
//       this.ActiveLink = params.id;
//     });
//     this.email = this.form.controls['email'];
//     this.password = this.form.controls['password'];
//     this.BGImg = this.globals.companyInfo.BackgroundImage;
//   }
//   ngOnInit() {
//   }
//   public onSubmit(values: Object): void {
//     this.submitted = true;
//     if (this.form.valid) {
//       this._loginService.login(this.form.value, this.ActiveLink)
//         .subscribe(user => {
//           if (user.success) {
//             if (this.globals.companyInfo.companyId == user.data.companyId) {
//               localStorage.setItem('currentUser', JSON.stringify(user.data));
//               if (user.data.UserType == 1) {
//                 this.router.navigate(['./superadmin'], { skipLocationChange: false });
//               } else if (user.data.UserType == 2) {
//                 this.router.navigate(['./admin'], { skipLocationChange: false });
//               } else if (user.data.UserType == 3) {
//                 this.router.navigate(['./trainer'], { skipLocationChange: false });
//               } else {
//                 this.router.navigate(['./employee'], { skipLocationChange: false });
//               }
//             } else {
//               this.translate.get('alert.UnAuthComp').subscribe(value => { alert(value); });
//             }
//           } else {
//             this.translate.get('alert.UnAuth').subscribe(value => { alert(value); });
//           }
//         }, error => this.errorMessage = <any>error);
//     } else {
//       alert(this.form);
//     }
//   }
// }
