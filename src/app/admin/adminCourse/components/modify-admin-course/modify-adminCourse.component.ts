import { Component, OnInit, ElementRef, ViewChild, Inject, Injectable, Input, Output, EventEmitter, AfterViewInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { AdminCourseService } from '../../adminCourse.service';

import { Globals } from '../../../../common/auth-guard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatRadioChange } from '@angular/material/radio';

import { ConfirmationBoxComponent } from '../../../../theme/components/confirmation-box/confirmation-box.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
//import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerRangeValue } from 'saturn-datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
// import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { SelectionModel } from '@angular/cdk/collections';
import { ErrorStateMatcher } from '@angular/material/core';


@Component({
  selector: 'app-modify-course',
  templateUrl: './modify-adminCourse.component.html',
  styleUrls: ['./modify-adminCourse.component.scss']
})
export class ModifyAdminCourseComponent implements OnInit, AfterViewInit {
  public EmpForm: FormGroup;
  public postList = [];
  public trainerList = [];
  public locationList = [];
  public defaultPicture = 'assets/img/theme/add-image.png';
  public profile: String = "";
  public imgPath = "";
  public strCourseImg = "";
  public DisableButton = false;
  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Course',
    method: 'POST',
    data: {}
  };
  department = [];
  positions = [];
  CopyCourse = 0;
  fileToUpload: File = null;
  spinnerText = "";

  // 0 => Add
  // 1 => edit
  // 2 => duplicate
  mode = 0;

  informEmp: Number = 3;
  //informChanges = false;
  // origDepartmentIds = [];
  // origMandatoryDepartmentIds = [];
  // origPositionIds = [];
  // origMandatoryPositionIds = [];

  @ViewChild('fileUpload') public _fileUpload: ElementRef;

  // Permission table
  permissionList: any;
  bUserListLoaded = false;

  displayedColumnsPermissions: string[] = ['LASTNAME', 'FIRSTNAME', 'view', 'admin'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selectionView = new SelectionModel(true, []);
  selectionAdmin = new SelectionModel(true, []);

  constructor(private spinner: NgxSpinnerService, private renderer: Renderer2, public router: Router, private route: ActivatedRoute,
    protected service: AdminCourseService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals,
    private _bottomSheet: MatBottomSheet, public dialog: MatDialog, private snackbar: MatSnackBar, private _location: Location) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.translate.get('course.Image').subscribe(value => { this.strCourseImg = value; });
    this.translate.get('scorm.UploadingScorm').subscribe(value => { this.spinnerText = value; });

    this._globals.spinnerText = "";

    this.permissionList = new MatTableDataSource();

    this.loadUserList();
    this.loadDepartment();
    this.loadPositions();
    this.loadTrainer();
    this.loadLocations();
    //console.log(this.router.url);
    var currentUrl = this.router.url;
    if (currentUrl.includes("/course/edit/")) {
      // edit course
      this.mode = 1;

      this.route.params.subscribe(params => {
        this.CopyCourse = params.id;
        this.loadCourseById(this.CopyCourse);
      });
    }
    if (currentUrl.includes("/course/duplicatCourse/")) {
      // TODO: set duplicate state
      this.mode = 2;
    }
    this.setDefaultFormValues();

    function goodbye(e) {
      if (!e) e = window.event;
      //e.cancelBubble is supported by IE - this will kill the bubbling process.
      e.cancelBubble = true;
      e.returnValue = undefined; //This is displayed on the dialog

      //e.stopPropagation works in Firefox.
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    window.onbeforeunload = goodbye;
  }
  ngAfterViewInit() {
    this.permissionList.paginator = this.paginator;
    this.permissionList.sort = this.sort;

    var obj = this;
    this.permissionList.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter);
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
  loadUserList() {
    this.bUserListLoaded = false;
    this.service.getUserList(this._globals.companyInfo.companyId).subscribe(data => {
      if (data.success) {
        this.permissionList.data = data.data;
        if (!this._globals.userInfo.isAdmin) {
          this.permissionList.data.forEach(user => {
            if (user.self) {
              this.selectionAdmin.select(user.UserId);
            }
          });
        }

      } else {
        this.permissionList.data = [];
      }
      this.bUserListLoaded = true;
    }, err => {
      // TODO: Handle error!!
      console.error("Not loaded!!");
      console.error(err);
    });
  }
  setDefaultFormValues() {
    this.EmpForm = this.formBuilder.group({
      courseId: [0],
      courseName: ['', Validators.required],
      trainerId: [0],
      locationId: [0],
      isLocReq: [false],
      hasFinalExam: [false],
      // departmentIds: [[]],
      // mandatoryDepartmentIds: [[]],
      // departmentMandatory: [0],
      // positionIds: [[]],
      // mandatoryPositionIds: [[]],
      // positionMandatory: [0],
      EndTime: [''],
      duration: new FormControl(10, [Validators.min(1), Validators.required]),
      courseRate: ['5'],
      StartTime: [''],
      courseDes: ['', Validators.required],
      minResult: new FormControl(50, [Validators.min(1), Validators.required, Validators.max(100)]),
      courseImg: [''],
      isOffline: [false],
      isScormCourse: [false],
      scormPath: [''],
      // isRecurring: [false],
      // recurringPeriod: ['year'],
      // recurringFrom: [''],
      // recurringTo: [''],
      // recurringTimeSpan: []
    });
  }
  // radioPeriodChange($event: MatRadioChange) {
  //   currentPeriod = $event.value;
  // }
  loadCourseById(couId) {
    //console.log(couId);
    this.service.getCourseById(couId).subscribe((data) => {
      if (data.success) {
        // console.log(data.data);
        var startTime: any;
        if (data.data.startDate != '') {
          startTime = new Date(data.data.startDate);
        } else {
          startTime = '';
        }
        var endTime: any;
        if (data.data.startDate != '') {
          endTime = new Date(data.data.EndTime);
        } else {
          endTime = '';
        }

        let hasFinalExam: boolean = parseInt(data.data.duration) > 0;
        let duration: number = hasFinalExam ? parseInt(data.data.duration) / 60 : 10;
        let minResult: number = hasFinalExam ? parseInt(data.data.minResult) : 50;

        this.EmpForm.setValue({
          courseId: data.data.courseId,
          courseName: data.data.courseName,
          trainerId: data.data.trainerId,
          locationId: data.data.locationId,
          isLocReq: data.data.isLocReq == 1 ? true : false,
          hasFinalExam: hasFinalExam,
          EndTime: endTime,
          duration: duration,
          courseRate: data.data.courseRate,
          StartTime: startTime,
          courseDes: data.data.courseDes,
          minResult: minResult,
          courseImg: data.data.courseImg,
          isOffline: data.data.isOffine == 1 ? true : false,
          isScormCourse: data.data.isScormCourse == 1 ? true : false,
          scormPath: data.data.scormPath
        });
        //console.log(this.EmpForm);
        if (data.data.courseImg && data.data.courseImg != "") {
          //this.defaultPicture = this._globals.WebURL + "/" + data.data.courseImg;
          this.profile = this._globals.WebURL + "/" + data.data.courseImg;
        }

        data.permissionList.forEach(permission => {
          if (Number(permission.permission)) {
            if (Number(permission.permission) == 1) {
              this.selectionView.select(permission.userId);
            } else if (Number(permission.permission) == 2) {
              this.selectionAdmin.select(permission.userId);
            }
          }
        });

        //this.defaultPicture = this._globals.IMAGEURL + "Course/" + data.data.courseImg;
      }
      this.spinner.hide();
    });
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
    this._globals.spinnerText = "";
  }
  loadTrainer() {
    this.service.getTrainerByComp(this._globals.companyInfo.companyId).subscribe((data) => {
      if (data.success) {
        this.trainerList = data.data
      }
    });
  }
  loadLocations() {
    this.service.getLocationsByComp().subscribe((data) => {
      if (data.success) {
        this.locationList = data.data
      }
    });
  }
  loadDepartment() {
    this.service.getDepartment().subscribe((data) => {
      if (data.success) {
        this.department = data.data;
        this.department = this.groupDepartmentList(this.department);
      } else {
        this.department = [];
      }
    });
  }
  groupDepartmentList(deparmentList) {
    var newDep = {
      'list': []
    };
    for (var i = 0; i < deparmentList.length; ++i) {
      if (deparmentList[i].parentDepId == null) {
        deparmentList[i].padding = '16px';
        newDep.list.push(deparmentList[i]);
        this._addDepsRecursive(newDep, deparmentList, 1);
      }
    }
    return newDep.list;
  }
  _addDepsRecursive(newDep, departmentList, indent) {
    var parentId = newDep.list[newDep.list.length - 1].departmentId;
    for (var i = 0; i < departmentList.length; ++i) {
      if (departmentList[i].parentDepId == parentId) {
        var padding = 16 + indent * 20;
        departmentList[i].padding = padding + 'px';
        newDep.list.push(departmentList[i]);
        this._addDepsRecursive(newDep, departmentList, indent + 1);
      }
    }
  }
  loadPositions() {
    // this.service.getPositions(this._globals.companyInfo.companyId).subscribe((data) => {
    //   if (data.success) {
    //     this.positions = data.data;
    //   } else {
    //     this.positions = [];
    //   }
    // });
    this.positions = [];
  }
  disableButton() {
    this.DisableButton = true;
  }
  imgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['courseImg'].setValue(e.UserImg);
    } else {
      this.profile = "";
    }

    this.DisableButton = false;
  }
  pictureUploaded(e) {
    //console.log(e);
  }
  print() {
    console.warn(this.EmpForm.value);
    return false;
  }

  saveEmpData(bUploadNewScormFile = false) {

    if (this.EmpForm.value.hasFinalExam) {
      //multiply course duration by 60, as the backend expects seconds
      this.EmpForm.value.duration *= 60;
    }
    else {
      this.EmpForm.value.duration = 0;
      this.EmpForm.value.minResult = 0;
    }

    if (this.EmpForm.value.isScormCourse && this.mode == 0) {
      if (this.EmpForm.value.isOffline) {
        this.translate.get('scorm.ScormNotOffline').subscribe(value => { alert(value); });
        return false;
      }

      // this.renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
      // return true;
    }

    // Check if add, edit or copy was called.
    if (this.mode == 0) {
      // Mode: ADD
      // if (this.EmpForm.value.departmentIds.length > 0 || this.EmpForm.value.positionIds.length > 0) {
      //   this._bottomSheet.open(BottomSheetModifyCourse, { "data": this });
      // } else {
      if (this.EmpForm.value.isScormCourse) {
        //console.warn(this._fileUpload);
        this._fileUpload.nativeElement.click();
      } else {
        this.commitCourseData();
      }
      // }

      return true;
    } else if (this.mode == 1) {
      // Mode: EDIT
      if (this.EmpForm.value.isScormCourse && bUploadNewScormFile) {
        const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
          width: '400px',
          data: { companyId: 0, Action: false, Mes: this.translate.instant('dialog.UpdateScormSure') },
          autoFocus: false
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this._fileUpload.nativeElement.click();
          }
        });
      } else {
        this.notifyAndCommitEdited();
      }
    } else if (this.mode == 2) {
      // Mode: COPY
    }

    // var bTrue = true;
    // if (bTrue || this.mode > 0) {
    //   console.log("==============================");
    //   console.log(this.EmpForm.value.departmentIds);
    //   console.log(this.origDepartmentIds);
    //   console.log(JSON.stringify(this.EmpForm.value.departmentIds) == JSON.stringify(this.origDepartmentIds));
    //   console.log(this.EmpForm.value.mandatoryDepartmentIds);
    //   console.log(this.origMandatoryDepartmentIds);
    //   console.log(JSON.stringify(this.EmpForm.value.mandatoryDepartmentIds) == JSON.stringify(this.origMandatoryDepartmentIds));
    //   console.log("==============================");
    //   alert("Speichern von editierten bzw. zu kopierenden Kursen noch nicht implementiert!");
    //   return false;
    // }

    return true;
  }

  commitCourseData() {

    this._globals.spinnerText = "";
    this.spinner.show();

    this.service.add(this.EmpForm.value, this.CopyCourse, this.informEmp, this.selectionView.selected, this.selectionAdmin.selected).subscribe((data) => {
      // if (data.debug) {
      //   console.log(data.debugMes);
      // }
      this.spinner.hide();
      this._globals.spinnerText = this.spinnerText;
      if (data.success) {
        //this.EmpForm.reset();
        this.setDefaultFormValues();
        this.snackbar.open(this.translate.instant('alert.SaveCourseSuccess'), '', { duration: 3000 });
        var userType = this._globals.getUserType();
        if (userType == "1") {
          this.router.navigate(['./superadmin/course/view', data.courseId, 0], { skipLocationChange: false });
        } else if (userType == "2") {
          this.router.navigate(['./admin/course/view', data.courseId, 0], { skipLocationChange: false });
        } else if (userType == "3") {
          this.router.navigate(['./trainer/course/view', data.courseId, 0], { skipLocationChange: false });
        } else {
          this.router.navigate(['./employee/course/view', data.courseId, 0], { skipLocationChange: false });
        }
        //this._location.back()
      } else {
        this.snackbar.open(this.translate.instant('alert.AddCourseFail'), '', { duration: 3000 });
        this.postList = [];

        return false;
      }
    });
  }
  notifyAndCommitEdited() {
    this.commitEditedCourseData();
  }
  commitEditedCourseData(bNewScormFile = false) {
    this._globals.spinnerText = "";
    this.spinner.show();

    //console.log(this.EmpForm.value);

    this.service.edit(this.EmpForm.value, this.informEmp, this.selectionView.selected, this.selectionAdmin.selected, bNewScormFile).subscribe((data) => {
      this.spinner.hide();
      this._globals.spinnerText = "";

      if (data.success) {
        this.snackbar.open(this.translate.instant('alert.SaveCourseSuccess'), '', { duration: 3000 });
        this._location.back()
        // this.translate.get('alert.SaveCourseSuccess').subscribe(value => { alert(value); });
        // var userType = this._globals.getUserType();
        // if (userType == "1") {
        //   this.router.navigate(['./superadmin/course'], { skipLocationChange: false });
        // } else if (userType == "2") {
        //   this.router.navigate(['./admin/course'], { skipLocationChange: false });
        // } else if (userType == "3") {
        //   this.router.navigate(['./trainer/course'], { skipLocationChange: false });
        // } else {
        //   console.warn("Employee should not be on that page!");
        // }
      } else {
        this.snackbar.open(this.translate.instant('alert.EditCourseFail'), '', { duration: 3000 });
        this.postList = [];
      }
    });
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    //console.log(files);

    this.service.postCourse(this.fileToUpload).subscribe(data => {
      if (data != undefined && data["success"] != undefined && data["success"] == true) {
        this.EmpForm.value.scormPath = data["scormPath"];

        if (this.mode == 0) {
          this.service.add(this.EmpForm.value, this.CopyCourse, this.informEmp, this.selectionView.selected, this.selectionAdmin.selected).subscribe((data) => {
            //console.log(data);
            if (data && data.success) {
              //this.EmpForm.reset();
              this.setDefaultFormValues();
              this.snackbar.open(this.translate.instant('alert.SaveCourseSuccess'), '', { duration: 3000 });
              var userType = this._globals.getUserType();
              if (userType == "1") {
                this.router.navigate(['./superadmin/course/view', data.courseId, 0], { skipLocationChange: false });
              } else if (userType == "2") {
                this.router.navigate(['./admin/course/view', data.courseId, 0], { skipLocationChange: false });
              } else if (userType == "3") {
                this.router.navigate(['./trainer/course/view', data.courseId, 0], { skipLocationChange: false });
              } else {
                this.router.navigate(['./employee/course/view', data.courseId, 0], { skipLocationChange: false });
              }
            } else {
              this.snackbar.open(this.translate.instant('alert.AddCourseFail'), '', { duration: 3000 });
              this.postList = [];

              this._globals.spinnerText = "";
              this.spinner.hide();
              return false;
            }
            this._globals.spinnerText = "";
            this.spinner.hide();
            return true;
          });

          this._globals.spinnerText = "";
          this.spinner.hide();
          return true;
        } else if (this.mode == 1) {
          this._globals.spinnerText = "";
          this.commitEditedCourseData(true);
        }
      } else if (data != undefined && (data["eventType"] != undefined || data["progress"] != undefined)) {
        if (data["eventType"] == 0) {
          this.spinner.show();

        } else if (data["progress"] != undefined) {
          this._globals.spinnerText = data["progress"] + "<br>" + this.spinnerText;
        }
      } else {
        this.translate.get('scorm.UploadFailed').subscribe(value => { alert(value); });

        this._globals.spinnerText = "";
        this.spinner.hide();
        return false;
      }
    }, error => {
      //console.log(error);

      this._globals.spinnerText = "";
      this.spinner.hide();
      return false;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedView() {
    const numSelected = this.selectionView.selected.length;
    const numRows = this.permissionList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleView() {
    this.selectionAdmin.clear();
    this.isAllSelectedView() ?
      this.selectionView.clear() :
      this.permissionList.data.forEach(row => this.selectionView.select(row.UserId));
  }

  toggleView(event, row) {
    if (event.checked) {
      this.selectionAdmin.deselect(row);
    }
    this.selectionView.toggle(row);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedAdmin() {
    const numSelected = this.selectionAdmin.selected.length;
    const numRows = this.permissionList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleAdmin() {
    this.selectionView.clear();
    this.isAllSelectedAdmin() ?
      this.selectionAdmin.clear() :
      this.permissionList.data.forEach(row => this.selectionAdmin.select(row.UserId));
  }

  toggleAdmin(event, row) {
    if (event.checked) {
      this.selectionView.deselect(row);
    }
    this.selectionAdmin.toggle(row);
  }

  applyFilterPermissions(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.permissionList.filter = filterValue;

    if (this.permissionList.paginator) {
      this.permissionList.paginator.firstPage();
    }
  }

  cancel() {
    this._location.back();
  }
}

@Component({
  selector: 'app-modify-course-bottom-sheet',
  templateUrl: 'modify-adminCourse.component.bottomSheet.html',
  styleUrls: ['./modify-adminCourse.component.scss']
  //template: 'passed in {{ data }}'
})
export class BottomSheetModifyCourse {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _bottomSheetRef: MatBottomSheetRef<BottomSheetModifyCourse>) {
    //console.log(data);
    this._bottomSheetRef.disableClose = true;
  }

  setEmpInformationAndSend(sendEmpInformation: Number): void {
    this._bottomSheetRef.dismiss();
    if (this.data.mode == 0) {
      this.data.informEmp = sendEmpInformation;
      if (this.data.EmpForm.value.isScormCourse) {
        this.data.renderer.invokeElementMethod(this.data._fileUpload.nativeElement, 'click');
      } else {
        this.data.commitCourseData();
      }
    } else if (this.data.mode == 2) {
      // TODO: Course copy was called
    } else if (this.data.mode == 1) {
      this.data.commitEditedCourseData();
    }
    //event.preventDefault();
  }
  cancel() {
    this._bottomSheetRef.dismiss();
  }
}


export const MY_FORMATS_DAY_MONTH = {
  parse: {
    dateInput: 'DD.MM.',
  },
  display: {
    dateInput: 'DD.MM.',
    monthYearLabel: 'MMMM',
    dateA11yLabel: 'LL'
  },
};

export const MY_FORMATS_DAY = {
  parse: {
    dateInput: 'DD.',
  },
  display: {
    dateInput: 'DD.',
    monthYearLabel: 'MMMM',
    dateA11yLabel: 'LL'
  },
};


@Component({
  selector: 'app-modify-course-datepicker-year',
  templateUrl: './modify-adminCourseDatepicker.component.html',
  styleUrls: ['./modify-adminCourse.component.scss'],
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },
  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_DAY_MONTH }
  // ]
})
export class ModifyAdminCourseDatepickerYearComponent {
  @Input() recurringTimeSpan: any;
  @Output() updateValue = new EventEmitter();

  strPlaceholderText = "";

  constructor(private translate: TranslateService) {
    this.translate.get('course.RecurringPeriodYear').subscribe(value => { this.strPlaceholderText = value; });
  }

  updateParent() {
    this.updateValue.emit(this.recurringTimeSpan);
  }
}


// @Component({
//   selector: 'app-modify-course-datepicker-month',
//   templateUrl: './modify-adminCourseDatepicker.component.html',
//   styleUrls: ['./modify-adminCourse.component.scss'],
//   // providers: [
//   //   {
//   //     provide: DateAdapter,
//   //     useClass: MomentDateAdapter,
//   //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
//   //   },
//   //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_DAY }
//   // ]
// })
// export class ModifyAdminCourseDatepickerMonthComponent {
//   @Input() recurringTimeSpan: any;
//   @Output() updateValue = new EventEmitter();

//   strPlaceholderText = "";

//   constructor(private translate: TranslateService) {
//     this.translate.get('course.RecurringPeriodMonth').subscribe(value => { this.strPlaceholderText = value; });
//   }

//   updateParent() {
//     this.updateValue.emit(this.recurringTimeSpan);
//   }
// }
