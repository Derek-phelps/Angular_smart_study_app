import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef, EventEmitter, AfterViewInit, Inject, ViewEncapsulation, Renderer2 } from '@angular/core';
import { AdminEmployeeService } from './adminEmployee.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ConfirmationBoxComponent } from '../../theme/components/confirmation-box/confirmation-box.component';
import { Router } from '@angular/router';
import { Globals } from '../../common/auth-guard.service';
import { UploadInput, UploadOutput } from 'ngx-uploader';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { download } from '../../download/download.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'app-AdminEmployee',
  templateUrl: './adminEmployee.component.html',
  styleUrls: ['./adminEmployee.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class AdminEmployeeComponent implements OnInit, AfterViewInit {
  // displayedColumns: string[] = ['status', 'name', 'admin', 'email', 'groups', 'departments', 'editDelete'];
  displayedColumns: string[] = ['status', 'LASTNAME', 'FIRSTNAME', 'email', 'groups', 'departments', 'editDelete'];
  @ViewChild('container', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;

  bLoading = true;
  bListView = true;

  bEmpEntriesFound = false;

  public base64Img = "";
  //public employes = [];
  employeeList: any;
  fullEmpList: any;
  public courseList = [];
  public selectedCourse = "";
  public selectedDate = "";
  public assCourseId = "";
  public selectedEditItem = 0;
  fileToUpload: File = null;
  public TSignature = "";
  public comLogo = "";
  uploadInput: EventEmitter<UploadInput>;
  FileuploadInput: UploadInput = {
    type: 'uploadAll',
    url: '',
    method: 'POST',
    data: {}
  };
  @ViewChild('fileUpload', { static: true }) public _fileUpload: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private renderer: Renderer2, private translate: TranslateService, private spinner: NgxSpinnerService, public _globals: Globals,
    public router: Router, public dialog: MatDialog, public _service: AdminEmployeeService,
    private componentFactoryResolver: ComponentFactoryResolver, private snackbar: MatSnackBar) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.FileuploadInput.url = this._globals.APIURL + 'Employees/uploadExcelFile?companyId=' + this._globals.companyInfo.companyId;

    this.employeeList = new MatTableDataSource();

    // var obj = this;
    // this.employeeList.filterPredicate = function (data: any, filter: string): boolean {
    //   return obj.filterFunction(data.name, filter);
    // }

    this.spinner.hide();
  }
  applyEmpFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employeeList.filter = filterValue;

    if (this.employeeList.paginator) {
      this.employeeList.paginator.firstPage();
    }
  }
  // applyFilter(filterValue: string) {
  //   var filterVals = filterValue.trim().toLocaleLowerCase().split(" ");
  //   for (var i = 0; i < this.employes.length; ++i) {
  //     var cmpStr = this.employes[i].FIRSTNAME + this.employes[i].LASTNAME;
  //     var dispEmp = true;
  //     for (var j = 0; j < filterVals.length; ++j) {
  //       if (!cmpStr.toLowerCase().includes(filterVals[j])) {
  //         dispEmp = false;
  //       }
  //     }
  //     this.employes[i].dispEmp = dispEmp;
  //   }
  // }
  uploadEmp() {
    this._fileUpload.nativeElement.value = '';
    this._fileUpload.nativeElement.click();
  }
  downloadTemplate() {
    if (this.translate.currentLang == 'de') {
      saveAs('./assets/excel-templates/Smart-Study_Mitarbeiter.xlsx', 'Smart-Study_Mitarbeiter.xlsx');
    } else {
      saveAs('./assets/excel-templates/Smart-Study_Employees.xlsx', 'Smart-Study_Employees.xlsx');
    }
  }
  ngOnInit() {
    this.spinner.show();
    this.loadEmp();
  }
  ngAfterViewInit() {
    this.employeeList.paginator = this.paginator;
    this.employeeList.sort = this.sort;

    var obj = this;
    this.employeeList.filterPredicate = function (data: any, filter: string): boolean {
      var bFilterRet = obj.filterFunction(data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter);
      if (!bFilterRet && data.EmailID) {
        bFilterRet = obj.filterFunction(data.EmailID, filter);
      }
      return bFilterRet;
    }

    this.employeeList.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name': {
          return item.FIRSTNAME.toLocaleLowerCase();
        }
        case 'email': {
          return item.EmailID.toLocaleLowerCase();
        }
        default: {
          return item[property];
        }
      }
    };
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
  loadCourse() {
    this._service.getAllCourseByCompany(this._globals.companyInfo.companyId).subscribe((data) => {
      if (data.success) {
        //console.log(data.data);
        this.courseList = data.data;
      } else {
        this.courseList = [];
      }
      this.bLoading = false;
      this.spinner.hide();
    });
  }
  loadEmp() {
    this.bLoading = true;
    this.bEmpEntriesFound = false;
    this.employeeList.data = [];
    this.fullEmpList = [];
    this._service.get(this._globals.companyInfo.companyId, true).subscribe((data) => {
      if (data.success) {
        // this.employeeList.data = data.data;
        if (data.data.length > 0) {
          this.bEmpEntriesFound = true;
        }
        this.fullEmpList = data.data;
        this.setEmpList(this._globals.empFilter);
        this.loadCourse();
      }
    });
  }
  preViewCerti(courseId, empId) {
    this._globals.certificaterCourseId = courseId;
    this._globals.certificaterEmpId = empId;
    const factory = this.componentFactoryResolver.resolveComponentFactory(download);
    this.viewContainerRef.clear();
    const ref = this.viewContainerRef.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
  viewEmp(emp) {
    this.spinner.show();
    var userType = this._globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/employees', emp.empId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/employees', emp.empId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/employees', emp.empId], { skipLocationChange: false });
    } else {
      //this.router.navigate(['./trainer/employees', group.groupId], { skipLocationChange: false });
    }
  }


  PDFTSignature(certi) {
    var obj = this;
    if (certi.TSignature && certi.TSignature != null && certi.TSignature != "") {
      obj.convertImgToBase64URL(obj._globals.WebURL + "/" + certi.TSignature, function (TSignature) {
        obj.TSignature = TSignature;
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
    //     doc.text(certi.EName, nPageMiddle, 77, { align: 'center', charSpace: '0' });

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
    //     doc.text('gefährlicher Güter auf der Straße', 58, YPoint);
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
    //     doc.text(certi.EName, nPageMiddle, 85, { align: 'center', charSpace: '0' });

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

    this.spinner.hide();
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
  addCompany() {
    this.spinner.show();
    this.router.navigate(['admin/employees/add'], { skipLocationChange: false });
  }
  editCompany(obj) {
    this.spinner.show();
    this.router.navigate(['admin/employees/edit/' + obj.positionId], { skipLocationChange: false });
  }
  deleteEmp(EmpId) {
    this.translate.get('dialog.DeleteEmpSure').subscribe(value => {
      //alert(value);
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: EmpId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          //alert("TODO");
          this.spinner.show();
          this._service.delete(EmpId).subscribe((res) => {
            if (res.success) {
              this.loadEmp()
            }
            this.spinner.hide();
          });
        }
      });
    });
  }
  editEmp(emp) {
    this.spinner.show();
    var userType = this._globals.getUserType();
    if (userType == "1") {
      this.router.navigate(['./superadmin/employees/edit', emp.empId], { skipLocationChange: false });
    } else if (userType == "2") {
      this.router.navigate(['./admin/employees/edit', emp.empId], { skipLocationChange: false });
    } else if (userType == "3") {
      this.router.navigate(['./trainer/employees/edit', emp.empId], { skipLocationChange: false });
    } else {
      this.router.navigate(['./trainer/employees/edit', emp.empId], { skipLocationChange: false });
    }
  }
  // addCourse(id) {
  //   this.selectedEditItem = 0
  //   for (var i = 0; i < this.employes.length; i++) {
  //     if (this.employes[i].empId == id) {
  //       if (this.employes[i].AddCourse) {
  //         this.employes[i].AddCourse = 0;
  //         this.employes[i].CurrentCourse = 1;
  //         this.employes[i].Certificate = 1;
  //       } else {
  //         this.employes[i].AddCourse = 1;
  //         this.employes[i].CurrentCourse = 1;
  //         this.employes[i].Certificate = 1;
  //         this.selectedCourse = "";
  //       }
  //     } else {
  //       this.employes[i].AddCourse = 1;
  //       this.employes[i].CurrentCourse = 1;
  //       this.employes[i].Certificate = 1;
  //     }
  //   }
  // }
  // displayCurrentCourse(id) {
  //   this.spinner.show();
  //   for (var i = 0; i < this.employes.length; i++) {
  //     if (this.employes[i].empId == id) {
  //       if (this.employes[i].CurrentCourse) {
  //         this.employes[i].CurrentCourse = 0;
  //         this.employes[i].Certificate = 1;
  //         this.employes[i].AddCourse = 1;

  //         if (this.employes[i].CurrentCourseList.length == 0) {
  //           var EmpIndex = i;
  //           this._service.getloadCourseByEmp(id).subscribe((data) => {
  //             this.employes[EmpIndex].CurrentCourseList = [];
  //             if (data.success) {
  //               //this.employes[EmpIndex].CurrentCourseList = data.data;
  //               data.data.forEach(element => {
  //                 if (element.isCompleted != '1') {
  //                   this.employes[EmpIndex].CurrentCourseList.push(element);
  //                 }
  //               });
  //             }
  //             this.spinner.hide();
  //           });
  //         } else {
  //           this.spinner.hide();
  //         }
  //       } else {
  //         this.employes[i].CurrentCourse = 1;
  //         this.employes[i].AddCourse = 1;
  //         this.employes[i].Certificate = 1;
  //         this.spinner.hide();
  //       }
  //     } else {
  //       this.employes[i].CurrentCourse = 1;
  //       this.employes[i].AddCourse = 1;
  //       this.employes[i].Certificate = 1;
  //     }
  //   }
  // }
  // displayCertificate(id) {
  //   this.spinner.show();
  //   for (var i = 0; i < this.employes.length; i++) {
  //     if (this.employes[i].empId == id) {
  //       if (this.employes[i].Certificate) {
  //         this.employes[i].CurrentCourse = 1;
  //         this.employes[i].AddCourse = 1;
  //         this.employes[i].Certificate = 0;
  //         if (this.employes[i].CertificateList.length == 0) {
  //           var EmpCer = i;
  //           this._service.getloadCertificateByEmp(id).subscribe((data) => {
  //             if (data.success) {
  //               //console.log(data.data);
  //               this.employes[EmpCer].CertificateList = data.data
  //             } else {
  //               this.employes[EmpCer].CertificateList = []
  //             }
  //             this.spinner.hide();
  //           });
  //         } else {
  //           this.spinner.hide();
  //         }
  //       } else {
  //         this.employes[i].CurrentCourse = 1;
  //         this.employes[i].AddCourse = 1;
  //         this.employes[i].Certificate = 1;
  //         this.spinner.hide();
  //       }
  //     } else {
  //       this.employes[i].CurrentCourse = 1;
  //       this.employes[i].AddCourse = 1;
  //       this.employes[i].Certificate = 1;
  //     }
  //   }

  // }

  saveCourse(id, obj) {
    if (this.selectedCourse != "") {
      if (this.selectedEditItem == 0) {
        this._service.saveEmpCouse(this.selectedCourse, id).subscribe((data) => {
          if (data.success) {
            this.selectedCourse = "";
            this.selectedDate = "";
            obj.AddCourse = 1;
            //alert(data.data);
            this.translate.get('alert.AddCourseEmpSuccess').subscribe(value => { alert(value); });
          } else {
            if (data.code) {
              if (data.code == 1) {
                this.translate.get('alert.AddCourseEmpFailDuplicate').subscribe(value => { alert(value); });
              } else {
                this.translate.get('alert.AddCourseEmpFail').subscribe(value => { alert(value); });
              }
            } else {
              this.translate.get('alert.AddCourseEmpFail').subscribe(value => { alert(value); });
            }
          }
        });
      } else {
        // this._service.editEmpCouse(this.selectedCourse, id, this.selectedDate, this.selectedEditItem).subscribe((data) => {
        //   if (data.success) {
        //     this.selectedCourse = "";
        //     this.selectedDate = "";
        //     this.selectedEditItem = 0;
        //     obj.AddCourse = 1;
        //     obj.CurrentCourseList = [];
        //     this.translate.get('alert.EditEmpCourseAssSuccess').subscribe(value => { alert(value); });
        //   } else {
        //     this.translate.get('alert.EditEmpCourseAssFail').subscribe(value => { alert(value); });
        //   }
        // });
      }
    }
  }
  // EditAssEmp(EditItem, emp) {
  //   emp.AddCourse = 0
  //   emp.CurrentCourse = 1
  //   this.selectedCourse = EditItem.courseId
  //   this.selectedDate = EditItem.startDate
  //   this.selectedEditItem = EditItem.emp_courseId
  // }
  // deleteAssEmp(DeleteId, empId, emp) {
  //   this.spinner.show();
  //   this._service.deleteEmpCouse(DeleteId).subscribe((data) => {
  //     if (data.success) {
  //       //alert(data.data);
  //       this.translate.get('alert.DelCourseEmpSuccess').subscribe(value => { alert(value); });
  //       emp.CurrentCourseList = [];
  //       this.displayCurrentCourse(empId)
  //       emp.CurrentCourse == 0;
  //     } else {
  //       if (data.code && data.code == 'mandDepOrPosAss') {
  //         this.translate.get('alert.DelCourseEmpFailDepOrPosAss').subscribe(value => { alert(value); });
  //       } else if (data.code && data.code == 'empFinished') {
  //         this.translate.get('alert.DelCourseEmpFailFinished').subscribe(value => { alert(value); });
  //       } else {
  //         this.translate.get('alert.DelCourseEmpFail').subscribe(value => { alert(value); });
  //       }
  //     }
  //     this.spinner.hide();
  //   });
  // }
  editCourse(id) {
    this._service.editEmpCouse(this.selectedCourse, id, this.selectedDate, this.assCourseId).subscribe((data) => {
      if (data.success) {
        this.selectedCourse = "";
        this.selectedDate = "";
        alert(data.mes);
      }
    });
  }
  // downloadExampleExcel() {
  //   // if (format != 'zip' && format != 'excel') {
  //   //   return false;
  //   // }
  //   this.spinner.show();
  //   //console.log("Download example ZIP");

  //   var data: any;
  //   data = [{
  //     "Chapter ID": '[Chapter ID of the desired chapter (you can find the chapter IDs on the second sheet)]',
  //     "isTraining": '[1 => training question, 0 => final exam question]',
  //     "Question": '[Your question]',
  //     "Correct Answers": '[Correct answer options]',
  //     "Answer Option 0": '[Answer option text]',
  //     "Answer Option 1": '[Answer option text]',
  //     "Answer Option 2": '[Answer option text]',
  //     "Answer Option 3": '[Answer option text]',
  //     "Answer Option 4": '[Answer option text]',
  //     "Image file name": '[Image file name]',
  //     "Explanation": '[Explanation of the question]'
  //   }, {
  //     "Chapter ID": 'XXXX',
  //     "isTraining": '1',
  //     "Question": 'Example question with four answer options and correct answer options 0, 1 and 2.',
  //     "Correct Answers": '0@1@2',
  //     "Answer Option 0": 'Answer option 0',
  //     "Answer Option 1": 'Answer option 1',
  //     "Answer Option 2": 'Answer option 2',
  //     "Answer Option 3": 'Answer option 3',
  //     "Answer Option 4": '',
  //     "Image file name": 'example_image.png',
  //     "Explanation": 'Example question explanation'
  //   }];
  //   // if (this._globals.userInfo.userLang == "de") {
  //   //   data = [{
  //   //     "Kapitel ID": ''
  //   //   }];
  //   // } else {
  //   //   data = [{
  //   //     "Chapter ID": ''
  //   //   }];
  //   // }

  //   var worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  //   var chapterListData = [];
  //   for (var i = 0; i < this.dataSourceChapter.filteredData.length; ++i) {
  //     var chapter = this.dataSourceChapter.filteredData[i];
  //     // if (chapter.is_offline == 0) {
  //     chapterListData.push({
  //       "Chapter ID": chapter.chapterId,
  //       "Chapter name": chapter.chapterName
  //     });
  //     // }
  //   }
  //   var worksheetChapters: XLSX.WorkSheet = XLSX.utils.json_to_sheet(chapterListData);

  //   var workbook: XLSX.WorkBook = { Sheets: { 'Questions': worksheet, 'Chapter list': worksheetChapters }, SheetNames: ['Questions', 'Chapter list'] };
  //   var excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   var excelData: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });

  //   saveAs(excelData, "Template.xlsx");

  //   this.spinner.hide();
  //   return true;
  // }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload.name.length < 6 || !this.fileToUpload.name.endsWith('.xlsx')) {
      this.translate.get('employees.ErrorFile').subscribe(value => { alert(value); });
    } else {
      this.spinner.show();
      this._service.postFile(this.fileToUpload).subscribe(data => {
        if (data.success) {
          this.showUploadDialog(data);
        } else {
          this.translate.get('employees.ErrorFile').subscribe(value => { alert(value); });
        }
        this.spinner.hide();
      }, err => {
        console.log(err);
        this.translate.get('employees.ErrorFile').subscribe(value => { alert(value); });
        this.spinner.hide();
      })
    }
  }
  showUploadDialog(data) {
    const dialogRef = this.dialog.open(DialogUploadEmpDialog, {
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.upload) {
        this.spinner.show();
        this._service.finishEmpUpload(result.sendMail).subscribe(data => {
          if (data.success) {
            this.snackbar.open(this.translate.instant('employees.SuccessInsert'), '', { duration: 3000 });
            this.loadEmp();
          } else {
            this.translate.get('employees.ErrorInsert').subscribe(value => { alert(value); });
            this.loadEmp()
          }
        }, err => {
          // TODO: Handle error
          console.error(err);
          this.translate.get('employees.ErrorInsert').subscribe(value => { alert(value); });
          this.loadEmp()
        })
      }
    });
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

  syncUsers() {
    this.spinner.show();
    this.bLoading = true;
    this._service.syncAdUsers().subscribe((data) => {
      if (data.success) {
        this.snackbar.open(this.translate.instant('employees.SyncSuccess'), '', { duration: 3000 });
        this.loadEmp();
      } else {
        alert(this.translate.instant('employees.SyncFail'));
        this.loadEmp();
      }
      this.bLoading = false;
      this.spinner.hide();
    });
  }

  onEmpViewChange(event) {
    this._globals.empFilter = event.value;
    this.setEmpList(event.value);
  }

  setEmpList(empFilter) {
    this.bLoading = true;
    this.employeeList.data = [];
    var newEmpList = [];
    if (empFilter == 'all') {
      this.employeeList.data = this.fullEmpList;
    } else if (empFilter == 'active') {
      this.fullEmpList.forEach(emp => {
        if (emp.inactive == '0' && emp.activeDate) {
          newEmpList.push(emp);
        }
      });
      this.employeeList.data = newEmpList;
    } else if (empFilter == 'inactive') {
      this.fullEmpList.forEach(emp => {
        if (emp.inactive != '0' || !emp.activeDate) {
          newEmpList.push(emp);
        }
      });
      this.employeeList.data = newEmpList;
    }
    this.bLoading = false;
  }
}


