import { Component } from '@angular/core';
import { downloadService } from './download.service';
import { LoginService } from '../login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as jsPDF from 'jspdf'
import { Globals } from '../common/auth-guard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'download',
  templateUrl: './download.html',
  styleUrls: ['./download.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(2000))
    ]),
    trigger('visibilityChanged2', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(500))
    ]),
    trigger('visibilityChanged3', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(500))
    ]),
    trigger('visibilityChanged4', [
      state('shown', style({ opacity: 1, marginTop: '10%', width: '100%' })),
      state('hidden', style({ opacity: 0.2, marginTop: 0, width: '200px' })),
      transition('shown => hidden', animate(5000)),
      transition('hidden => shown', animate(5000))
    ])
  ]
})
export class download {

  errorMessage: string;
  public courceId = "";
  public empId = "";
  public extensionList = [];
  public TSignature = "";
  public comLogo = "";
  public base64Img = "";
  public strCertificate = "Certificate";
  fadeIn = false;
  bShowDiv = false;
  bShowLogin = false;
  bShowLoginBox = false;
  bShowError = false;
  bHasPw = false;
  bShowList = false;
  bgImgLoaded = false;
  logoImgLoaded = false;
  linkId = "";
  courseId = undefined;
  empList = [];
  url = "";

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;

