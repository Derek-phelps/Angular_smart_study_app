import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminCourseService } from '../../adminCourse.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Globals } from '../../../../common/auth-guard.service';

@Component({
  selector: 'app-edit-participant',
  templateUrl: './edit-participant.component.html',
  styleUrls: ['./edit-participant.component.scss']
})
export class EditParticipantComponent implements OnInit {
  public EmpForm: FormGroup;
  public wgList = [];
  private locationId = '';
  public isLocReq = '';
  public currentWorkgroupId = '';
  public currentWorkgroupIsEditable = false;
  private newWorkgroupId = '';

  constructor(public _globals: Globals, private location: Location, public route: ActivatedRoute, private translate: TranslateService, private fb: FormBuilder, protected _service: AdminCourseService, public router: Router) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.EmpForm = this.fb.group({
      FIRSTNAME: ['', Validators.required],
      Id: [''],
      workgroupId: [''],
      NewWorkGroupName: ['']
    });
    this.route.params.subscribe(params => {
      this.locationId = params['locId'];
      this.isLocReq = params['isLocReq'];
      this.loadEditEmployeeName(params['empId'], this.locationId);
      // In a real app: dispatch action to load the details here.
    });

    function goodbye(e) {
      if (!e) { e = window.event; }

      e.cancelBubble = true;
      e.returnValue = undefined;

      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    window.onbeforeunload = goodbye;
  }
  loadEditEmployeeName(empId, locId) {
    this._service.getEmployeeNameById(empId).subscribe((data) => {
      if (data.success) {
        //console.log(data);
        this.currentWorkgroupId = data.data[0].workgroupId;
        this.EmpForm.setValue({
          FIRSTNAME: data.data[0].FIRSTNAME,
          Id: data.data[0].empId,
          workgroupId: data.data[0].workgroupId,
          NewWorkGroupName: ''
        });

        this._service.getWorkGroupsById(locId).subscribe((data) => {
          if (data.success) {
            this.wgList = data.data;
            if (this.currentWorkgroupId != '0') {
              for (let i = 0; i < this.wgList.length; i++) {
                if (this.wgList[i].workgroupId == this.currentWorkgroupId && this.wgList[i].isPrivate == '1') {
                  this.currentWorkgroupIsEditable = true;
                }
              }
            }
            //console.log(this.wgList);
          }
        });
      } else {
        alert(data.mes);
      }
    });
  }
  saveWorkingGroupAndEmpName() {
    if (this.EmpForm.value.workgroupId == this.currentWorkgroupId && this.currentWorkgroupIsEditable && this.EmpForm.value.NewWorkGroupName != '') {
      // TODO: Update current work group name in DB and update employee name if needed
      let wgToUpdate: any = {};
      wgToUpdate.workgroupId = this.currentWorkgroupId;
      wgToUpdate.workgroupName = this.EmpForm.value.NewWorkGroupName;
      wgToUpdate.locationId = this.locationId;
      wgToUpdate.isPrivate = '1';
      //console.log(wgToUpdate);
      this._service.addOrUpdateWorkGroupById(wgToUpdate).subscribe((data) => {
        if (data.success) {
          this.saveEmpName();
        } else {
          console.error("Failed to update work group name in DB!")
          alert("Failed to update work group name in DB!");
          this.saveEmpName();
        }
      });
    } else if (this.EmpForm.value.workgroupId == '-1' && this.EmpForm.value.NewWorkGroupName != '') {
      // TODO: Add new working group and enter returned id to update employee.
      let wgToUpdate: any = {};
      wgToUpdate.workgroupName = this.EmpForm.value.NewWorkGroupName;
      wgToUpdate.locationId = this.locationId;
      wgToUpdate.isPrivate = '1';
      //console.log(wgToUpdate);
      this._service.addOrUpdateWorkGroupById(wgToUpdate).subscribe((data) => {
        if (data.success) {
          this.newWorkgroupId = data.workgroupId;
          this.saveEmpName();
        } else {
          console.error("Failed to update work group name in DB!")
          alert("Failed to update work group name in DB!");
        }
      });
    } else if (this.EmpForm.value.workgroupId == '-1' && this.EmpForm.value.NewWorkGroupName == '') {
      // TODO: Tell user to enter name!
      this.translate.get('alert.EnterNewWGName').subscribe(value => { alert(value); });
    } else {
      this.saveEmpName();
    }
  }
  saveEmpName() {
    let workgroupId = '';
    if (this.EmpForm.value.workgroupId == '-1') {
      workgroupId = this.newWorkgroupId;
    } else {
      workgroupId = this.EmpForm.value.workgroupId;
    }
    // this._service.setEmployeeNameById(this.EmpForm.value.Id, this.EmpForm.value.FIRSTNAME, workgroupId).subscribe((data) => {
    //   if (data.success) {
    //     this.translate.get('alert.EmpNameWGSuccess').subscribe(value => { alert(value); });
    //     //this.router.navigate(['admin/course']);
    //     //this.location.back();

    //     var backUrl = this._globals.getLastRouteUrl();
    //     if (backUrl != "") {
    //       this.router.navigate([backUrl], { skipLocationChange: false });
    //     } else {
    //       this.location.back();
    //     }
    //   } else {
    //     this.translate.get('alert.EmpNameWGFail').subscribe(value => { alert(value); });
    //   }
    // });
  }
  ngOnInit() {
  }

}
