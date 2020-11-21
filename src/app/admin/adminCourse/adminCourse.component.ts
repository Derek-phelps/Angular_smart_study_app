import { Component, OnInit, ElementRef, ViewChild, TemplateRef, AfterViewInit, Renderer2 } from '@angular/core';
import { AdminCourseService } from './adminCourse.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import * as jspdf from 'jspdf';
import * as jsPDF from 'jspdf';
import { TranslateService } from '@ngx-translate/core';
import html2canvas from 'html2canvas';
import { ConfirmationBoxComponent } from '../../theme/components/confirmation-box/confirmation-box.component';
import { NgxSpinnerService } from 'ngx-spinner';
//import { TrustedStyleString } from '@angular/core/src/sanitization/bypass';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-adminCourse',
  templateUrl: './adminCourse.component.html',
  styleUrls: ['./adminCourse.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class AdminCourseComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['status', 'image', 'courseName', 'sumAss', 'sumEmp', 'editDelete'];
  isExtendedRow = (index, item) => item.extend;

  bTileView = false;
  bLoading = true;
  bCoursesFound = false;

  //public Courses = [];
  // public ExtCourses = [];
  // public ClosedCourses = [];
  public base64Img = "";
  public TSignature = "";
  public comLogo = "";
  public empReport = [];
  fileToUpload: File = null;
  public fieldName: String;
  public currentCourseTab = 0;

  public courseList: any;

  @ViewChild('fileUpload', { static: true }) public _fileUpload: ElementRef;

  // @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  // public selected: number;
  // private swipeCoord?: [number, number];
  // private swipeTime?: number;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private spinner: NgxSpinnerService, private renderer: Renderer2, private formBuilder: FormBuilder, public _globals: Globals, public router: Router,
    public dialog: MatDialog, public translate: TranslateService, public _service: AdminCourseService) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.courseList = new MatTableDataSource();
    var obj = this;
    this.courseList.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.courseName, filter);
    }

    this.spinner.hide();
  }
  filterFunction(name: string, filter: string) {
    var bMatch = true;
    var trimLowerFilter = filter.trim().toLowerCase().replace(/\s+/g, ' ');
    var splitFilter = trimLowerFilter.split(" ");
    splitFilter.forEach(filterPred => {
      if (!name.toLowerCase().includes(filterPred)) {
        bMatch = false;
      }
    });

    // (data.FIRSTNAME.toLowerCase() == filter)
    return bMatch;
  }

  ngOnInit() {
    this.loadCourse();
    // var obj = this;
    // setTimeout(function () {
    //   obj.loadCourse();
    // }, 100);
    //this.selected = this.tabGroup.selectedIndex;
  }
  ngAfterViewInit() {
    this.courseList.paginator = this.paginator;
    this.courseList.sort = this.sort;
  }
  // swipe(e: TouchEvent, when: string): void {
  //   const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
  //   const time = new Date().getTime();

  //   if (when === 'start') {
  //     this.swipeCoord = coord;
  //     this.swipeTime = time;
  //   } else if (when === 'end') {
  //     const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
  //     const duration = time - this.swipeTime;
  //     if (duration < 1000 //
  //       && Math.abs(direction[0]) > 30 // Long enough
  //       && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
  //       const swipe = direction[0] < 0 ? 'next' : 'previous';
  //       switch (swipe) {
  //         case 'previous':
  //           if (this.selected > 0) { this.selected--; }
  //           break;
  //         case 'next':
  //           if (this.selected < this.tabGroup._tabs.length - 1) { this.selected++; }
  //           break;
  //       }
  //     }
  //   }
  // }
  // tabChanged(tabChangeEvent: MatTabChangeEvent): void {
  //   //console.log(tabChangeEvent);
  //   this.currentCourseTab = tabChangeEvent.index;
  // }
  loadCourse() {
    this.bLoading = true;
    // this.Courses = [];
    // this.ExtCourses = [];
    // this.ClosedCourses = [];
    if (this._globals.getUserType() == "1") {
      this.spinner.hide();
    } else {
      this._service.getAllCourseByCompany(this._globals.companyInfo.companyId).subscribe((data) => {
        if (data.success) {
          //this.loadCourseData(data.data);
          this.courseList.data = data.data;
          this.bCoursesFound = true;
        } else {
          //this.Courses = [];
          this.bCoursesFound = false;
          var text = [
            { courseName: this.translate.instant('course.NoCourseFound'), extend: true }
          ];
          this.courseList.data = text;
        }
        this.bLoading = false;
      });
    }
    // } else if (this._globals.getUserType() == "2") {
    //   this._service.getAllCourseByCompany(this._globals.companyInfo.companyId).subscribe((data) => {
    //     if (data.success) {
    //       //this.loadCourseData(data.data);
    //       this.courseList.data = data.data;
    //       this.bCoursesFound = true;
    //     } else {
    //       //this.Courses = [];
    //       this.bCoursesFound = false;
    //       var text = [
    //         { courseName: this.translate.instant('course.NoCourseFound'), extend: true }
    //       ];
    //       this.courseList.data = text;
    //     }
    //     this.bLoading = false;
    //   });
    // } else if (this._globals.getUserType() == "3") {
    //   // this._service.getAllCourseByTrainer().subscribe((data) => {
    //   //   if (data.success) {
    //   //     this.loadCourseData(data.data);
    //   //   } else {
    //   //     this.Courses = [];
    //   //   }
    //   //   this.spinner.hide();
    //   // });
    // } else if (this._globals.getUserType() == "4") {
    //   // this._service.getAllCourseByUser().subscribe((data) => {
    //   //   if (data.success) {
    //   //     this.loadCourseData(data.data);
    //   //   } else {
    //   //     this.Courses = [];
    //   //   }
    //   //   this.spinner.hide();
    //   // });
    // } else {
    //   // Unknown user type
    //   //this.Courses = [];
    //   this.spinner.hide();
    // }
  }
  // loadCourseData(data) {
  //   this.Courses = [];
  //   this.ExtCourses = [];
  //   this.ClosedCourses = [];
  //   var dt1 = new Date();
  //   for (var i = 0; i < data.length; i++) {
  //     var dt2 = new Date(data[i].EndTime);

  //     var diffDays = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));

  //     if (data[i].isClosed == 0) {
  //       if (dt2.toString() == 'Invalid Date' || diffDays > -1) {
  //         this.Courses.push(data[i]);
  //       } else {
  //         this.ExtCourses.push(data[i]);
  //       }
  //     } else {
  //       this.ClosedCourses.push(data[i]);
  //     }
  //   }
  // }
  courseImgError(event) {
    //img.src = this._globals.IMAGEURL+'Company/'+this._globals.companyInfo.companyLogo;
    //return 'assets/img/logoakt.png';
    //event.target.src = this._globals.IMAGEURL+'Company/'+this._globals.companyInfo.companyLogo;
    //event.target.src = this._globals.IMAGEURL + 'Company/background/' + this._globals.companyInfo.BackgroundImage;
    if (this._globals.companyInfo.companyLogo != null && this._globals.companyInfo.companyLogo != '') {
      event.target.src = this._globals.WebURL + '/' + this._globals.companyInfo.companyLogo;
    } else {
      event.target.src = this._globals.WebURL + "/assets/img/logoakt.png";
    }
    //event.target.className = 'default-img';
  }
  applyCourseFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.courseList.filter = filterValue;

    if (this.courseList.paginator) {
      this.courseList.paginator.firstPage();
    }
  }
  closeCourse(courseId) {
    this.translate.get('dialog.CloseCourseSure').subscribe(value => {
      //alert(value);
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: courseId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.spinner.show();
          this._service.setClosedState(courseId, 1).subscribe((data) => {
            if (data.success) {
              this.loadCourse();
            }
            this.spinner.hide();
          });
        }
      });
    });
  }
  reopenCourse(courseId) {
    this.translate.get('dialog.ReOpenCourseSure').subscribe(value => {
      //alert(value);
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: courseId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.spinner.show();
          this._service.setClosedState(courseId, 0).subscribe((data) => {
            if (data.success) {
              this.loadCourse();
            } else {
              this.spinner.hide();
            }
          });
        }
      });
    });
  }
  deleteCourse(courseId) {
    this.translate.get('dialog.DeleteCourseSure').subscribe(value => {
      //alert(value);
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: courseId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.spinner.show();
          this._service.delete(courseId).subscribe((data) => {
            if (data.success) {
              this.loadCourse();
            }
            this.spinner.hide();
          });
        }
      });
    });
  }
  editCourse(courseId) {
    if (this._globals.getUserType() == "1") {
      this.router.navigate(['superadmin/course/edit', courseId], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "2") {
      this.router.navigate(['admin/course/edit', courseId], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "3") {
      this.router.navigate(['trainer/course/edit', courseId], { skipLocationChange: false });
    } else {
      this.router.navigate(['employee/course/edit', courseId], { skipLocationChange: false });
    }
  }
  signUpParticipants(obj) {
    if (this._globals.getUserType() == "2") {
      this.router.navigate(['admin/course/signup', obj.courseId], { skipLocationChange: false });
    } else {
      this.router.navigate(['employee/course/signup', obj.courseId], { skipLocationChange: false });
    }
  }
  addCourse() {
    if (this._globals.getUserType() == "2") {
      this.router.navigate(['admin/course/add'], { skipLocationChange: false });
    } else {
      this.router.navigate(['employee/course/add'], { skipLocationChange: false });
    }
  }
  viewCourse(courseId) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/course/view';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/course/view';
    } else {
      path = 'employee/course/view';
    }
    //this.router.navigate([path + this.CourseData.hasCertificate], { skipLocationChange: false });
    this.router.navigate([path, courseId, 0], { skipLocationChange: false });
  }
  partConfirmation(obj) {
    // if (this._globals.getUserType() == "2") {
    //   this.router.navigate(['admin/course/confirmation', obj.courseId]);
    // } else {
    //   this.router.navigate(['trainer/course/confirmation', obj.courseId]);
    // }
    if (this._globals.getUserType() == "2") {
      //this.router.navigate(['admin/course/confirmation', obj.courseId]);
      this.router.navigate(['admin/course/view', obj.courseId, 2], { skipLocationChange: false });
    } else {
      //this.router.navigate(['trainer/course/confirmation', obj.courseId]);
      this.router.navigate(['trainer/course/view', obj.courseId, 2], { skipLocationChange: false });
    }
  }
  duplicatCourse(obj) {
    if (this._globals.getUserType() == "2") {
      this.router.navigate(['admin/course/duplicatCourse', obj.courseId], { skipLocationChange: false });
    } else {
      this.router.navigate(['trainer/course/duplicatCourse', obj.courseId], { skipLocationChange: false });
    }
  }
  participantList(obj) {
    if (this._globals.getUserType() == "2") {
      //this.router.navigate(['admin/course/participantList', obj.courseId]);
      this.router.navigate(['admin/course/view', obj.courseId, 1], { skipLocationChange: false });
    } else {
      //this.router.navigate(['trainer/course/participantList', obj.courseId]);
      this.router.navigate(['trainer/course/view', obj.courseId, 1], { skipLocationChange: false });
    }
  }
  setPDF() {
    // var data1 = document.getElementById('contentToConvert');
    // html2canvas(data1).then(canvas => {
    //   // Few necessary setting options  
    //   var imgWidth = 208;
    //   var pageHeight = 295;
    //   var imgHeight = canvas.height * imgWidth / canvas.width;
    //   var heightLeft = imgHeight;

    //   const contentDataURL = canvas.toDataURL('image/png')
    //   let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
    //   pdf.addFont('arialregular');
    //   var position = 0;
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    //   pdf.save('MYPdf.pdf'); // Generated PDF   
    //   this.empReport = [];
    // });
  }
  downloadEmp() {

    this._service.getCompanyAllEmpReport().subscribe((data) => {
      if (data.success) {
        this.empReport = data.OpenQuery
        var obj = this;
        setTimeout(function () {
          obj.setPDF();
        }, 200);


      } else {
        this.translate.get('alert.NoDataFound').subscribe(value => { alert(value); });
      }
    });
  }
  startSpinner() {
    this.spinner.show();
  }
  preViewCerti(certi) {

    var obj = this;
    if (certi.imgPath) {
      obj.convertImgToBase64URL(obj._globals.WebURL + "/" + certi.imgPath, function (base64Img) {
        obj.base64Img = base64Img;
        obj.PDFTSignature(certi);
      }, 'image/png');
    } else {
      obj.PDFTSignature(certi);
    }
  }
  PDFTSignature(certi) {
    var obj = this;
    if (certi.TSignature) {
      obj.convertImgToBase64URL(obj._globals.WebURL + "/" + certi.imgPath, function (base64Img) {
        obj.TSignature = base64Img;
        obj.PDFbanner(certi);
      }, 'image/png');
    } else {
      obj.PDFbanner(certi);
    }
  }
  PDFbanner(certi) {
    var obj = this;
    obj.convertImgToBase64URL(obj._globals.WebURL + "/" + certi.companyLogo, function (comLogo) {
      obj.comLogo = comLogo;
      obj.PDFCertificate(certi);
    }, 'image/png');
  }
  PDFCertificate(certi) {
    // var doc = new jsPDF();
    // //doc.setFont('Symbol');
    // doc.addFont('arialregular');
    // var obj = this;
    // obj.convertImgToBase64URL(obj._globals.WebURL + "/" + certi.SignatureimgPath, function (SignImg) {

    //   if (obj.base64Img) {
    //     doc.addImage(obj.base64Img, 'png', 0, 0, 0, 300);
    //   }
    //   if (obj.comLogo) {
    //     doc.addImage(obj.comLogo, 'png', 10, 20, 0, 20);
    //   }

    //   var nPageMiddle = doc.internal.pageSize.width / 2;

    //   var YPoint = 0;
    //   var EndDate = new Date(certi.EndTime);
    //   var EndStr = EndDate.getDate() + ". " + obj.numberToMonthString(EndDate.getMonth() + 1) + " " + EndDate.getFullYear();
    //   if (obj._globals.companyInfo.companyId == 33 && obj._globals.companyInfo.webUrl == "fagus-consult") {
    //     // FAGUS CERTIFICATE
    //     // ===========================================================================================
    //     doc.setFontType("bold");
    //     doc.setFontSize(30);
    //     doc.setTextColor(0, 154, 0);
    //     //doc.text(100, 50, "Teilnahmebestätigung", null, null, 'center');
    //     doc.text("Teilnahmebestätigung", nPageMiddle - 83, 58, { charSpace: '3.0' });

    //     doc.setFontType("bold");
    //     doc.setFontSize(27);
    //     doc.setTextColor(0, 0, 0);
    //     //doc.text(100, 60, '[Title, Sirname, Lastname]', null, null, 'center');
    //     doc.text('[Titel Vorname NACHNAME]', nPageMiddle, 77, { align: 'center', charSpace: '0' });

    //     doc.setFontType("normal");
    //     doc.setFontSize(16);
    //     doc.text('hat am', nPageMiddle, 88, { align: 'center', charSpace: '0' });

    //     doc.setFontType("bold");
    //     doc.setFontSize(20);
    //     doc.text(EndStr, nPageMiddle, 95, { align: 'center', charSpace: '0' });

    //     doc.setFontType("normal");
    //     doc.setFontSize(16);
    //     doc.text('an der', nPageMiddle, 101, { align: 'center', charSpace: '0' });

    //     doc.setFontType("bold");
    //     doc.setFontSize(26);
    //     doc.setTextColor(0, 154, 0);
    //     doc.text('UNTERWEISUNG', nPageMiddle - 50, 115, { charSpace: '2.0' });

    //     doc.setFontSize(13);
    //     doc.text(certi.courseName, nPageMiddle, 125, { align: 'center', charSpace: '0' });

    //     doc.setFontType("normal");
    //     doc.setFontSize(16);
    //     doc.setTextColor(0, 0, 0);
    //     doc.text('im Ausmaß von ' + certi.CountChapter + ' Lehreinheiten teilgenommen.', nPageMiddle, 135, { align: 'center', charSpace: '0' });

    //     doc.setFontSize(13);
    //     doc.text('Die Inhalte umfassten:', 27, 145);
    //     var YPoint = 153;
    //     var img = new Image();   // Create new img element
    //     img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAlCAYAAAAwYKuzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAAQ2SURBVFhHvZjdS1RBGMb9R/r6A4JuCqIohZBuwm6iLoUKgm6MKOgD8jKji8jICyMSMxBJRalcK8P8iOxDDdTcXdrW1Vaz1Wx1111dT/tM5z175vMc0Xzg4czMWdaf78y8884WWZZVnHfl/3b1+/rKpyMB5TuTAYjGf1Viad4qaihjrh6ot0f9aVMAc7mU3VILUAQIB0Jv7Tfe2jAg4ILRYmsh2W+P8Ir9jnNw5PHZb/YnzNow4K/5VmsssotZBXmp67YSsKytwv6EWZ6Aa4sJuyWLokeAcHJpyH5rsSip4Mi90Y/2J/UyAuYmhqx07SH2VMkdPTKAsyv//qkzHTc4oMtv+Gj6iaIRMNN+xUpXb2MWIQEhRo88OVPFouOGgZtHA9LY4I8R+xvV0gLmpoMOHHM+kmtzk/Zby4rP1ijhyOXPL0owADwb4KPqlXa0gMv1J3jAvJebzrF3iJ4INBG/5rRffNnDQZABuN5pVgKuhvokOPLKYIsyeu71eP1VCQdBBqBqmlPZtP2XZcmAmRSbThUcnGw4wIGRk0vDTnt34zEJAgZcZ7hHGjflRAkQERKhsp1VTnuqewcHRk6lQ/lNU6KdXhiAwdmINO4fUBO9lcFWpz0ekuEIEOvwbu9BCYCsAzTtZA5wdeQlB0bOTQyzZ6J5uxIOBuDkzC3t+oMBmEgVCgeyKWFzgKqdCyO94KmbXhiA2Cinn5VKAGQAQuK4rylmp4YARobwjHzeqYSDCbAicEQCIG8IMNt9XwIjQ8u1h7XrDwYgigWvNQiJ46h4dHIAddMLQ5n2q0owMgDhB+/2SwBkHaBJDqAKjAz5BfRKM5B7DAWFSQxQOncFQ8iFXmsQRtuUqCH3WN1QMxvTyTcgcmF0wB+gbqOoAH1VM34BZzrMaYYAGz7s4yDIfdFP7Luov7epnPVN8r0GAbhQb07UBAirphmnCER9Pze8AqChQIDouAuNyXCwCHiv7ygHB4uApvxHcgAznTclMDJEgLrTBHIDjsbucHDwZD7f0VnstXtJDqDuHIYhAkw+VE8z5AbE5Qk71A0IYR2i7efCBDmAuL2JYDBOEIgA4e+jpRwcDFFNGI6dZH0UotgIbsC6oRbfV07IAYRQ0rvhYCRoyA2YDDdycJGp8+wzVFXjScKvCIA73naB9VHy+40exAGqSn0JML+ZUDdG44WTBXUghHILNz3xpxCsN4BB64kexAFC4m4mwGx3DeujqICW0kEJMBw7xe4rolAMABAbxCsxi5IAxZIfkYMAir77lwa6PM0kHuejluYu7aICoR6r/WuX3fMvCVAs+wkQbVzk3aKfPrDmsEHca08l0+1NJxkwL/daBCBV1DgSRSGdAOzn3BNp7W2GlIAQ7ejcdMhaDfdL0XNrfuG19WdxwO5trrSAhaiF2AZRRW8rpAWEsGEYYP8je2SrZVl/Ae0pH/ezBCsIAAAAAElFTkSuQmCC';
    //     for (var i = 0; i < certi.ChapterList.length; i++) {
    //       doc.addImage(img, 'png', 38, YPoint - 4, 0, 4);
    //       doc.text(44, YPoint, certi.ChapterList[i].chapterName);
    //       var lines = certi.ChapterList[i].chapterName.split("\n");
    //       if (lines.length == 1) {
    //         YPoint += 6;
    //       } else {
    //         YPoint += (lines.length) * 6;
    //       }
    //     }

    //     YPoint += 5;
    //     doc.text('Die Unterweisung umfasste folgende Verkehrsträger:', 27, YPoint);
    //     YPoint += 8;
    //     doc.addImage(img, 'png', 38, YPoint - 4, 0, 4);
    //     doc.text('ADR - Europäisches Übereinkommen über die internationale Beförderung', 44, YPoint);

    //     YPoint = YPoint + 6;
    //     doc.text('gefährlicher Güter auf der Straße', 60, YPoint);
    //     YPoint = YPoint + 15;
    //   } else {
    //     // STANDARD CERTIFICATE
    //     // ===========================================================================================
    //     doc.setFontType("bold");
    //     doc.setFontSize(30);
    //     doc.setTextColor(0, 0, 0);
    //     doc.text("ZERTIFIKAT", nPageMiddle, 67, { align: 'center', charSpace: '0' });

    //     doc.setFontType("bold");
    //     doc.setFontSize(27);
    //     doc.setTextColor(0, 0, 0);
    //     doc.text("[Titel Vorname NACHNAME]", nPageMiddle, 85, { align: 'center', charSpace: '0' });

    //     doc.setFontType("normal");
    //     doc.setFontSize(16);
    //     doc.text('hat am', nPageMiddle, 110, { align: 'center', charSpace: '0' });

    //     doc.setFontType("bold");
    //     doc.setFontSize(20);
    //     doc.text(EndStr, nPageMiddle, 118, { align: 'center', charSpace: '0' });

    //     doc.setFontType("normal");
    //     doc.setFontSize(16);
    //     doc.text('den E-Learning Kurs', nPageMiddle, 125, { align: 'center', charSpace: '0' });

    //     doc.setFontType("bold");
    //     doc.setFontSize(20);
    //     doc.text(certi.courseName, nPageMiddle, 136, { align: 'center', charSpace: '0' });

    //     doc.setFontType("normal");
    //     doc.setFontSize(16);
    //     doc.setTextColor(0, 0, 0);
    //     doc.text('im Ausmaß von ' + certi.CountChapter + ' Lehreinheiten abgeschlossen.', nPageMiddle, 145, { align: 'center', charSpace: '0' });

    //     doc.setFontSize(13);
    //     doc.text('Die Inhalte umfassten:', 27, 160);
    //     YPoint = 168;
    //     var img = new Image();   // Create new img element
    //     img.src = 'data:image/png;base64,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';
    //     for (var i = 0; i < certi.ChapterList.length; i++) {
    //       doc.addImage(img, 'png', 38, YPoint - 4, 0, 4);
    //       doc.text(44, YPoint, certi.ChapterList[i].chapterName);
    //       var lines = certi.ChapterList[i].chapterName.split("\n");
    //       if (lines.length == 1) {
    //         YPoint += 6;
    //       } else {
    //         YPoint += (lines.length) * 6;
    //       }
    //     }

    //     YPoint += 10;
    //   }

    //   doc.text(certi.coursePlease + ', ' + EndStr, nPageMiddle, YPoint, { align: 'center', charSpace: '0' });

    //   doc.setFontSize(13);
    //   if (certi.TName != null) {
    //     if (obj.TSignature) {
    //       doc.addImage(obj.TSignature, 'png', 120, 225, 60, 0);
    //     }
    //     doc.setFontType("bold");
    //     doc.text(150, 265, certi.trainerTitle, 'center');

    //     doc.setFontType("normal");
    //     doc.setFontSize(11)
    //     doc.text(150, 270, certi.trainerPostion, 'center');
    //   }

    //   doc.addImage(SignImg, 'png', 30, 225, 60, 0);

    //   doc.setFontType("bold");
    //   doc.setFontSize(13);
    //   doc.text(60, 265, certi.bossTitleName, 'center');

    //   doc.setFontType("normal");
    //   doc.setFontSize(11)
    //   doc.text(60, 270, certi.bossPosition, 'center');

    //   // Save the PDF
    //   doc.save('Certificater_' + certi.certificaterId + '.pdf');
    // }, 'image/png');
  }
  convertImgToBase64URL(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'), dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.onerror = function () {
      callback("");
    };

    img.src = url;
  }

  numberToMonthString(nMonth) {
    var strMonth = "";

    switch (nMonth) {
      case 1: { strMonth = "Januar"; break; }
      case 2: { strMonth = "Februar"; break; }
      case 3: { strMonth = "März"; break; }
      case 4: { strMonth = "April"; break; }
      case 5: { strMonth = "Mai"; break; }
      case 6: { strMonth = "Juni"; break; }
      case 7: { strMonth = "Juli"; break; }
      case 8: { strMonth = "August"; break; }
      case 9: { strMonth = "September"; break; }
      case 10: { strMonth = "Oktober"; break; }
      case 11: { strMonth = "November"; break; }
      case 12: { strMonth = "Dezember"; break; }
      default: { strMonth = "[Monat]"; break; }
    }

    return strMonth;
  }
}
