import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DepartmentService } from '../../department.service';
import { Globals } from '../../../common/auth-guard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmationBoxComponent } from '../../../theme/components/confirmation-box/confirmation-box.component';
import moment from 'moment';

import { ViewGroupComponent } from '../../../groups/components/view-group/view-group.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class ViewDepartmentComponent implements OnInit, AfterViewInit {
  bLoading = true;

  departmentId = undefined;
  departmentInfo = undefined;
  overviewDep: any = {};

  currentDep = undefined;

  groupChildEventsSubject: Subject<Number> = new Subject<Number>();

  //@ViewChild('departmentchart', { static: true }) public depChart: ElementRef;

  constructor(private route: ActivatedRoute, private spinner: NgxSpinnerService, protected service: DepartmentService, private formBuilder: FormBuilder,
    private translate: TranslateService, public _globals: Globals, private _location: Location, private snackbar: MatSnackBar, public router: Router,
    public dialog: MatDialog) {

    this.spinner.show();

    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
  }
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      if (params.id != undefined) {
        this.departmentId = params.id;
        if (!this.currentDep) {
          this.currentDep = this.departmentId;
        }
        this.bLoading = true;
        this.getDepartmentById(this.departmentId);
      }
    });
  }

  itemClicked(event) {
    this.deselectAll(this.overviewDep);
    //event.cssClass = 'mui-oc-selected-dep';
    event.cssClass = event.baseClass + '-selected';
    this.groupChildEventsSubject.next(event.departmentId);
    this.currentDep = event.departmentId;

    // Set new location for "assignment => back"
    var result = /([A-Za-z/]*[/])[0-9]*$/.exec(this._location.path())[1] + event.departmentId;
    this._location.replaceState(result);
  }

  getDepartmentById(departmentId, updateChild = true) {
    var obj = this;
    this.service.getById(departmentId, true).subscribe((data) => {
      //console.log(data);
      if (data.success) {
        if (updateChild) {
          obj.groupChildEventsSubject.next(departmentId);
        }
        //console.log(data.data);
        obj.departmentInfo = data.data;
      }
      // this.loadingProgress["loadingDepartment"] = false;
      obj.updateOverview();
      obj.bLoading = false;
      this.spinner.hide();
    });
  }

  updateOverview() {
    this.overviewDep.name = this.departmentInfo.departmentName;
    this.overviewDep.designation = "";
    // for (var i = 0; i < this.userList.data.length; ++i) {
    //   if (this.userList.data[i].value == this.EmpForm.value.dep_heapId) {
    //     this.overviewDep.designation = this.userList.data[i].title;
    //   }
    // }

    this.overviewDep.subordinates = [];
    this.overviewDep.parentObjects = [];
    this.overviewDep.departmentId = this.departmentInfo.departmentId;
    this.overviewDep.cssClass = this.getBaseClass(this.departmentInfo.status);
    this.overviewDep.baseClass = this.getBaseClass(this.departmentInfo.status);
    if (this.departmentInfo.departmentId == this.currentDep) {
      this.overviewDep.cssClass += '-selected';
    }
    if (this.departmentInfo.logo && this.departmentInfo.logo != '') {
      this.overviewDep.imageUrl = this._globals.WebURL + '/' + this.departmentInfo.logo;
    }
    this.recursiveAddOverview(this.overviewDep, this.departmentInfo);

    // console.log(this.departmentInfo);
    // console.log(this.overviewDep);

    //this._checkLoadingDoneAndHideSpinner();
  }

  getBaseClass(status) {
    if (status == -1) {
      return 'mui-oc-dep-overdue';
    } else if (status == 0) {
      return 'mui-oc-dep-open';
    } else {
      return 'mui-oc-dep-done';
    }
  }

  recursiveAddOverview(overviewDep, department) {
    for (var i = 0; i < department.subDepartments.length; ++i) {
      var newSubDep = {
        name: department.subDepartments[i].departmentName,
        designation: '',
        subordinates: [],
        parentObjects: [],
        departmentId: department.subDepartments[i].departmentId,
        cssClass: this.getBaseClass(department.subDepartments[i].status),
        baseClass: this.getBaseClass(department.subDepartments[i].status),
        imageUrl: ''
      };
      if (department.subDepartments[i].logo && department.subDepartments[i].logo != '') {
        newSubDep.imageUrl = this._globals.WebURL + '/' + department.subDepartments[i].logo;
      }
      if (this.currentDep == department.subDepartments[i].departmentId) {
        newSubDep.cssClass += '-selected';
      }
      for (var j = 0; j < overviewDep.parentObjects.length; ++j) {
        newSubDep.parentObjects.push(overviewDep.parentObjects[j]);
      }
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

  deselectAll(parent) {
    parent.cssClass = parent.baseClass;
    parent.subordinates.forEach(child => {
      this.deselectAll(child);
    });
  }

  deleteDepartment() {
    var obj = this;
    this.translate.get('dialog.DeleteDepSure').subscribe(value => {
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: this.departmentId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.delete(this.currentDep).subscribe((res) => {
            if (res.success) {
              if (this.currentDep == this.departmentInfo.departmentId) {
                if (this._globals.getUserType() == "1") {
                  this.router.navigate(['superadmin/department'], { skipLocationChange: false });
                } else if (this._globals.getUserType() == "2") {
                  this.router.navigate(['admin/department'], { skipLocationChange: false });
                } else if (this._globals.getUserType() == "3") {
                  this.router.navigate(['trainer/department'], { skipLocationChange: false });
                } else {
                  this.router.navigate(['employee/department'], { skipLocationChange: false });
                }
              } else {
                // // obj.departmentId = obj.departmentInfo.departmentId;
                // // obj.getDepartmentById(obj.departmentInfo.departmentId);
                // this.router.navigate(['./', obj.departmentInfo.departmentId]);
                var result = /([A-Za-z/]*[/])[0-9]*$/.exec(this._location.path())[1] + obj.departmentInfo.departmentId;
                this._location.replaceState(result);
                obj.departmentId = obj.departmentInfo.departmentId;
                obj.currentDep = obj.departmentId;
                obj.getDepartmentById(obj.departmentInfo.departmentId);
              }
            }
          });
        }
      });
    });
  }

  openEditView() {
    // var result = /([A-Za-z/]*[/])[0-9]*$/.exec(this._location.path())[1] + this.departmentInfo.departmentId;
    // this._location.replaceState(result);
    if (this._globals.getUserType() == "1") {
      this.router.navigate(['superadmin/department/edit', this.currentDep], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "2") {
      this.router.navigate(['admin/department/edit', this.currentDep], { skipLocationChange: false });
    } else if (this._globals.getUserType() == "3") {
      this.router.navigate(['trainer/department/edit', this.currentDep], { skipLocationChange: false });
    } else {
      this.router.navigate(['employee/department/edit', this.currentDep], { skipLocationChange: false });
    }
  }

  onWheel(event: WheelEvent): void {
    // // console.log(event);
    // // (<Element>event.target).parentElement.scrollLeft += event.deltaY;
    // console.log(element);
    // element.scrollLeft += event.deltaY;
    // //this.depChart.nativeElement.scrollLeft += event.deltaY;
    // event.preventDefault();
  }

  updateStatus() {
    this.getDepartmentById(this.currentDep, false);
  }
}
