import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { AdminEmployeeService } from '../../adminEmployee.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Globals } from '../../../../common/auth-guard.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-edit-employees',
  templateUrl: './edit-employees.component.html',
  styleUrls: ['./edit-employees.component.scss']
})
export class EditEmployeesComponent implements OnInit {

  public EmpForm: FormGroup;
  public postList = [];
  public CompanyList = [];
  public departmentList = [];

  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile = "";
  public imgPath = "";
  public DisableButton = false;
  public uploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Company/userImgUpload?folderName=Employee',
    method: 'POST',
    data: {}
  };
  public strProfilePicture: String = "";

  private previousDepartment = null;
  private previousPosition = null;
  private bDepartmentChanged = false;
  private bPositionChanged = false;

  constructor(protected service: AdminEmployeeService, private formBuilder: FormBuilder, private translate: TranslateService,
    public _globals: Globals, private route: ActivatedRoute, private _bottomSheet: MatBottomSheet, public router: Router) {

    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.translate.get('employees.ProfilePicture').subscribe(value => { this.strProfilePicture = value; });

    this.EmpForm = this.formBuilder.group({
      empId: ['', Validators.required],
      FIRSTNAME: ['', Validators.required],
      LASTNAME: [''],
      GENDER: ['', Validators.required],
      //departmentId: {value: '0', disabled: true},
      departmentId: ['0'],
      postOfDepartment: ['0'],
      MOBILEPHONE: [''],
      EMAIL: ['', Validators.compose([Validators.required, Validators.email])],
      epath: [''],
      CURRENTADDRESS: [''],
      empEdu: [''],
      comapnyId: ['']
    });

    this.route.params.subscribe(params => {
      this.loadEmployessById(params.id);
    });

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
  loadDepartment(compId = null) {
    if (compId == null) {
      compId = this.EmpForm.value.comapnyId
    }
    // this.service.getAllpost(compId).subscribe((data) => {
    //   if (data.success) {
    //     this.postList = data.data;
    //   } else {
    //     this.postList = [];
    //   }
    // });
    this.service.getDepartment(compId).subscribe((data) => {
      if (data.success) {
        this.departmentList = data.data;
      } else {
        this.departmentList = [];
      }
    });
  }
  loadEmployessById(empId) {
    this.service.getById(empId).subscribe((data) => {
      if (data.success) {
        this.previousDepartment = data.data.departmentId;
        this.previousPosition = data.data.positionId;
        this.loadDepartment(data.data.empCompId);
        this.EmpForm.setValue({
          empId: data.data.empId,
          FIRSTNAME: data.data.FIRSTNAME,
          LASTNAME: data.data.LASTNAME,
          GENDER: data.data.GENDER,
          departmentId: data.data.departmentId,
          postOfDepartment: data.data.positionId,
          MOBILEPHONE: data.data.MOBILEPHONE,
          EMAIL: data.data.EmailID,
          epath: data.data.epath,
          CURRENTADDRESS: data.data.CURRENTADDRESS,
          empEdu: data.data.empEdu,
          comapnyId: data.data.empCompId
        });
        if (data.data.epath == "") {
          this.profile = "";
        } else {
          this.profile = this._globals.WebURL + "/" + data.data.epath;
        }
      } else {
      }
    });
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
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

    this.DisableButton = false;
  }

  saveEmpData() {

    // console.log(this.EmpForm.value.postOfDepartment);
    // console.log(this.previousPosition);

    this.bPositionChanged = false;
    if (this.previousPosition != this.EmpForm.value.postOfDepartment && this.previousPosition != null && this.previousPosition != '0' && this.previousPosition != 0) {
      this.bPositionChanged = true;
    }

    this.bDepartmentChanged = false;
    if (this.previousDepartment != this.EmpForm.value.departmentId && this.previousDepartment != null && this.previousDepartment != '0' && this.previousDepartment != 0) {
      this.bDepartmentChanged = true;
    }

    if (this.bPositionChanged || this.bDepartmentChanged) {
      this._bottomSheet.open(BottomSheetEditEmployees, { "data": this });
    } else {
      this.commitEditedEmployeeData(-1, -1);
    }

    // if (this.previousDepartment != this.EmpForm.value.departmentId && this.previousDepartment != null && this.previousDepartment != '0' && this.previousDepartment != 0) {
    // } else {
    //   this.commitEditedEmployeeData(-1);
    // }
  }
  commitEditedEmployeeData(handlePreviousPosAss: Number, handlePreviousDepAss: Number) {
    this.service.edit(this.EmpForm.value, handlePreviousPosAss, handlePreviousDepAss).subscribe((data) => {
      //console.log(data);
      if (data.success) {
        this.translate.get('alert.SaveEmpSuccess').subscribe(value => { alert(value); });
        var userType = this._globals.getUserType();
        if (userType == "1") {
          this.router.navigate(['./superadmin/employees'], { skipLocationChange: false });
        } else if (userType == "2") {
          this.router.navigate(['./admin/employees'], { skipLocationChange: false });
        } else if (userType == "3") {
          this.router.navigate(['404'], { skipLocationChange: false });
        } else {
          this.router.navigate(['404'], { skipLocationChange: false });
        }
      } else {
        this.translate.get('alert.EditEmpFail').subscribe(value => { alert(value); });
        // alert(data.mes);
        this.postList = [];
      }
    });
  }
}

@Component({
  selector: 'app-edit-employees-bottom-sheet',
  templateUrl: 'edit-employees.component.bottomSheet.html',
  styleUrls: ['./edit-employees.component.scss']
  //template: 'passed in {{ data }}'
})
export class BottomSheetEditEmployees {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _bottomSheetRef: MatBottomSheetRef<BottomSheetEditEmployees>) {
    //console.log(data);
    //this._bottomSheetRef.disableClose = true;
  }

  setPreviousAssTreatmentAndCommit(handlePreviousAss: Number): void {
    this._bottomSheetRef.dismiss();

    if (this.data.bDepartmentChanged && this.data.bPositionChanged) {
      this.data.commitEditedEmployeeData(handlePreviousAss, handlePreviousAss);
    } else if (this.data.bDepartmentChanged) {
      this.data.commitEditedEmployeeData(-1, handlePreviousAss);
    } else if (this.data.bPositionChanged) {
      this.data.commitEditedEmployeeData(handlePreviousAss, -1);
    }
  }

  // setEmpInformationAndSend(sendEmpInformation: Number): void {
  //   this._bottomSheetRef.dismiss();
  //   this.data.informEmp = sendEmpInformation;
  //   if (this.data.mode == 0) {
  //     if (this.data.EmpForm.value.isScormCourse) {
  //       this.data.renderer.invokeElementMethod(this.data._fileUpload.nativeElement, 'click');
  //     } else {
  //       this.data.commitCourseData();
  //     }
  //   } else if (this.data.mode == 2) {
  //     // TODO: Course copy was called
  //   } else if (this.data.mode == 1) {
  //     this.data.commitEditedCourseData();
  //   }
  //   //event.preventDefault();
  // }
  cancel() {
    this._bottomSheetRef.dismiss();
  }
}
