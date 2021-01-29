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
// import * as jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
import { download } from '../../download/download.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

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
  employeeList: any;
  fullEmpList: any;
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

    this.spinner.hide();
  }
  applyEmpFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employeeList.filter = filterValue;

    if (this.employeeList.paginator) {
      this.employeeList.paginator.firstPage();
    }
  }

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

    return bMatch;
  }

  loadEmp() {
    this.bLoading = true;
    this.bEmpEntriesFound = false;
    this.employeeList.data = [];
    this.fullEmpList = [];
    this._service.get(this._globals.companyInfo.companyId, true).subscribe((data) => {
      if (data.success) {
        if (data.data.length > 0) {
          this.bEmpEntriesFound = true;
        }
        this.fullEmpList = data.data;
        this.setEmpList(this._globals.empFilter);
        this.setPaginationInfo();
        this.bLoading = false;
        this.spinner.hide();
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

  editCourse(id) {
    this._service.editEmpCouse(this.selectedCourse, id, this.selectedDate, this.assCourseId).subscribe((data) => {
      if (data.success) {
        this.selectedCourse = "";
        this.selectedDate = "";
        alert(data.mes);
      }
    });
  }

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

  public pageChanged(event: any) {
    if (event) {
      delete event.previousPageIndex;
      delete event.length;
      localStorage.setItem('empTableInfo', JSON.stringify(event));
    }
  }

  private setPaginationInfo() {
    try {
      let strEmpTableInfo: string = localStorage.getItem('empTableInfo');
      if (strEmpTableInfo !== null) {
        let empTableInfo: Object = JSON.parse(strEmpTableInfo);
        setTimeout(() => {
          this.paginator.pageSize = Number(empTableInfo['pageSize']);
          this.paginator.pageIndex = Math.min(Number(empTableInfo['pageIndex']), this.paginator.getNumberOfPages() - 1);
          this.paginator.page.next();
        }, 0);
      }
    } catch (error) {
      localStorage.removeItem('empTableInfo');
    }
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