@Component({
  selector: 'dialog-upload-emp-dialog',
  styleUrls: ['./adminEmployee.component.scss'],
  templateUrl: 'dialog-upload-emp-dialog.html',
})
export class DialogUploadEmpDialog {
  notExistingGroups = [];
  ambiguousGroups = [];

  currentItemList = undefined;

  bSendWelcomeMail = true;

  currentColor = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogUploadEmpDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    data.notExistingOrAmbiguousGroups.forEach(group => {
      if (group.status == 0) {
        this.notExistingGroups.push(group);
      } else {
        this.ambiguousGroups.push(group);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setEmpMenuList(bNewEmps) {
    this.currentItemList = [];
    this.currentColor = bNewEmps ? 1 : 2;

    this.data.newEmpData.forEach(emp => {
      if (!bNewEmps && !emp.isNew) {
        this.currentItemList.push(emp);
      } else if (bNewEmps && emp.isNew) {
        this.currentItemList.push(emp);
      }
    });
  }

  setErrorEmpMenuList() {
    this.currentItemList = [];
    this.currentColor = 3;

    this.currentItemList = this.data.errorEmpList;
  }

  setGroupList(bNew) {
    this.currentItemList = [];
    this.currentColor = bNew ? 2 : 3;

    if (bNew) {
      this.currentItemList = this.notExistingGroups;
    } else {
      this.currentItemList = this.ambiguousGroups;
    }
  }

  setDepartmentList() {
    this.currentItemList = [];
    this.currentColor = 3;

    this.currentItemList = this.data.notExistingOrAmbiguousDepartments;
  }
}