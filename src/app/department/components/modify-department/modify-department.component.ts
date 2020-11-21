import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Directive, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { DepartmentService } from '../../department.service';
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationBoxComponent } from '../../../theme/components/confirmation-box/confirmation-box.component';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { NgControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modify-department',
  templateUrl: './modify-department.component.html',
  styleUrls: ['./modify-department.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ]),
    trigger('visibilityChangedAddMember', [
      state('shown', style({ opacity: 1, height: '*', zIndex: 2 })),
      state('hidden', style({ opacity: 0, height: 0, zIndex: -1 })),
      transition('* => *', animate(200))
    ]),
    trigger('visibilityChangedSubDep', [
      state('shown', style({ opacity: 1, height: '*', zIndex: 2 })),
      state('hidden', style({ opacity: 0, height: 0, zIndex: -1 })),
      transition('* => *', animate(200))
    ])
  ]
})
export class ModifyDepartmentComponent implements OnInit, AfterViewInit {
  public leaderMultiFilterCtrl: FormControl = new FormControl();
  public filteredLeaderMulti: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  public leaderMultiFilterCtrlRec: FormControl = new FormControl();
  public filteredLeaderMultiRec: ReplaySubject<[]> = new ReplaySubject<[]>(1);

  public activeSelect = undefined;

  displayedColumns: string[] = ['select', 'LASTNAME', 'FIRSTNAME'];
  selection = new SelectionModel(true, []);

  bLoading = true;
  bAddMember = false;
  addMemberPos = '0px';

  initialId = undefined;

  empRoot = true;

  public comapnyId;
  public EmpForm: FormGroup;
  // public subDepArray: Array<any> = [];
  //public newAttribute: any = {};
  //depLeaderControl = new FormControl();
  //DepList = [];
  public defaultLogoPicture = '';
  public defaultBGPicture = '';
  public defaultBannerPicture = '';
  public profile: String = "assets/img/theme/add-image.png";
  public CompanyList = [];
  public strDepartmentLogo = "";
  public strDepartmentBackground = "";
  public strDepartmentBanner = "";
  public DisableButton = 0;
  public tabSel = new FormControl(1);
  public tabs = [];
  public subDepsToDelete = [];

  userList: any;

  addMemberList = undefined;

