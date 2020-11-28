import { Component, OnInit, ViewChild, ViewContainerRef, ChangeDetectorRef, ComponentFactoryResolver, ElementRef, Inject, Pipe, PipeTransform, ViewChildren, QueryList, AfterViewInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminCourseService } from '../../adminCourse.service';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router, ActivatedRoute } from "@angular/router";
import { Globals } from '../../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { ConfirmationBoxComponent } from '../../../../theme/components/confirmation-box/confirmation-box.component';

import { DialogForwardUserDialog } from '../../../../forward-user/dialog-forward-user-dialog';

import { download } from '../../../../download/download.component';
import { Location } from '@angular/common';

import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

import { hexToRgbaString } from '../../../../helper-functions';
import { Observable, Subject } from 'rxjs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export interface DialogData {
  items: any;
  chapterId: string;
  fun: any;
  name: string;
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-view-course',
  templateUrl: './view-adminCourse.component.html',
  styleUrls: ['./view-adminCourse.component.scss'],
  animations: [
    // trigger('headerAnimation', [
    //   state('hide', style({
    //     height: '0px',
    //     opacity: 0
    //   })),
    //   transition('* => *', animate(200))
    // ]),
    trigger('headerAnimation', [
      state('shown', style({ opacity: 1, height: '*' })),
      state('hidden', style({ opacity: 0, height: 0 })),
      transition('* => *', animate(200))
    ]),
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(500))
    ]),
    trigger('openedChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(1000))
    ])
  ]
})
export class ViewAdminCourseComponent implements OnInit, AfterViewInit {

  courseChartLabels: Label[] = [];
  courseChartColors = [];
  courseChartData: MultiDataSet = [];

  certificateLoaded = true;

  //new by philipp:
  private _courseData$ : Subject<any> = null;

  // departmentStatus = undefined;
  // groupStatus = undefined;
  // userStatus = undefined;

  // DELETE
  userDisplayedColumns: string[] = ['status', 'LASTNAME', 'FIRSTNAME', 'email', 'editDelete'];
  groupDisplayedColumns: string[] = ['status', 'name'];
  departmentDisplayedColumns: string[] = ['status', 'name'];

  userStatusTable = new MatTableDataSource();
  groupStatusTable = new MatTableDataSource();
  departmentStatusTable = new MatTableDataSource();

  courseUserOpen = 0;
  courseUserOverdue = 0;
  courseUserDone = 0;
  

