import { Component, OnInit, ViewChild, Directive, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgControl } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { AdminEmployeeService } from '../../adminEmployee.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router, ActivatedRoute } from "@angular/router";

import { Globals } from '../../../../common/auth-guard.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-modify-employee',
  templateUrl: './modify-employee.component.html',
  styleUrls: ['./modify-employee.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class ModifyEmployeeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  bIsAdUser = false;
  public adDepartments = [];

  //bLoading = true;
  bLoadingEmpData = true;
  bLoadingGroupList = true;
  bLoadingDepartments = true;

  // nAPICalls = 3;
  // nResponses = 0;

  displayedColumnsPermissions: string[] = ['name', 'view', 'admin'];
  selectionView = new SelectionModel(true, []);
  selectionAdmin = new SelectionModel(true, []);

  EmpForm: FormGroup;
  postList = [];

  empId = undefined;

  departmentList = [];
  CompanyList = [];
  defaultPicture = 'assets/img/theme/no-photo.png';
  profile: String = "";
  imgPath = "";
  DisableButton = false;
  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Employee',
    method: 'POST',
    data: {}
  };
  public strProfilePicture = "";

  groupListTable: any;
  //bGroupListLoaded = false;

  constructor(protected service: AdminEmployeeService, private formBuilder: FormBuilder, private translate: TranslateService,
    public _globals: Globals, private _location: Location, private spinner: NgxSpinnerService, private snackbar: MatSnackBar,
    private route: ActivatedRoute) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.translate.get('employees.ProfilePicture').subscribe(value => { this.strProfilePicture = value; });

    this.setDefaultFormValues();

    this.groupListTable = new MatTableDataSource();

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

    this.route.params.subscribe(params => {
      if (params.id) {
        this.empId = params.id;
      }
    });

    this.spinner.hide();
  }
  ngOnInit() {
    if (this.empId) {
      this.loadEmployeeData();
    } else {
      this.bLoadingEmpData = false;
    }
    if (this._globals.companyInfo.companyId > 0) {
      this.loadDepartment(this._globals.companyInfo.companyId);
    }
    this.loadGroupList();
  }
  ngAfterViewInit() {
    this.groupListTable.sort = this.sort;
    this.groupListTable.paginator = this.paginator;
  }
  loadEmployeeData() {
    this.bLoadingEmpData = true;
    this.adDepartments = [];
    this.service.getById(this.empId, true, true).subscribe((data) => {
      //console.warn(data);
      if (data.success) {
        this.bIsAdUser = (data.data.ADUser == '1');

        data.data.departmentIds.forEach(department => {
          if (department.isADAssignment == '1') {
            this.adDepartments.push(department.departmentId);
          }
        });

        this.EmpForm.setValue({
          userType: Number(data.data.userType),
          FIRSTNAME: data.data.FIRSTNAME,
          LASTNAME: data.data.LASTNAME,
          FULLNAME: data.data.FULLNAME,
          staffNumber: data.data.staffNumber,
          departmentIds: data.data.departmentIds.map(a => a.departmentId),
          groupIds: data.data.groupIds.map(a => a.groupId),
          MOBILEPHONE: data.data.MOBILEPHONE,
          EMAIL: data.data.EmailID,
          epath: data.data.epath,
          CURRENTADDRESS: data.data.CURRENTADDRESS,
          comapnyId: data.data.empCompId,
          empId: data.data.empId,
          userId: data.data.userId
        });
        data.data.groupRights.forEach(groupRight => {
          if (Number(groupRight['permission']) == 2) {
            this.selectionAdmin.select(groupRight['groupId']);
          } else {
            this.selectionView.select(groupRight['groupId']);
          }
        });
        if (data.data.epath == "") {
          this.profile = "";
        } else {
          this.profile = this._globals.WebURL + "/" + data.data.epath;
        }
        this.bLoadingEmpData = false;
      } else {
      }
    });
  }
  loadGroupList() {
    this.bLoadingGroupList = true;
    this.service.getGroups().subscribe(data => {
      this.groupListTable.data = [];
      if (data.success) {
        this.groupListTable.data = data.data;
        this.bLoadingGroupList = false;
      }
    }, err => {
      // TODO: Handle error!
      console.error(err);
    });
  }
  loadDepartment(compId = null) {
    if (compId == null) {
      compId = this.EmpForm.value.comapnyId
    }
    this.bLoadingDepartments = true;
    // this.service.getAllpost(compId).subscribe((data) => {
    //   if (data.success) {
    //     this.postList = data.data;
    //   } else {
    //     this.postList = [];
    //   }
    //   this.bLoadingDepartments = false;
    // });
    this.service.getDepartment(compId).subscribe((data) => {
      if (data.success) {
        this.departmentList = this.groupDepartmentList(data.data);
      } else {
        this.departmentList = [];
      }
      this.bLoadingDepartments = false;
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
  ngOnDestroy() {
    window.onbeforeunload = undefined;
  }
  setDefaultFormValues() {
    this.EmpForm = this.formBuilder.group({
      userType: [4],
      FIRSTNAME: ['', Validators.required],
      LASTNAME: ['', Validators.required],
      FULLNAME: ['', Validators.required],
      staffNumber: [''],
      departmentIds: [[]],
      groupIds: [[]],
      MOBILEPHONE: [''],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      epath: [''],
      CURRENTADDRESS: [''],
      comapnyId: [this._globals.companyInfo.companyId, Validators.required],
      empId: [undefined],
      userId: [undefined]
    });
  }
  disableButton() {
    this.DisableButton = true;
  }
  imgUpload(e) {
    if (e.success) {
      this.EmpForm.controls['epath'].setValue(e.UserImg);
    } else {
      this.profile = "";
    }
    this.EmpForm.controls['comapnyId'].setValue(this._globals.companyInfo.companyId);
    this.DisableButton = false;
  }
  saveEmpData() {
    this.spinner.show();
    // var bTrue = true;
    // if (bTrue) {
    //   console.log(this.EmpForm.value);
    //   console.log(this.selectionAdmin.selected);
    //   console.log(this.selectionView.selected);
    //   return;
    // }

    if (this.empId) {
      this.service.edit(this.EmpForm.getRawValue(), this.selectionView.selected, this.selectionAdmin.selected).subscribe(data => {
        if (data.success) {
          this.snackbar.open(this.translate.instant('alert.SaveEmpSuccess'), '', { duration: 3000 });
          this._location.back();
        } else {
          // TODO: Print error
          if (data.CODE == '1') {
            alert(this.translate.instant('alert.MailInUse'));
          }
          this.spinner.hide();
        }
      }, err => {
        // TODO: handle error
        console.error(err);
      });
    } else {
      this.service.add(this.EmpForm.getRawValue(), this.selectionView.selected, this.selectionAdmin.selected).subscribe((data) => {
        //console.log(data);
        if (data.success) {
          //this.EmpForm.reset();
          this.setDefaultFormValues();
          this.profile = 'assets/img/theme/no-photo.png';
          //this.translate.get('alert.SaveEmpSuccess').subscribe(value => { alert(value); });
          this.snackbar.open(this.translate.instant('alert.SaveEmpSuccess'), '', { duration: 3000 });
          this._location.back();
        } else if (data.code) {
          if (data.code == 1) {
            this.translate.get('alert.RegEmpFailDupRec').subscribe(value => { alert(value); });
          } else if (data.code == 2) {
            this.translate.get('alert.RegEmpFailNumEmpExc').subscribe(value => { alert(value); });
          } else {
            this.translate.get('alert.AddEmpFail').subscribe(value => { alert(value); });
          }

          this.postList = [];
          this.spinner.hide();
        } else {
          this.translate.get('alert.AddEmpFail').subscribe(value => { alert(value); });
          // alert(data.mes);
          this.postList = [];
          this.spinner.hide();
        }
      });
    }
  }

  cancel() {
    this._location.back();
  }

  // incrementResponseCheckAllLoaded() {
  //   this.nResponses = this.nResponses + 1;
  //   console.log(this.nResponses + ' - ' + this.nAPICalls);
  //   if (this.nAPICalls <= this.nResponses) {
  //     this.bLoading = false;
  //   }
  // }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedView() {
    const numSelected = this.selectionView.selected.length;
    const numRows = this.groupListTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleView() {
    this.selectionAdmin.clear();
    this.isAllSelectedView() ?
      this.selectionView.clear() :
      this.groupListTable.data.forEach(row => this.selectionView.select(row.groupId));
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
    const numRows = this.groupListTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleAdmin() {
    this.selectionView.clear();
    this.isAllSelectedAdmin() ?
      this.selectionAdmin.clear() :
      this.groupListTable.data.forEach(row => this.selectionAdmin.select(row.groupId));
  }

  toggleAdmin(event, row) {
    if (event.checked) {
      this.selectionView.deselect(row);
    }
    this.selectionAdmin.toggle(row);
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