  constructor(public router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService, protected service: downloadService,
    public globals: Globals, private translate: TranslateService, private _loginService: LoginService, fb: FormBuilder) {

    //   console.log(this._globals);
    //   console.log(this._globals.userInfo);
    //   console.log(this._globals.companyInfo);
    // if (this._globals.userInfo.userLang && this._globals.userInfo.userLang != "") {
    //   if (this.translate.currentLang != this._globals.userInfo.userLang) {
    //     this.translate.use(this._globals.userInfo.userLang);
    //   }
    // }

    this.globals.currentTranslateService = this.translate;

    var obj = this;
    this.route.params.subscribe(params => {
      obj.spinner.show();
      obj.bShowList = false;
      obj.linkId = params['linkId'];
      // TODO: Handle external url generation!!!!!
      // this.courceId = params['courseId'];
      // this.empId = params['empId'].split("@");
      // console.log(params['lang']);
      if (params['lang'] && obj.translate.getLangs().includes(params['lang'])) {
        obj.translate.use(params['lang']);
      }

      obj.translate.get('certificate.Certificate').subscribe(value => { obj.strCertificate = value; });

      if (params['linkId'] && params['linkId'] != '') {
        obj.bShowLogin = true;
        obj.form = fb.group({
          'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
          'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
        obj.email = obj.form.controls['email'];
        obj.password = obj.form.controls['password'];

        obj._loginService.getConfig().subscribe(data => {
          //this.translate.use(data.defaultLang);
          obj.url = data.WebURL + "/API/index.php/";
          //obj._loginService.endSession(url).subscribe(value => { /*console.log(value);*/ });
          obj._loginService.getCompanyLang(obj.url, data.companyId).subscribe(cmpLang => {
            if (cmpLang.success) {
              obj.globals.companyInfo.defaultLang = cmpLang.defaultLang;
              obj.translate.use(cmpLang.defaultLang);
            }
          });
          obj.service.getCertificateLinkInfo(obj.url, params['linkId']).subscribe((data) => {
            // console.log(data);
            if (data.success && data.isValid) {
              // TODO:
              // 1. Check if login/pw => show accordingly
              // 2. Show certificates available for download or streight download if just one

              if (data.isPublic == "0") {
                obj.bShowError = false;
                obj.bShowLoginBox = true;
                if (data.loggedIn) {
                  obj.loadAndShowCertificates();
                }
              } else if (data.isPublic == "1") {
                obj.bShowError = false;
                obj.bShowLoginBox = false;
                obj.bHasPw = (data.hasPw == "1") ? true : false;

                if (!obj.bHasPw) {
                  obj.loadAndShowCertificates();
                } else {
                  obj.bShowLoginBox = true;
                }
              } else {
                obj.bShowError = true;
                obj.bShowLoginBox = false;
              }

              // if (data.isPublic == "0") {
              //   obj.bShowError = false;
              //   obj.bShowLoginBox = true;
              //   obj.bHasPw = (data.hasPw == "1") ? true : false;
              //   if (!obj.bHasPw && data.loggedIn) {
              //     obj.loadAndShowCertificates();
              //   }
              // } else if (data.isPublic == "1") {
              //   obj.bShowError = false;
              //   obj.bShowLoginBox = false;
              //   obj.loadAndShowCertificates();
              // } else {
              //   obj.bShowError = true;
              //   obj.bShowLoginBox = false;
              // }

              if (obj.logoImgLoaded && obj.bgImgLoaded) {
                obj.spinner.hide();
              }
            } else {
              //obj.translate.get('certificate.ErrorLink').subscribe(value => { alert(value); });
              obj.bShowError = true;
              obj.bShowLoginBox = false;
              obj.spinner.hide();
            }
          });
        });
      }
      //  else {
      //   obj.translate.get('certificate.CertCreationWait').subscribe(value => { obj.globals.spinnerText = value; });
      //   obj.loadCertificateById(obj.globals.certificaterCourseId, obj.globals.certificaterEmpId);
      //   obj.globals.certificaterCourseId = undefined;
      //   obj.globals.certificaterEmpId = undefined;
      // }
      // setTimeout(function () {
      //   for (var i = 0; i < obj.empId.length; i++) {
      //     obj.loadCertificateById(obj.courceId);
      //   }
      // }, 2000);


    });
  }
  public onSubmit(): void {
    this.spinner.show();
    if (!this.bHasPw && this.form.valid) {
      this._loginService.login(this.form.value, undefined)
        .subscribe(user => {
          // console.log(user);
          if (user.success) {
            // console.log(this.globals.companyInfo.companyId);
            // console.log(user.data.companyId);
            if (this.globals.companyInfo.companyId == user.data.companyId) {
              //localStorage.setItem('currentUser', JSON.stringify(user.data));
              this.globals.setUserInfo(user.data);
              //console.warn(user.data);
              if (user.data.userLang != '') {
                this.translate.use(user.data.userLang);
              }
              this.loadAndShowCertificates();
            } else {
              // this.translate.get('alert.UnAuthComp').subscribe(value => { alert(value); });
              this.translate.get('alert.UnAuth').subscribe(value => { alert(value); });
              this.form.controls['password'].setValue("");
              this.spinner.hide();
            }
          } else {
            if (user.activationNeeded) {
              this.translate.get('alert.NotActivated').subscribe(value => { alert(value); });
            } else {
              this.translate.get('alert.UnAuth').subscribe(value => { alert(value); });
              this.form.controls['password'].setValue("");
            }
            this.spinner.hide();
          }
        }, error => this.errorMessage = <any>error);
    } else if (this.bHasPw) {
      this.service.checkPw(this.form.value.password, this.linkId)
        .subscribe(data => {
          if (data.success) {
            this.loadAndShowCertificates();
          } else {
            this.translate.get('certificate.WrongPw').subscribe(value => { alert(value); });
            this.spinner.hide();
          }
        }, error => this.errorMessage = <any>error);
    }
  }
  loadAndShowCertificates() {
    this.spinner.show();
    this.bShowError = false;
    this.bShowLoginBox = false;
    this.empList = [];
    this.courseId = undefined;
    this.bShowList = false;
    // console.log("LOAD AND SHOW CERTIFICATES");
    this.service.getAllCertificates(this.linkId, this.url)
      .subscribe(data => {
        if (data.success && data.empList && data.empList.length > 0) {
          // console.log(data);
          this.courseId = data.courseId;
          this.empList = data.empList;
          this.bShowList = true;
          this.empList.forEach(emp => {
            emp['certiDownloaded'] = false;
          });
          // data.empList.forEach(emp => {
          //   //this.loadCertificateById(data.courseId, emp['empId']);
          //   this.empList.push(emp['empId']);
          // });
          this.spinner.hide();
        } else {
          // this.translate.get('certificate.WrongPw').subscribe(value => { alert(value); });
          alert("NO CERTIFICATES FOUND");
          this.spinner.hide();
        }
      }, error => this.errorMessage = <any>error);
  }
  imgLoaded() {
    this.bgImgLoaded = true;
  }
  logoLoaded() {
    this.spinner.hide();
    this.logoImgLoaded = true;
  }
  downloadAllCertificates() {
    // this.empList.forEach(emp => {
    //   this.loadCertificateById(this.courseId, emp['empId']);
    // });
    if (this.globals.currentCertificateDownloadWindow) {
      this.globals.currentCertificateDownloadWindow.close();
    }
    var url = this.globals.WebURL + '/API/index.php/createpdf/download/' + this.linkId;
    var width = 400; //window.innerHeight > 500 ? window.innerHeight * 3 / 4 : 500;
    var height = 200; //window.innerHeight > 600 ? window.innerHeight - 100 : window.innerHeight;
    var strWindowSettings = 'menubar=no,toolbar=no,status=no,channelmode=yes,top=0,left=0';
    strWindowSettings += ',width=' + width + ',height=' + height;
    this.globals.currentCertificateDownloadWindow = window.open(url, "Smart-Study", strWindowSettings);
  }
  loadCertificateById(courceId, empId) {
    //this.spinner.show();
    if (this.bShowList) {
      this.empList.forEach(emp => {
        if (emp['empId'] == empId) {
          emp['certiDownloaded'] = true;
        }
      });
    }

    if (this.globals.currentCertificateDownloadWindow) {
      this.globals.currentCertificateDownloadWindow.close();
    }
    var url = this.globals.WebURL + '/API/index.php/createpdf/download/' + this.linkId + '/' + empId;
    var width = window.innerHeight > 500 ? window.innerHeight * 3 / 4 : 500;
    var height = window.innerHeight > 600 ? window.innerHeight - 100 : window.innerHeight;
    var strWindowSettings = 'menubar=no,toolbar=no,status=no,channelmode=yes,top=0,left=0';
    strWindowSettings += ',width=' + width + ',height=' + height;
    this.globals.currentCertificateDownloadWindow = window.open(url, "Smart-Study", strWindowSettings);

    // // console.log(courceId);
    // this.service.getCertificateInfo(courceId, empId).subscribe((data) => {
    //   // console.log(data);
    //   if (data.success) {
    //     this.preViewCerti(data.data[0]);
    //   } else {
    //     this.spinner.hide();
    //     this.globals.spinnerText = "";
    //   }
    // });
  }
  // preViewCerti(certi) {

  //   //console.log(certi);
  //   //this.spinner.show();
  //   var obj = this;
  //   if (certi.imgPath && certi.imgPath != 'null' && certi.imgPath != "") {
  //     obj.convertImgToBase64URL(obj.globals.WebURL + "/" + certi.imgPath, function (base64Img) {
  //       obj.base64Img = base64Img;
  //       obj.PDFTSignature(certi);
  //     }, 'image/png');
  //   } else {
  //     obj.PDFTSignature(certi);
  //   }
  // }
  // PDFTSignature(certi) {
  //   var obj = this;
  //   if (certi.TSignature && certi.TSignature != null && certi.TSignature != "") {
  //     obj.convertImgToBase64URL(obj.globals.WebURL + "/" + certi.TSignature, function (base64Img) {
  //       obj.TSignature = base64Img;
  //       obj.PDFbanner(certi);
  //     }, 'image/png');
  //   } else {
  //     obj.PDFbanner(certi);
  //   }
  // }
  // PDFbanner(certi) {
  //   var obj = this;

  //   obj.convertImgToBase64URL(obj.globals.WebURL + "/" + certi.companyLogo, function (comLogo) {
  //     obj.comLogo = comLogo;
  //     obj.PDFCertificate(certi);
  //   }, 'image/png');
  // }
  // PDFCertificate(certi) {
  //   var doc = new jsPDF();
  //   //doc.setFont('Symbol');
  //   doc.addFont('arialregular');
  //   var obj = this;
  //   obj.convertImgToBase64URL(obj.globals.WebURL + "/" + certi.SignatureimgPath, function (SignImg) {

  //     if (obj.base64Img) {
  //       doc.addImage(obj.base64Img, 'png', 0, 0, 0, 300);
  //     }
  //     if (obj.comLogo) {
  //       doc.addImage(obj.comLogo, 'png', 10, 20, 0, 20);
  //     }

  //     var nPageMiddle = doc.internal.pageSize.width / 2;

  //     var YPoint = 0;
  //     var EndDate = new Date(certi.EndTime);
  //     var EndStr = certi.dateFinished; // EndDate.getDate() + ". " + obj.numberToMonthString(EndDate.getMonth() + 1) + " " + EndDate.getFullYear();
  //     if (obj.globals.companyInfo.companyId == 33 && obj.globals.companyInfo.webUrl == "fagus-consult") {
  //       // FAGUS CERTIFICATE
  //       // ===========================================================================================
  //       doc.setFontType("bold");
  //       doc.setFontSize(30);
  //       doc.setTextColor(0, 154, 0);
  //       //doc.text(100, 50, "Teilnahmebest??tigung", null, null, 'center');
  //       doc.text("Teilnahmebest??tigung", nPageMiddle - 83, 58, { charSpace: '3.0' });

  //       doc.setFontType("bold");
  //       doc.setFontSize(27);
  //       doc.setTextColor(0, 0, 0);
  //       //doc.text(100, 60, '[Title, Sirname, Lastname]', null, null, 'center');
  //       doc.text(certi.EName, nPageMiddle, 77, { align: 'center', charSpace: '0' });

  //       doc.setFontType("normal");
  //       doc.setFontSize(16);
  //       doc.text('hat am', nPageMiddle, 88, { align: 'center', charSpace: '0' });

  //       doc.setFontType("bold");
  //       doc.setFontSize(20);
  //       doc.text(EndStr, nPageMiddle, 95, { align: 'center', charSpace: '0' });

  //       doc.setFontType("normal");
  //       doc.setFontSize(16);
  //       doc.text('an der', nPageMiddle, 101, { align: 'center', charSpace: '0' });

  //       doc.setFontType("bold");
  //       doc.setFontSize(26);
  //       doc.setTextColor(0, 154, 0);
  //       doc.text('UNTERWEISUNG', nPageMiddle - 50, 115, { charSpace: '2.0' });

  //       doc.setFontSize(13);
  //       doc.text(certi.courseName, nPageMiddle, 125, { align: 'center', charSpace: '0' });

  //       doc.setFontType("normal");
  //       doc.setFontSize(16);
  //       doc.setTextColor(0, 0, 0);
  //       if (certi.isScormCourse == '1' || certi.isScormCourse == 1) {
  //         doc.text('teilgenommen.', nPageMiddle, 135, { align: 'center', charSpace: '0' });
  //       } else {
  //         doc.text('im Ausma?? von ' + certi.CountChapter + ' Lehreinheiten teilgenommen.', nPageMiddle, 135, { align: 'center', charSpace: '0' });
  //       }

  //       if (certi.isScormCourse == '0' || certi.isScormCourse == 0) {
  //         doc.setFontSize(13);
  //         doc.text('Die Inhalte umfassten:', 27, 145);
  //         YPoint = 153;
  //         var img = new Image();   // Create new img element
  //         img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAlCAYAAAAwYKuzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAAQ2SURBVFhHvZjdS1RBGMb9R/r6A4JuCqIohZBuwm6iLoUKgm6MKOgD8jKji8jICyMSMxBJRalcK8P8iOxDDdTcXdrW1Vaz1Wx1111dT/tM5z175vMc0Xzg4czMWdaf78y8884WWZZVnHfl/3b1+/rKpyMB5TuTAYjGf1Viad4qaihjrh6ot0f9aVMAc7mU3VILUAQIB0Jv7Tfe2jAg4ILRYmsh2W+P8Ir9jnNw5PHZb/YnzNow4K/5VmsssotZBXmp67YSsKytwv6EWZ6Aa4sJuyWLokeAcHJpyH5rsSip4Mi90Y/2J/UyAuYmhqx07SH2VMkdPTKAsyv//qkzHTc4oMtv+Gj6iaIRMNN+xUpXb2MWIQEhRo88OVPFouOGgZtHA9LY4I8R+xvV0gLmpoMOHHM+kmtzk/Zby4rP1ijhyOXPL0owADwb4KPqlXa0gMv1J3jAvJebzrF3iJ4INBG/5rRffNnDQZABuN5pVgKuhvokOPLKYIsyeu71eP1VCQdBBqBqmlPZtP2XZcmAmRSbThUcnGw4wIGRk0vDTnt34zEJAgZcZ7hHGjflRAkQERKhsp1VTnuqewcHRk6lQ/lNU6KdXhiAwdmINO4fUBO9lcFWpz0ekuEIEOvwbu9BCYCsAzTtZA5wdeQlB0bOTQyzZ6J5uxIOBuDkzC3t+oMBmEgVCgeyKWFzgKqdCyO94KmbXhiA2Cinn5VKAGQAQuK4rylmp4YARobwjHzeqYSDCbAicEQCIG8IMNt9XwIjQ8u1h7XrDwYgigWvNQiJ46h4dHIAddMLQ5n2q0owMgDhB+/2SwBkHaBJDqAKjAz5BfRKM5B7DAWFSQxQOncFQ8iFXmsQRtuUqCH3WN1QMxvTyTcgcmF0wB+gbqOoAH1VM34BZzrMaYYAGz7s4yDIfdFP7Luov7epnPVN8r0GAbhQb07UBAirphmnCER9Pze8AqChQIDouAuNyXCwCHiv7ygHB4uApvxHcgAznTclMDJEgLrTBHIDjsbucHDwZD7f0VnstXtJDqDuHIYhAkw+VE8z5AbE5Qk71A0IYR2i7efCBDmAuL2JYDBOEIgA4e+jpRwcDFFNGI6dZH0UotgIbsC6oRbfV07IAYRQ0rvhYCRoyA2YDDdycJGp8+wzVFXjScKvCIA73naB9VHy+40exAGqSn0JML+ZUDdG44WTBXUghHILNz3xpxCsN4BB64kexAFC4m4mwGx3DeujqICW0kEJMBw7xe4rolAMABAbxCsxi5IAxZIfkYMAir77lwa6PM0kHuejluYu7aICoR6r/WuX3fMvCVAs+wkQbVzk3aKfPrDmsEHca08l0+1NJxkwL/daBCBV1DgSRSGdAOzn3BNp7W2GlIAQ7ejcdMhaDfdL0XNrfuG19WdxwO5trrSAhaiF2AZRRW8rpAWEsGEYYP8je2SrZVl/Ae0pH/ezBCsIAAAAAElFTkSuQmCC';
  //         for (var i = 0; i < certi.ChapterList.length; i++) {
  //           doc.addImage(img, 'png', 38, YPoint - 4, 0, 4);
  //           doc.text(44, YPoint, certi.ChapterList[i].chapterName);
  //           var lines = certi.ChapterList[i].chapterName.split("\n");
  //           if (lines.length == 1) {
  //             YPoint += 6;
  //           } else {
  //             YPoint += (lines.length) * 6;
  //           }
  //         }
  //       } else {
  //         YPoint = 153;
  //       }

  //       YPoint += 5;
  //       doc.text('Die Unterweisung umfasste folgende Verkehrstr??ger:', 27, YPoint);
  //       YPoint += 8;
  //       doc.addImage(img, 'png', 38, YPoint - 4, 0, 4);
  //       doc.text('ADR - Europ??isches ??bereinkommen ??ber die internationale Bef??rderung', 44, YPoint);

  //       YPoint = YPoint + 6;
  //       doc.text('gef??hrlicher G??ter auf der Stra??e', 60, YPoint);
  //       YPoint = YPoint + 15;
  //     } else {
  //       // STANDARD CERTIFICATE
  //       // ===========================================================================================
  //       doc.setFontType("bold");
  //       doc.setFontSize(30);
  //       doc.setTextColor(0, 0, 0);
  //       doc.text("ZERTIFIKAT", nPageMiddle, 67, { align: 'center', charSpace: '0' });

  //       doc.setFontType("bold");
  //       doc.setFontSize(27);
  //       doc.setTextColor(0, 0, 0);
  //       doc.text(certi.EName, nPageMiddle, 85, { align: 'center', charSpace: '0' });

  //       doc.setFontType("normal");
  //       doc.setFontSize(16);
  //       doc.text('hat am', nPageMiddle, 110, { align: 'center', charSpace: '0' });

  //       doc.setFontType("bold");
  //       doc.setFontSize(20);
  //       doc.text(EndStr, nPageMiddle, 118, { align: 'center', charSpace: '0' });

  //       doc.setFontType("normal");
  //       doc.setFontSize(16);
  //       doc.text('den E-Learning Kurs', nPageMiddle, 125, { align: 'center', charSpace: '0' });

  //       doc.setFontType("bold");
  //       doc.setFontSize(20);
  //       doc.text(certi.courseName, nPageMiddle, 136, { align: 'center', charSpace: '0' });

  //       doc.setFontType("normal");
  //       doc.setFontSize(16);
  //       doc.setTextColor(0, 0, 0);
  //       if (certi.isScormCourse == '1' || certi.isScormCourse == 1) {
  //         doc.text('abgeschlossen.', nPageMiddle, 145, { align: 'center', charSpace: '0' });
  //       } else {
  //         doc.text('im Ausma?? von ' + certi.CountChapter + ' Lehreinheiten abgeschlossen.', nPageMiddle, 145, { align: 'center', charSpace: '0' });
  //       }

  //       if (certi.isScormCourse == '0' || certi.isScormCourse == 0) {
  //         doc.setFontSize(13);
  //         doc.text('Die Inhalte umfassten:', 27, 160);
  //         YPoint = 168;
  //         var img = new Image();   // Create new img element
  //         img.src = 'data:image/png;base64,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';
  //         for (var i = 0; i < certi.ChapterList.length; i++) {
  //           doc.addImage(img, 'png', 38, YPoint - 4, 0, 4);
  //           doc.text(44, YPoint, certi.ChapterList[i].chapterName);
  //           var lines = certi.ChapterList[i].chapterName.split("\n");
  //           if (lines.length == 1) {
  //             YPoint += 6;
  //           } else {
  //             YPoint += (lines.length) * 6;
  //           }
  //         }
  //       } else {
  //         YPoint = 168;
  //       }

  //       YPoint += 10;
  //     }

  //     doc.text(certi.coursePlease + ', ' + EndStr, nPageMiddle, YPoint, { align: 'center', charSpace: '0' });


  //     doc.setFontSize(13);
  //     if (certi.TName != null) {
  //       if (obj.TSignature) {
  //         doc.addImage(obj.TSignature, 'png', 120, 225, 60, 0);
  //       }
  //       doc.setFontType("bold");
  //       doc.text(150, 265, certi.trainerTitle, 'center');

  //       doc.setFontType("normal");
  //       doc.setFontSize(11)
  //       doc.text(150, 270, certi.trainerPostion, 'center');
  //     }

  //     doc.addImage(SignImg, 'png', 30, 225, 60, 0);

  //     doc.setFontType("bold");
  //     doc.setFontSize(13);
  //     doc.text(60, 265, certi.bossTitleName, 'center');

  //     doc.setFontType("normal");
  //     doc.setFontSize(11)
  //     doc.text(60, 270, certi.bossPosition, 'center');

  //     // Save the PDF
  //     // doc.save('Certificater_' + certi.certificaterId + '.pdf');
  //     doc.save(obj.strCertificate + '.pdf');
  //     // obj._globals.spinnerText = "";
  //     obj.spinner.hide();
  //     obj.globals.spinnerText = "";
  //     obj.fadeIn = true;
  //   }, 'image/png');

  //   //this.spinner.hide();
  // }
  // convertImgToBase64URL(url, callback, outputFormat) {
  //   var img = new Image();
  //   img.crossOrigin = 'Anonymous';

  //   img.onload = function () {
  //     var canvas = document.createElement('canvas'),
  //       ctx = canvas.getContext('2d'), dataURL;
  //     canvas.height = img.height;
  //     canvas.width = img.width;
  //     ctx.drawImage(img, 0, 0);
  //     dataURL = canvas.toDataURL(outputFormat);
  //     callback(dataURL);
  //     canvas = null;
  //   };
  //   img.onerror = function () {
  //     callback("");
  //   };
  //   img.src = url;
  // }
  // numberToMonthString(nMonth) {
  //   var strMonth = "";

  //   switch (nMonth) {
  //     case 1: { strMonth = "Januar"; break; }
  //     case 2: { strMonth = "Februar"; break; }
  //     case 3: { strMonth = "M??rz"; break; }
  //     case 4: { strMonth = "April"; break; }
  //     case 5: { strMonth = "Mai"; break; }
  //     case 6: { strMonth = "Juni"; break; }
  //     case 7: { strMonth = "Juli"; break; }
  //     case 8: { strMonth = "August"; break; }
  //     case 9: { strMonth = "September"; break; }
  //     case 10: { strMonth = "Oktober"; break; }
  //     case 11: { strMonth = "November"; break; }
  //     case 12: { strMonth = "Dezember"; break; }
  //     default: { strMonth = "[Monat]"; break; }
  //   }

  //   return strMonth;
  // }
  ngOnDestroy() {
    this.globals.spinnerText = "";

    if (this.globals.currentCertificateDownloadWindow) {
      this.globals.currentCertificateDownloadWindow.close();
    }
  }
}