  searchText = "";

  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Department',
    method: 'POST',
    data: {}
  };
  public uploaderBannerOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Department&SubfolderName=banner',
    method: 'POST',
    data: {}
  };
  public uploaderBackgroundOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Department&SubfolderName=background',
    method: 'POST',
    data: {}
  };

  public overviewDep: any = {};

  public bAddDepartment = true;
  private loadingProgress = {};

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('addmember', { static: true }) addMemberDiv: ElementRef;
  @ViewChild('tabview', { static: true }) tabView: ElementRef;

  constructor(private route: ActivatedRoute, public router: Router, public dialog: MatDialog, private formBuilder: FormBuilder,
    private translate: TranslateService, public _globals: Globals, public service: DepartmentService, private spinner: NgxSpinnerService,
    private snackbar: MatSnackBar, private _location: Location) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    //this.spinner.show();


    this.translate.get('department.Logo').subscribe(value => { this.strDepartmentLogo = value; });
    this.translate.get('department.Background').subscribe(value => { this.strDepartmentBackground = value; });
    this.translate.get('department.Banner').subscribe(value => { this.strDepartmentBanner = value; });

    this.EmpForm = this.formBuilder.group({
      departmentId: undefined,
      departmentLogo: [''],
      parentDepId: null,
      departmentBanner: [''],
      departmentBackground: [''],
      departmentName: ['', Validators.required],
      dep_heapId: [[]],
      member: [[]],
      depPassword: [''],
      subDepartments: [[]],
      companyId: ['']
    });

    this.userList = new MatTableDataSource();

    this.overviewDep = {
      name: '',
      designation: '',
      subordinates: [],
      parentObjects: []//,
      //cssClass: 'mui-oc-ceo'
    };

    var obj = this;
    this.EmpForm.get('departmentName').valueChanges.subscribe(departmentName => {
      obj.overviewDep.name = departmentName;
    });
    this.EmpForm.get('dep_heapId').valueChanges.subscribe(dep_heapId => {
      obj.overviewDep.designation = "";
      // for (var i = 0; i < this.userList.data.length; ++i) {
      //   if (obj.userList.data[i].value == dep_heapId) {
      //     obj.overviewDep.designation = obj.userList.data[i].title;
      //   }
      // }
      dep_heapId.forEach(depLeader => {
        this.userList.data.forEach(userInfo => {
          if (userInfo.UserId == depLeader) {
            obj.overviewDep.designation += userInfo.FULLNAME + '\n';
          }
        });
      });
    });

    this.route.params.subscribe(params => {
      if (params.id != undefined) {
        this.bAddDepartment = false;
        this.tabSel.setValue(0);
        this.loadingProgress["loadingDepartment"] = true;
        this.initialId = params.id;
        this.getDepartmentById(params.id);
      }
    });

    this.loadingProgress["loadingCompany"] = true;
    this.service.getAllcompany().subscribe((data) => {
      if (this._globals.companyInfo.companyId > 0) {
        this.loadingProgress["loadingEmployees"] = true;
        this.loadEmp(this._globals.companyInfo.companyId);
      }
      if (data.success) {
        this.CompanyList = data.data;
      } else {
        this.CompanyList = [];
      }
      this.loadingProgress["loadingCompany"] = false;
      this._checkLoadingDoneAndHideSpinner();
    });

    this.spinner.hide();
  }
  ngOnInit() {
    this.leaderMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLeaderMulti();
      });

    this.leaderMultiFilterCtrlRec.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLeaderMultiRec();
      });
  }
  protected filterLeaderMulti() {
    if (!this.userList.data) {
      return;
    }
    // get the search keyword
    let search = this.leaderMultiFilterCtrl.value;
    if (!search) {
      this.filteredLeaderMulti.next(this.userList.data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the leaders
    this.filteredLeaderMulti.next(
      this.userList.data.filter(user => (user.FIRSTNAME.toLowerCase().indexOf(search) > -1 || user.LASTNAME.toLowerCase().indexOf(search) > -1 || user.FULLNAME.toLowerCase().indexOf(search) > -1))
    );
  }
  protected filterLeaderMultiRec() {
    if (!this.userList.data) {
      return;
    }
    // get the search keyword
    let search = this.leaderMultiFilterCtrlRec.value;
    if (!search) {
      this.filteredLeaderMultiRec.next(this.userList.data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the leaders
    this.filteredLeaderMultiRec.next(
      this.userList.data.filter(user => (user.FIRSTNAME.toLowerCase().indexOf(search) > -1 || user.LASTNAME.toLowerCase().indexOf(search) > -1 || user.FULLNAME.toLowerCase().indexOf(search) > -1))
    );
  }
  openChanged(event, currentSubDep) {
    if (event) {
      this.activeSelect = currentSubDep;
    } else {
      this.activeSelect = undefined;
    }
    this.filterLeaderMultiRec();
  }
  // filterMyEmps(event) {
  //   console.log(event);
  // }
  ngAfterViewInit() {
    this.userList.paginator = this.paginator;
    this.userList.sort = this.sort;
    var obj = this;
    this.userList.filterPredicate = function (data: any, filter: string): boolean {
      var bFilterRet = obj.filterFunction(data.FIRSTNAME + ' ' + data.LASTNAME + ' ' + data.FULLNAME, filter);
      if (!bFilterRet && data.EmailID) {
        bFilterRet = obj.filterFunction(data.EmailID, filter);
      }
      return bFilterRet;
    }
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
  applyFilterDepMember(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userList.filter = filterValue;

    if (this.userList.paginator) {
      this.userList.paginator.firstPage();
    }
  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
  }
  disableButton() {
    this.DisableButton = this.DisableButton + 1;
  }
  imgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['departmentLogo'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  BackgroundImgUpload(e) {
    // console.log(e);
    if (e.success) {
      this.EmpForm.controls['departmentBackground'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  BannerImgUpload(e) {
    // console.log(e);
    if (e.success) {
      this.EmpForm.controls['departmentBanner'].setValue(e.UserImg);
    }

    this.DisableButton = this.DisableButton - 1;
  }
  loadEmp(EmpId) {
    var obj = this;
    //obj.DepList = [];
    obj.comapnyId = EmpId;
    if (this._globals.companyInfo.companyId == 0) {
      obj.CompanyList.forEach(function (res) {
        if (res.companyId == obj.comapnyId) {
          obj.uploaderOptions.url = obj._globals.APIURL + 'Company/CompanyImgUpload?folderName=Department&folder=' + res.webUrl;
          obj.uploaderBannerOptions.url = obj._globals.APIURL + 'Company/CompanyImgUpload?folderName=Department&SubfolderName=banner&folder=' + res.webUrl
          obj.uploaderBackgroundOptions.url = obj._globals.APIURL + 'Company/CompanyImgUpload?folderName=Department&SubfolderName=background&folder=' + res.webUrl;
        }
      });
    }
    this.service.getEmp(EmpId).subscribe((data) => {
      if (data.success) {
        this.userList.data = data.data;
        this.filteredLeaderMulti.next(this.userList.data.slice());
        // for (var i = 0; i < data.data.length; i++) {
        //   if (data.data[i].UserType == 4) {
        //     this.DepList.push({ "title": data.data[i].FIRSTNAME + " " + data.data[i].LASTNAME, "value": data.data[i].empId })
        //   }
        // }
        this.updateOverview();
      } else {
        this.userList.data = [];
      }
      this.loadingProgress["loadingEmployees"] = false;
      this._checkLoadingDoneAndHideSpinner();
    }, err => {
      // TODO: error handling
      console.error(err);
    });
  }
  getDepartmentById(Id) {
    this.service.getById(Id, false).subscribe((data) => {
      //console.log(data);
      if (data.success) {
        //console.log(data.data);
        //this.loadEmp(data.data.companyId);
        if (data.data.logo) {
          this.defaultLogoPicture = this._globals.WebURL + "/" + data.data.logo;
        }
        if (data.data.banner) {
          this.defaultBannerPicture = this._globals.WebURL + "/" + data.data.banner;
        }
        if (data.data.background) {
          this.defaultBGPicture = this._globals.WebURL + "/" + data.data.background;
        }
        if (this._globals.companyInfo.companyId == 0) {
          this.uploaderOptions.url = this._globals.APIURL + 'Company/CompanyImgUpload?folderName=Department&folder=' + data.data.webUrl;
          this.uploaderBannerOptions.url = this._globals.APIURL + 'Company/CompanyImgUpload?folderName=Department&SubfolderName=banner&folder=' + data.data.webUrl
          this.uploaderBackgroundOptions.url = this._globals.APIURL + 'Company/CompanyImgUpload?folderName=Department&SubfolderName=background&folder=' + data.data.webUrl;
        }

        this.empRoot = data.data.empRoot;

        this.EmpForm.setValue({
          departmentId: data.data.departmentId,
          departmentLogo: data.data.logo,
          parentDepId: data.data.parentDepId,
          departmentBanner: data.data.banner,
          departmentBackground: data.data.background,
          departmentName: data.data.departmentName,
          dep_heapId: data.data.dep_heapId ? data.data.dep_heapId : [],
          depPassword: data.data.depPassword,
          subDepartments: data.data.subDepartments,
          companyId: data.data.companyId,
          member: data.data.member
        });
      }
      this.loadingProgress["loadingDepartment"] = false;
      this.updateOverview();
    });
  }
  addSubDep(parent = undefined) {
    var newSubDep = {
      departmentId: undefined,
      departmentName: "",
      dep_heapId: [],
      member: [],
      depPassword: '',
      subDepartments: []
    };

    if (parent == undefined) {
      this.EmpForm.value.subDepartments.push(newSubDep);
    } else {
      // Open new tab and load children
      if (parent != this.tabs[this.tabs.length - 1]) {
        this.tabs.push(parent);
        this.tabSel.setValue(this.tabs.length + 1);
      }
      parent.subDepartments.push(newSubDep);
    }
  }
  editSubDep(subDep) {
    this.tabs.push(subDep);
    this.tabSel.setValue(this.tabs.length + 1);
  }
  deleteSubDep(index) {
    this.translate.get('dialog.DeleteSubDepSure').subscribe(value => {
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { Action: false, Mes: value }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          var deletedSubDeps = [];
          if (this.tabs.length == 0) {
            deletedSubDeps = this.EmpForm.value.subDepartments.splice(index, 1);
          } else {
            deletedSubDeps = this.tabs[this.tabs.length - 1].subDepartments.splice(index, 1);
          }
          if (!this.bAddDepartment && deletedSubDeps.length > 0 && deletedSubDeps[0].departmentId != undefined) {
            if (deletedSubDeps[0].departmentId == this.initialId) {
              this.initialId = undefined;
            }
            this.subDepsToDelete = this.subDepsToDelete.concat(deletedSubDeps);
          }
        }
      });
    });
  }
  indexChanged(index) {
    if (index >= 1) {
      this.tabs.splice(index - 1, this.tabs.length - index + 1);
    } else {
      if (index == 0) {
        this.updateOverview();
      }
      this.tabs = [];
    }
    this.tabSel.setValue(index);
  }
  updateOverview() {
    //console.log(this.EmpForm.value);
    this.overviewDep.name = this.EmpForm.value.departmentName;
    this.overviewDep.designation = "";
    this.EmpForm.getRawValue().dep_heapId.forEach(depLeader => {
      this.userList.data.forEach(userInfo => {
        if (userInfo.UserId == depLeader) {
          this.overviewDep.designation += userInfo.FULLNAME + '\n';
        }
      });
    });
    // for (var i = 0; i < this.userList.data.length; ++i) {
    //   if (this.userList.data[i].value == this.EmpForm.value.dep_heapId) {
    //     this.overviewDep.designation = this.userList.data[i].title;
    //   }
    // }
    this.overviewDep.subordinates = [];
    this.overviewDep.parentObjects = [];
    this.recursiveAddOverview(this.overviewDep, this.EmpForm.value);

    this._checkLoadingDoneAndHideSpinner();
  }
  recursiveAddOverview(overviewDep, department) {
    for (var i = 0; i < department.subDepartments.length; ++i) {
      var newSubDep = {
        name: department.subDepartments[i].departmentName,
        designation: '',
        subordinates: [],
        parentObjects: []
      };
      for (var j = 0; j < overviewDep.parentObjects.length; ++j) {
        newSubDep.parentObjects.push(overviewDep.parentObjects[j]);
      }
      department.subDepartments[i].dep_heapId.forEach(depLeader => {
        this.userList.data.forEach(userInfo => {
          if (userInfo.UserId == depLeader) {
            newSubDep.designation += userInfo.FULLNAME + '\n';
          }
        });
      });
      // for (var j = 0; j < this.userList.data.length; ++j) {
      //   if (this.userList.data[j].value == department.subDepartments[i].dep_heapId) {
      //     newSubDep.designation = this.userList.data[j].title;
      //   }
      // }
      newSubDep.parentObjects.push(department);
      this.recursiveAddOverview(newSubDep, department.subDepartments[i]);
      overviewDep.subordinates.push(newSubDep);
    }
  }
  saveEmpData() {
    var pwList = [];
    if (this.EmpForm.value.depPassword != "") {
      pwList.push(this.EmpForm.value.depPassword);
    }
    this._GetPWListRecursive(pwList, this.EmpForm.value.subDepartments);
    var uniquePw = new Set(pwList);
    if (pwList.length == uniquePw.size) {
      if (this.bAddDepartment) {
        this.service.add(this.EmpForm.value, this.comapnyId, pwList).subscribe((data) => {
          this._afterCommit(data);
        });
      } else {
        // console.log(this.EmpForm.getRawValue());
        // return;
        this.service.updateDepartment(this.EmpForm.getRawValue(), this.subDepsToDelete, pwList).subscribe((data) => {
          this._afterCommit(data);
        });
      }
    } else {
      this.translate.get('alert.DuplicatePW').subscribe(value => { alert(value); });
    }
  }
  private _GetPWListRecursive(pwList: Array<string>, subDeps: any) {
    for (var i = 0; i < subDeps.length; ++i) {
      if (subDeps[i].depPassword != "") {
        pwList.push(subDeps[i].depPassword);
      }
      this._GetPWListRecursive(pwList, subDeps[i].subDepartments);
    }
  }
  private _afterCommit(data) {
    if (data.success) {
      this.snackbar.open(this.translate.instant('alert.SaveDepSuccess'), '', { duration: 3000 });
      this.spinner.show();
      if (!this.initialId || this.bAddDepartment) {
        var userType = this._globals.getUserType();
        if (userType == "1") {
          this.router.navigate(['./superadmin/department', data.departmentId], { skipLocationChange: false });
        } else if (userType == "2") {
          this.router.navigate(['./admin/department', data.departmentId], { skipLocationChange: false });
        } else if (userType == "3") {
          // this.router.navigate(['./employee/department', data.departmentId], { skipLocationChange: false });
        } else {
          // this.router.navigate(['./employee/department', data.departmentId], { skipLocationChange: false });
        }
      } else {
        this._location.back();
      }
    } else {
      if (data.mes == "PWFAIL") {
        //this.translate.get('alert.AddDepDuplicatePW').subscribe(value => { alert(value); });
        this.translate.get('alert.DuplicatePW').subscribe(value => { alert(value); });
      } else if (data.pwUpdateFail && data.data.length > 0) {
        //console.error(data.data);
        this.translate.get('alert.AND').subscribe(value => {
          var strFailedPwUpdates = "";
          if (data.data.length == 1) {
            strFailedPwUpdates = data.data[0];
          } else if (data.data.length == 2) {
            strFailedPwUpdates = data.data[0] + " " + value + " " + data.data[1];
          } else {
            for (var i = 0; i < data.data.length - 2; ++i) {
              strFailedPwUpdates += (data.data[i] + ", ");
            }
            strFailedPwUpdates += (data.data[data.data.length - 2] + " " + value + " " + data.data[data.data.length - 1]);
          }
          this.translate.get('alert.FailedForFollowing').subscribe(value => {
            alert(value + " " + strFailedPwUpdates);
          });
        });
        // TODO: message that something with the subdepartments might have failed!
      } else {
        this.translate.get('alert.AddDepFail').subscribe(value => { alert(value); });
      }
    }
  }
  itemClicked(event) {
    for (var i = 1; i < event.parentObjects.length; ++i) {
      this.tabs.push(event.parentObjects[i]);
    }
    this.tabSel.setValue(this.tabs.length + 1);
  }
  private _checkLoadingDoneAndHideSpinner() {
    var bHideSpinner = true;
    for (var key in this.loadingProgress) {
      if (this.loadingProgress[key]) {
        bHideSpinner = false;
      }
    }
    if (bHideSpinner) {
      //this.spinner.hide();
      this.bLoading = false;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.userList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.userList.data.forEach(row => this.selection.select(row.UserId));
  }

  // ADD MEMBER STUFF
  addMember(event, memberList, index) {
    // console.log(event);
    // console.log(this.tabView);
    // console.log(this.tabView.nativeElement.offsetTop);
    document.removeEventListener('click', this.outsideClickListener)
    this.selection.clear();
    memberList.forEach(member => {
      this.selection.select(member);
    });
    this.addMemberList = memberList;

    if (index != null) {
      this.addMemberPos = (270 * (index + 1) + this.tabView.nativeElement.offsetTop) + 'px';
    } else {
      this.addMemberPos = event.layerY + 'px';
    }

    this.searchText = "";
    this.userList.filter = "";

    if (this.userList.paginator) {
      this.userList.paginator.firstPage();
    }

    this.bAddMember = true;
    var obj = this;
    setTimeout(() => {
      obj.addMemberDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
      document.addEventListener('click', obj.outsideClickListener)
    }, 300);
  }
  isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  outsideClickListener = event => {
    if (!this.addMemberDiv.nativeElement.contains(event.target) && this.isVisible(this.addMemberDiv.nativeElement)) { // or use: event.target.closest(selector) === null
      event.preventDefault();
      event.stopPropagation();
      this.cancelAddMember();
    }
  }
  removeClickListener = () => {
    document.removeEventListener('click', this.outsideClickListener)
  }
  cancelAddMember() {
    document.removeEventListener('click', this.outsideClickListener);
    this.selection.clear();
    this.bAddMember = false;
  }
  confirmAddMember() {
    document.removeEventListener('click', this.outsideClickListener);
    while (this.addMemberList.length > 0) {
      this.addMemberList.pop();
    }
    this.selection.selected.forEach(member => {
      this.addMemberList.push(member);
    });
    this.selection.clear();
    this.bAddMember = false;
  }

  cancel() {
    this._location.back();
  }
}

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    setTimeout(() => {
      this.ngControl.control[action]();
    });
  }

  constructor(private ngControl: NgControl) {
  }

}
