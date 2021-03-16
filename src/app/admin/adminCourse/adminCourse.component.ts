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

    if (this._globals.userInfo.UserType == '1') {
      this.displayedColumns = ['image', 'courseName', 'sumAss', 'sumEmp', 'editDelete'];
    }

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

  loadCourse() {
    this.bLoading = true;

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

  courseImgError(event) {
    if (this._globals.companyInfo.companyLogo != null && this._globals.companyInfo.companyLogo != '') {
      event.target.src = this._globals.WebURL + '/' + this._globals.companyInfo.companyLogo;
    } else {
      event.target.src = this._globals.WebURL + "/assets/img/logoakt.png";
    }
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
    if (this._globals.getUserType() == "1") {
      this.router.navigate(['superadmin/course/add'], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "2") {
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
    this.router.navigate([path, courseId, 0], { skipLocationChange: false });
  }
  partConfirmation(obj) {
    if (this._globals.getUserType() == "2") {
      this.router.navigate(['admin/course/view', obj.courseId, 2], { skipLocationChange: false });
    } else {
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
      this.router.navigate(['admin/course/view', obj.courseId, 1], { skipLocationChange: false });
    } else {
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