  // @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  // @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  @ViewChild('userPaginator') set userPaginator(paginator: MatPaginator) {
    this.userStatusTable.paginator = paginator;
  }
  @ViewChild('groupPaginator') set groupPaginator(paginator: MatPaginator) {
    this.groupStatusTable.paginator = paginator;
  }
  @ViewChild('depPaginator') set depPaginator(paginator: MatPaginator) {
    this.departmentStatusTable.paginator = paginator;
  }

  @ViewChild('userSort') set userSort(sort: MatSort) {
    this.userStatusTable.sort = sort;
  }
  @ViewChild('groupSort') set groupSort(sort: MatSort) {
    this.groupStatusTable.sort = sort;
  }
  @ViewChild('depSort') set depSort(sort: MatSort) {
    this.departmentStatusTable.sort = sort;
  }
  // DELETE END
  //////////////////////////////////
  bCourseInfoLoaded = false;
  bAssignmentsLoaded = true; // TODO Important: set to false

  numberOverdue = 1;
  numberCurrent = 1;
  //////////////////////////////////

  // START participant confirmation stuff
  public partConfDisabled = true;
  public EmpForm: FormGroup;
  EmpCourse: any = [];
  public SelectCourse: any;
  public chpId = 0;
  public isAllChecked: boolean = false;
  public isConfirmed: boolean = false;
  // public EmailIdPart: string = "";
  public SendCertificateForm: FormGroup;
  public bIsSmartStudyUser: boolean = true;
  public bSetPassword: boolean = true;
  public bSendAll: boolean = true;
  public base64Img: string = "";
  public TSignature: string = "";
  public comLogo: string = "";
  public SignImg: string = "";

  public bToggleSendForm: boolean = false;
  public nNumSendCertificates = 0;
  @ViewChild('mail', { static: true }) mailForm: any;
  // END participant confirmation stuff

  // START participant list stuff
  public partListDisabled = true;
  public courseList = [];
  public numPartPassed = 0;
  public wgList = [];
  public CourseData: any = undefined;
  public CourseId = 0;
  public EmailIdList = "";
  // END participant list stuff

  // START chapter stuff
  displayedColumnsChapter: string[] = [];
  //ImageURL = this._globals.IMAGEURL;
  dataSourceChapter: any;
  selectCourse: any;
  formFieldVisibility = "visible";
  @ViewChild('ContentPaginator', { read: MatPaginator, static: true }) paginatorChapter: MatPaginator;
  // END chapter stuff

  // START question stuff
  displayedColumnsQuestion: string[] = [];
  fileToUpload: File = null;
  uploadFileType = "";
  dataSourceQuestion: any;
  @ViewChild('fileUpload', { static: true }) public _fileUpload: ElementRef;
  @ViewChild('imageFileUpload', { static: true }) public _imageFileUpload: ElementRef;

  @ViewChild('QuestionPaginator', { read: MatPaginator, static: true }) paginatorQuestion: MatPaginator;
  // END question stuff

  public tabSel = new FormControl(0);
  public showHeader = false;
  public numbers = [];

  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public selected: number = 0;
  private swipeCoord?: [number, number];
  private swipeTime?: number;

  certificateUrl = '';
  bLoadCertificate = true;

  constructor(private renderer: Renderer2, public dialog: MatDialog, public router: Router, private route: ActivatedRoute,
    private translate: TranslateService, private _location: Location, private _changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService, protected _service: AdminCourseService, private formBuilder: FormBuilder, public _globals: Globals,
    private componentFactoryResolver: ComponentFactoryResolver, private snackbar: MatSnackBar) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.spinner.hide();

    this.numbers = Array(24).fill(0).map((x, i) => i + 1);

    this.courseChartLabels = [this.translate.instant('course.Done'), this.translate.instant('course.Open'), this.translate.instant('course.Overdue')];
    var obj = this;
    this.translate.onLangChange.subscribe(() => {
      this.courseChartLabels = [obj.translate.instant('course.Done'), obj.translate.instant('course.Open'), obj.translate.instant('course.Overdue')];
      this.bLoadCertificate = false;
      setTimeout(() => {
        this.bLoadCertificate = true;
      });
    });

    // this.userStatusTable = new MatTableDataSource();
    // this.groupStatusTable = new MatTableDataSource();
    // this.departmentStatusTable = new MatTableDataSource();

    this.setChartColors();

    this.initSendCertificateStuff();
  }
  ngOnInit() {
    var obj = this;
    this.route.params.subscribe(params => {
      var tabId = params.tabId;
      if (tabId > 4) {
        tabId = 0;
      }

      obj.tabSel.setValue(tabId);
      obj.selected = tabId;
      obj.tabGroup.selectedIndex = this.selected;
      //this.tabGroup.selectedIndex = params.tabId;
      //console.log(params.tabId);
      if (tabId > 0) {
        obj.showHeader = true;
      } else {
        obj.showHeader = false;
      }
      obj.chpId = params.id;
      if (!obj.CourseData) {
        obj.updateData();
      }
    });
    //this.selected = this.tabGroup.selectedIndex;
  }
  ngAfterViewInit() {
    // this.userStatusTable.paginator = this.userPaginator;// this.paginator.toArray()[2];
    // this.departmentStatusTable.paginator = this.depPaginator; //this.paginator.toArray()[0];
    // this.groupStatusTable.paginator = this.groupPaginator;// this.paginator.toArray()[1];

    // this.userStatusTable.sort = this.userSort;// this.sort.toArray()[2];
    // this.departmentStatusTable.sort = this.depSort;// this.sort.toArray()[0];
    // this.groupStatusTable.sort = this.groupSort;// this.sort.toArray()[1];

    // DELETE
    this.userStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'email': {
          return item.EmailID;
        }
        case 'status': {
          return item.courseStatus;
        }
        default: {
          return item[property];
        }
      }
    };

    this.departmentStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'name': {
          return item.departmentName;
        }
        case 'status': {
          return item.departmentCourseStatus;
        }
        default: {
          return item[property];
        }
      }
    };

    this.groupStatusTable.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'status': {
          return item.groupCourseStatus;
        }
        default: {
          return item[property];
        }
      }
    };

    var obj = this;
    this.userStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter) || obj.filterFunction(data.EmailID, filter);
    }
    this.departmentStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.departmentName, filter);
    }
    this.groupStatusTable.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.name, filter);
    }

    // DELETE
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
    return bMatch;
  }
  
  // DELETE
  applyFilterMember(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userStatusTable.filter = filterValue;

    if (this.userStatusTable.paginator) {
      this.userStatusTable.paginator.firstPage();
    }
  }
  setChartColors() {
    var opacity = 0.8;
    var style = getComputedStyle(document.body);
    var strDanger = hexToRgbaString(style.getPropertyValue('--myDanger'), opacity);
    var strWarning = hexToRgbaString(style.getPropertyValue('--myWarning'), opacity);
    var strSuccess = hexToRgbaString(style.getPropertyValue('--mySuccess'), opacity);
    var colorObject = { backgroundColor: [strSuccess, strWarning, strDanger] };
    this.courseChartColors = [colorObject];
  }
  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        switch (swipe) {
          case 'previous':
            if (this.selected > 0) { this.selected--; }
            break;
          case 'next':
            if (this.selected < this.tabGroup._tabs.length - 1) { this.selected++; }
            break;
        }
      }
    }
  }
  initSendCertificateStuff() {
    this.SendCertificateForm = this.formBuilder.group({
      mail: ['', Validators.compose([Validators.required, Validators.email])],
      password: [''],
      expiresIn: [2],
      expirationUnit: ['days']
    });
    this.bIsSmartStudyUser = true;
    this.bSetPassword = true;
    this.bSendAll = true;
  }
  updateData() {
    // this.loadEmployeList(this.chpId);
    this.loadCourseData(this.chpId);
    this.loadContent();
    this.loadCompany();
  }
  tabChanged(event: MatTabChangeEvent) {
    this.tabSel.setValue(event.index);
    if (event.index > 0) {
      this.showHeader = true;
    } else {
      this.showHeader = false;
    }
    var result = /([A-Za-z/]*[/][0-9]*[/])[0-9]*$/.exec(this._location.path())[1] + event.index;
    this._location.replaceState(result);

    if (event.index != 4) {
      this.certificateLoaded = false;
    }
  }
  certificateLoadedCallback() {
    if (!this.certificateLoaded) {
      this.certificateLoaded = true;
      this._changeDetectorRef.detectChanges();
    }
  }
  openPartList() {
    //this.tabSel.setValue(1);
    this.tabGroup.selectedIndex = 1;
  }
  // viewChapters() {
  //   this.router.navigate(['admin/content', this.chpId], { skipLocationChange: false });
  // }
  // START participant confirmation stuff
  checkAll() {
    for (var i = 0; i < this.EmpCourse.length; i++) {
      if (!this.isAllChecked) {
        this.EmpCourse[i].isChecked = true;
      } else {
        this.EmpCourse[i].isChecked = false;
      }
    }
  }
  checkParticipant(id) {
    this.EmpCourse[id].isChecked = !this.EmpCourse[id].isChecked;
  }
  addSendEmp(id) {
    this.EmpCourse[id].sendCerti = !this.EmpCourse[id].sendCerti;
    this.nNumSendCertificates += (this.EmpCourse[id].sendCerti) ? 1 : -1;
  }
  OpenSubChap(obj) {
    if (obj.isActive == 1) {
      obj.isActive = 0
    } else {
      //console.log(obj);
      if (obj.subChap.length == 0) {
        this._service.getSubChapterByChapId(this.chpId, obj.empId).subscribe((res) => {
          if (res.success) {
            obj.subChap = res.data;
          }
        });
      }
      obj.isActive = 1
    }
  }
  isColleps(obj) {
    if (obj.isActive) {
      obj.isActive = false;
    } else {
      obj.isActive = true;
    }
  }
  sendCertificate() {
    if (!this.SendCertificateForm.valid) {
      this.translate.get('alert.EnterMailPartConf').subscribe(value => { alert(value); });
      return false;
    }

    if (!this.bIsSmartStudyUser && this.bSetPassword && this.SendCertificateForm.value.password.length < 4) {
      this.translate.get('alert.EnterValidPw').subscribe(value => { alert(value); });
      return false;
    }

    var sendEmps = [];

    if (!this.bSendAll && this.nNumSendCertificates == 0) {
      this.translate.get('alert.SelectEmp').subscribe(value => { alert(value); });
      return false;
    } else if (!this.bSendAll) {
      this.EmpCourse.forEach(element => {
        if (element.sendCerti) {
          sendEmps.push(element.empId);
        }
      });
    }

    // console.log(sendEmps);
    // var btrue = true;
    // if (btrue) {
    //   return;
    // }

    // if (this.EmailIdPart == "") {
    //   this.translate.get('alert.EnterMailPartConf').subscribe(value => { alert(value); });
    //   return false;
    // }
    this._service.sendCertificate(this.chpId, this.SendCertificateForm.value, this.bIsSmartStudyUser, this.bSetPassword, this.bSendAll, sendEmps).subscribe((data) => {
      // console.log(data);
      if (data.success) {
        this.translate.get('alert.PartConfSentSucc').subscribe(value => { alert(value); });
        this.cancelCertificateSend();
      } else {
        this.translate.get('alert.PartConfSendFail').subscribe(value => { alert(value); });
      }
    });
  }
  cancelCertificateSend() {
    this.toggleSendForm();
    this.initSendCertificateStuff()
  }
  isChecked(data, obj) {
    //console.log(obj);
  }
  certificateDown(certi) {
    //console.log(certi);

    if (this._globals.currentCertificateDownloadWindow) {
      this._globals.currentCertificateDownloadWindow.close();
    }
    var url = this._globals.WebURL + '/API/index.php/createpdf/view/' + this.chpId + '/' + certi.empId;
    var width = window.innerHeight > 500 ? window.innerHeight * 3 / 4 : 500;
    var height = window.innerHeight > 600 ? window.innerHeight - 100 : window.innerHeight;
    var strWindowSettings = 'menubar=no,toolbar=no,status=no,channelmode=yes,top=0,left=0';
    strWindowSettings += ',width=' + width + ',height=' + height;
    this._globals.currentCertificateDownloadWindow = window.open(url, "Smart-Study", strWindowSettings);

    // this._globals.certificaterCourseId = certi.courseId;
    // this._globals.certificaterEmpId = certi.empId;
    // const factory = this.componentFactoryResolver.resolveComponentFactory(download);
    // this.viewContainerRef.clear();
    // const ref = this.viewContainerRef.createComponent(factory);
    // ref.changeDetectorRef.detectChanges();

    // // this.spinner.show();
    // // var obj = this;
    // // if (certi.imgPath && certi.imgPath != "") {
    // //   obj.convertImgToBase64URL(obj._globals.WebURL + "/" + this.SelectCourse.imgPath, function (base64Img) {
    // //     obj.base64Img = base64Img;
    // //     obj.PDFTSignature(certi);
    // //   }, 'image/png');
    // // } else {
    // //   obj.PDFTSignature(certi);
    // // }
  }
  convertImgToBase64URL(url, callback, outputFormat) {
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      //console.log(img);
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

  // deleteUser(obj) {
  //   this.translate.get('dialog.DeleteEmpFromCourseSure').subscribe(value => {
  //     const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
  //       width: '400px',
  //       data: { companyId: obj.empId, Action: false, Mes: value }
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         this._service.deleteEmpCouse(obj.emp_courseId).subscribe((res) => {
  //           if (res.success) {
  //             this.loadEmployeList(this.chpId);
  //             this.loadParticipantList(this.chpId);
  //           } else {
  //             if (res.code && res.code == 'mandDepAss') {
  //               this.translate.get('alert.DelCourseEmpFailDepAss').subscribe(value => { alert(value); });
  //             } else if (res.code && res.code == 'empFinished') {
  //               this.translate.get('alert.DelCourseEmpFailFinished').subscribe(value => { alert(value); });
  //             } else {
  //               this.translate.get('alert.DelCourseEmpFail').subscribe(value => { alert(value); });
  //             }
  //           }
  //         });
  //       }
  //     });
  //   });
  // }
  // editUser(obj) {
  //   var path = '';
  //   if (this._globals.getUserType() === '1') {
  //     path = 'superadmin/course/participantEdit';
  //   } else if ((this._globals.getUserType() === '2') || (this._globals.getUserType() === '3')) {
  //     path = 'admin/course/participantEdit';
  //   }

  //   var backUrl = this.router.url;
  //   if (backUrl.length > 2 && backUrl.charAt(backUrl.length - 2) == "/" && backUrl.charAt(backUrl.length - 2) != "2") {
  //     backUrl = backUrl.slice(0, -1) + "2";
  //   }

  //   this._globals.setLastRoutURL(backUrl);
  //   this.router.navigate([path, obj.empId, this.SelectCourse.locationId, this.SelectCourse.isLocReq], { skipLocationChange: false });
  // }
  // numberToMonthString(nMonth) {
  //   var strMonth = "";

  //   switch (nMonth) {
  //     case 1: { strMonth = "Januar"; break; }
  //     case 2: { strMonth = "Februar"; break; }
  //     case 3: { strMonth = "März"; break; }
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
  toggleSendForm() {
    this.bToggleSendForm = !this.bToggleSendForm;
    // var obj = this;
    // setTimeout(() => {
    //   obj.mailForm.nativeElement.focus();
    // }, 200);
  }
  // END participant confirmation stuff

  // START participant list stuff
  public data : any;
  loadCourseData(CourseId) {
    this.bCourseInfoLoaded = false;

    //new philipp
    this._courseData$ = this._service.getCourseData(CourseId);

    this._service.getCourseData(CourseId).subscribe(data => {
      if (data.success) {
        this.CourseData = data.courseInfo;
        this.data = data;

        if (this.CourseData.hasCertificate) {
          this.certificateUrl = this._globals.WebURL + '/API/index.php/createpdf/view/' + this.CourseData.courseId + '/preview';
        } else {
          this.certificateUrl = '';
        }

        // DELETE
        this.userStatusTable.data = data.userStatus;
        this.departmentStatusTable.data = data.departmentStatus;
        this.groupStatusTable.data = data.groupStatus;
        
        this.courseUserOverdue = 0;
        this.courseUserOpen = 0;
        this.courseUserDone = 0;
        this.userStatusTable.data.forEach((userStat: any) => {
          if (userStat.courseStatus == -1) {
            this.courseUserOverdue = this.courseUserOverdue + 1;
          } else if (userStat.courseStatus == 0) {
            this.courseUserOpen = this.courseUserOpen + 1;
          } else {
            this.courseUserDone = this.courseUserDone + 1;
          }
        });
        //

        this.bCourseInfoLoaded = true;

        var obj = this;
        setTimeout(() => {
          obj.courseChartData = [[obj.courseUserDone, obj.courseUserOpen, obj.courseUserOverdue]];
        }, 1000);
      }
    }, err => {
      // TODO: Handle error
      console.log(err);
    })
    // this.courseList = [];
    // this.partListDisabled = true;
    // this.CourseData = undefined;
    // this.CourseId = 0;
    // this._service.getCourseEmpReport(CourseId).subscribe((data) => {
    //   //console.log(data);
    //   this.CourseId = CourseId;
    //   this.certificateUrl = this._globals.WebURL + '/API/index.php/createpdf/view/' + CourseId;
    //   this.CourseData = data.CourseData;
    //   if (data.success) {
    //     this.partListDisabled = false;
    //     this.courseList = data.data;
    //     for (var i = 0; i < this.courseList.length; ++i) {
    //       if (this.courseList[i].isCompleted == 1) {
    //         ++this.numPartPassed;
    //       }
    //     }
    //   } else {
    //     if (this.tabSel.value == 1 && this.courseList.length == 0) {
    //       this.tabSel.setValue(0);
    //     }
    //   }
    // });
  }
  // sendEmpList() {
  //   if (this.EmailIdList == "") {
  //     this.translate.get('alert.EnterMailPartList').subscribe(value => { alert(value); });
  //     return false
  //   }
  //   this._service.getCourseEmpReportSend(this.CourseId, this.EmailIdList).subscribe((data) => {
  //     this.translate.get('alert.PartListSentSucc').subscribe(value => { alert(value); });
  //   });
  // }
  // END participant list stuff

  // START chapter stuff
  applyFilterChapter(filterValue: string) {
    this.dataSourceChapter.filter = filterValue.trim().toLowerCase();
  }
  loadContent() {
    this.dataSourceChapter = new MatTableDataSource();

    this._service.getChapterByCourseId(this.chpId).subscribe((res) => {
      //console.log(res.data);
      if (res.success) {
        this.dataSourceChapter = new MatTableDataSource(res.data);
        // this.displayedColumnsChapter = ['chapterId', 'chapterName', 'courseName', 'companyName', 'actions'];
        this.displayedColumnsChapter = ['chapterId', 'chapterName', 'actions'];
        this.dataSourceChapter.paginator = this.paginatorChapter;
      }
      this.filterContentByCourse();
    });
  }
  filterContentByCourse() {
    this.route.params.subscribe(params => {
      if (params.id != undefined) {
        this.formFieldVisibility = "hidden";
        this.dataSourceChapter.filterPredicate = function (data, filter: string): boolean {
          return (data.courseId == filter);
        };
        this.dataSourceChapter.filter = params.id;
      }
    });
  }
  addContent() {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/content/add';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/content/add';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/content/add';
    } else {
      path = 'employee/content/add';
    }
    this.router.navigate([path, this.CourseData.courseId], { skipLocationChange: false });
  }
  editContent(obj) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/content/edit';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/content/edit';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/content/edit';
    } else {
      path = 'employee/content/edit';
    }
    this.router.navigate([path, obj.chapterId], { skipLocationChange: false });
  }
  deleteContent(obj) {
    this.translate.get('dialog.DeleteContentSure').subscribe(value => {
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: obj.chapterId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._service.deleteChapter(obj.chapterId).subscribe((res) => {
            if (res.success) {
              this.loadContent();
            }
          });
        }
      });
    });
  }
  downloadQRCodeFile(me, obj) {
    // // console.log(me);
    // me.selectCourse = obj;
    // // console.log(obj);
    // setTimeout(function () {
    //   var data = document.getElementById('QRCodeId');
    //   // console.log(data);
    //   html2canvas(data).then(canvas => {
    //     // Few necessary setting options  
    //     var imgWidth = 208;
    //     //var pageHeight = 295;
    //     var imgHeight = canvas.height * imgWidth / canvas.width;
    //     //var heightLeft = imgHeight;

    //     const contentDataURL = canvas.toDataURL('image/png')
    //     let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
    //     pdf.addFont('arialregular');
    //     var position = 0;
    //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    //     pdf.save('Doc_' + obj.subChapterId + '.pdf'); // Generated PDF 

    //     setTimeout(function () {
    //       me.selectCourse = null;
    //     }, 200);
    //   });

    // }, 100);
  }
  downloadCompany(obj) {
    this._service.getSubChapterByChapter(obj.chapterId).subscribe((res) => {
      if (res.success) {
        const dialogRef = this.dialog.open(SubChapterOverviewDialog, {
          width: '400px',
          data: { items: res.data, name: obj.courseName, fun: this, chapterId: obj.chapterId }
        });

        dialogRef.afterClosed().subscribe(result => {
          // console.log('The dialog was closed');
        });
      } else {
        this.translate.get('alert.NoOfflineSubChap').subscribe(value => { alert(value); });
      }
    });


  }
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
  // END chapter stuff

  // START question stuff
  applyFilterQuestion(filterValue: string) {
    this.dataSourceQuestion.filter = filterValue.trim().toLowerCase();
  }
  uploadEmp(fileType) {
    this.uploadFileType = fileType;
    this._fileUpload.nativeElement.click();
  }
  loadCompany() {
    this.dataSourceQuestion = new MatTableDataSource();

    this._service.getData(this._globals.companyInfo.companyId, this.chpId).subscribe((res) => {
      if (res.success) {
        for (var i = 0; i < res.data.length; ++i) {
          if (!res.data[i].chapterName || res.data[i].chapterName == '') {
            res.data[i].chapterName = "-";
          }
        }
        this.dataSourceQuestion = new MatTableDataSource(res.data);
        // this.displayedColumnsQuestion = ['QuestionImg', 'Question', 'courseName', 'chapterName', 'CorrectAnswerOptionNumber', 'actions'];
        this.displayedColumnsQuestion = ['QuestionImg', 'Question', 'chapterName', 'CorrectAnswerOptionNumber', 'actions'];
        this.dataSourceQuestion.paginator = this.paginatorQuestion;

        this.filterQuestionsByCourse();
      }
    });
  }
  addTest() {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/test/add/';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/test/add/';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/test/add/';
    } else {
      path = 'employee/test/add/';
    }
    this.router.navigate([path + this.CourseData.courseId], { skipLocationChange: false });
  }
  editTest(obj) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/test/edit/';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/test/edit/';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/test/edit/';
    } else {
      path = 'employee/test/edit/';
    }
    this.router.navigate([path + obj.questionId], { skipLocationChange: false });
  }
  deleteTest(obj) {
    this.translate.get('dialog.DeleteQuestionSure').subscribe(value => {
      //alert(value);
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: obj.questionId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._service.deleteQuestion(obj.questionId).subscribe((res) => {
            if (res.success) {
              this.loadCompany();
            }
          });
        }
      });
    });
  }
  imageFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    this._service.postFile(this.fileToUpload).subscribe(data => {
      if (data.success) {
        alert(data.mes);
        this.loadCompany();
      }

    }, error => {
      // console.log(error);
    });
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    // this._service.postImage(this.fileToUpload).subscribe(data => {
    //   this.loadCompany();
    // }, error => {
    //   // console.log(error);
    // });

    if (this.uploadFileType == 'excel') {
      if (this.fileToUpload.name.length > 4 &&
        (this.fileToUpload.name.substr(this.fileToUpload.name.length - 5) == '.xlsx' ||
          this.fileToUpload.name.substr(this.fileToUpload.name.length - 4) == '.xls')) {
        this._service.postFile(this.fileToUpload).subscribe(data => {
          if (!data.success) {
            this.translate.get('question.UploadZipFail').subscribe(value => { alert(value); });
          }
          this.loadCompany();
        });
      } else {
        this.translate.get('question.UploadFileTypeFail').subscribe(value => { alert(value); });
      }
    } else if (this.uploadFileType == 'zip') {
      if (this.fileToUpload.name.length > 4 && this.fileToUpload.name.substr(this.fileToUpload.name.length - 4) == '.zip') {
        this._service.postQuestionZip(this.fileToUpload, this.CourseId).subscribe(data => {
          if (!data.success) {
            this.translate.get('question.UploadZipFail').subscribe(value => { alert(value); });
          }
          this.loadCompany();
        }, error => {
          console.error(error);
        });
      } else {
        this.translate.get('question.UploadFileTypeFail').subscribe(value => { alert(value); });
      }

    }
  }
  addImage() {
    this._imageFileUpload.nativeElement.click();
    return false;
  }
  filterQuestionsByCourse() {
    this.route.params.subscribe(params => {
      if (params.id != undefined) {
        //this.formFieldVisibility = "hidden";
        this.dataSourceQuestion.filterPredicate = function (data, filter: string): boolean {
          return (data.CourseId == filter);
        };
        this.dataSourceQuestion.filter = params.id;
      }
    });
  }
  downloadExampleZip(format) {
    if (format != 'zip' && format != 'excel') {
      return false;
    }
    this.spinner.show();
    //console.log("Download example ZIP");

    var data: any;
    data = [{
      "Chapter ID": '[Chapter ID of the desired chapter (you can find the chapter IDs on the second sheet)]',
      "isTraining": '[1 => training question, 0 => final exam question]',
      "Question": '[Your question]',
      "Correct Answers": '[Correct answer options]',
      "Answer Option 0": '[Answer option text]',
      "Answer Option 1": '[Answer option text]',
      "Answer Option 2": '[Answer option text]',
      "Answer Option 3": '[Answer option text]',
      "Answer Option 4": '[Answer option text]',
      "Image file name": '[Image file name]',
      "Explanation": '[Explanation of the question]'
    }, {
      "Chapter ID": 'XXXX',
      "isTraining": '1',
      "Question": 'Example question with four answer options and correct answer options 0, 1 and 2.',
      "Correct Answers": '0@1@2',
      "Answer Option 0": 'Answer option 0',
      "Answer Option 1": 'Answer option 1',
      "Answer Option 2": 'Answer option 2',
      "Answer Option 3": 'Answer option 3',
      "Answer Option 4": '',
      "Image file name": 'example_image.png',
      "Explanation": 'Example question explanation'
    }];
    // if (this._globals.userInfo.userLang == "de") {
    //   data = [{
    //     "Kapitel ID": ''
    //   }];
    // } else {
    //   data = [{
    //     "Chapter ID": ''
    //   }];
    // }

    var worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    var chapterListData = [];
    for (var i = 0; i < this.dataSourceChapter.filteredData.length; ++i) {
      var chapter = this.dataSourceChapter.filteredData[i];
      // if (chapter.is_offline == 0) {
      chapterListData.push({
        "Chapter ID": chapter.chapterId,
        "Chapter name": chapter.chapterName
      });
      // }
    }
    var worksheetChapters: XLSX.WorkSheet = XLSX.utils.json_to_sheet(chapterListData);

    var workbook: XLSX.WorkBook = { Sheets: { 'Questions': worksheet, 'Chapter list': worksheetChapters }, SheetNames: ['Questions', 'Chapter list'] };
    var excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    var excelData: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });

    var obj = this;

    if (format == 'excel') {
      saveAs(excelData, "Template.xlsx");
    } else if (format == 'zip') {
      var zip = new JSZip();
      zip.file("QuestionSheet.xlsx", excelData);

      var imgUrl = this._globals.WebURL + "/assets/img/logoakt.png";
      if (this._globals.companyInfo.companyId != 0 && this._globals.companyInfo.companyLogo != null &&
        this._globals.companyInfo.companyLogo != '') {
        imgUrl = this._globals.WebURL + "/" + this._globals.companyInfo.companyLogo;
      }
      this.convertImgToBase64URL(imgUrl, function (base64Img: String) {
        zip.file("images/example_image.png", base64Img.substr(22, base64Img.length - 10), { base64: true });

        zip.generateAsync({ type: "blob" }).then(function (content) {
          // see FileSaver.js
          saveAs(content, "Template.zip");
        });
      }, 'image/png');
    }

    obj.spinner.hide();
    return true;
  }
  // END question stuff
  courseImgError(event) {
    if (this._globals.companyInfo.companyLogo != null && this._globals.companyInfo.companyLogo != '') {
      event.target.src = this._globals.WebURL + '/' + this._globals.companyInfo.companyLogo;
    } else {
      event.target.src = /*this._globals.WebURL +*/ "assets/img/logoakt.png";
    }
  }
  editCourse() {
    this.spinner.show();
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/course/edit/';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/course/edit/';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/course/edit/';
    } else {
      path = 'employee/course/edit/';
    }
    this.router.navigate([path + this.CourseData.courseId], { skipLocationChange: false });
  }
  addCertificate() {
    this.spinner.show();
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/certificater/add/';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/certificater/add/';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/certificater/add/';
    } else {
      path = 'employee/certificater/add/';
    }
    this.router.navigate([path + this.CourseData.courseId], { skipLocationChange: false });
  }
  editCertificate() {
    this.spinner.show();
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/certificater/edit/';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/certificater/edit/';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/certificater/edit/';
    } else {
      path = 'employee/certificater/edit/';
    }
    this.router.navigate([path + this.CourseData.hasCertificate], { skipLocationChange: false });
  }
  deleteCertificate() {
    var strHead = this.translate.instant('certificate.DeleteCerti');
    var strMessage = this.translate.instant('certificate.DeleteCertiSure', { course: this.CourseData.courseName });

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this._globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.CourseData.hasCertificate) {
        this._service.deleteCertificate(this.CourseData.hasCertificate).subscribe(data => {
          if (data.success) {
            this.bCourseInfoLoaded = false;
            this.snackbar.open(this.translate.instant('certificate.DelSuccess'), '', { duration: 3000 });
            this.loadCourseData(this.CourseData.courseId);
            window.scroll(0, 0);
          } else {
            this.snackbar.open(this.translate.instant('certificate.DelFail'), '', { duration: 3000 });
          }
        }, err => {
          this.snackbar.open(this.translate.instant('certificate.DelFail'), '', { duration: 3000 });
          console.error(err);
        });
      }
    });
  }
  ngOnDestroy() {
    if (this._globals.currentCertificateDownloadWindow) {
      this._globals.currentCertificateDownloadWindow.close();
    }
  }
  passUser(emp) {
    const dialogRef = this.dialog.open(DialogForwardUserDialog, {
      data: { name: emp.FULLNAME, course: this.CourseData.courseName, hasCertificate: this.CourseData.hasCertificate }
    });

    var obj = this;
    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //this.animal = result;
      //console.log(result);
      if (result && (result == 1 || result == 2)) {
        var justPass = (result == 1 ? '1' : '0');
        obj._service.passUserCourse(emp.empId, obj.CourseData.courseId, justPass).subscribe(data => {
          if (data.success) {
            this.snackbar.open(this.translate.instant('course.PassEmpSuccess'), '', { duration: 3000 });
            this.bCourseInfoLoaded = false;
            this.updateData();
          } else {

          }
        }, err => {
          // TODO: Handle error
          console.error(err);
        })
      }
    });
  }

  deleteCourse() {
    this.translate.get('dialog.DeleteCourseSure').subscribe(value => {
      //alert(value);
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: this.CourseData.courseId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.spinner.show();
          this._service.delete(this.CourseData.courseId).subscribe((data) => {
            if (data.success) {
              if (this._globals.getUserType() == "1") {
                this.router.navigate(['superadmin/course'], { skipLocationChange: false });
              } else if (this._globals.getUserType() == "2") {
                this.router.navigate(['admin/course'], { skipLocationChange: false });
              } else if (this._globals.getUserType() == "3") {
                this.router.navigate(['trainer/course'], { skipLocationChange: false });
              } else {
                this.router.navigate(['employee/course'], { skipLocationChange: false });
              }
            } else {
              this.spinner.hide();
            }
          });
        }
      });
    });
  }

  get courseData$() : Observable<any> { return this._courseData$; }
}


@Component({
  selector: 'SubChapterOverviewDialog',
  templateUrl: 'SubChapterOverviewDialog.html',
})
export class SubChapterOverviewDialog {

  constructor(
    public dialogRef: MatDialogRef<SubChapterOverviewDialog>, protected _service1: AdminCourseService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  downloadCompany(sub) {
    this.data.fun.downloadQRCodeFile(this.data.fun, sub);
  }
}
