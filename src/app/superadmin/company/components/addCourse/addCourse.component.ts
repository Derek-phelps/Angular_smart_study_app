import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SuperadminService } from '../../../superadmin.service';

export interface DialogData {
  companyId: string;
  Action: boolean;
}
@Component({
  selector: 'app-addCourse',
  templateUrl: './addCourse.component.html',
  styleUrls: ['./addCourse.component.scss']
})
export class AddCourseComponent implements OnInit {
  public EmpForm: FormGroup;
  public postList = [];
  public Courses = [];
  public Department = [];
  constructor(
    public dialogRef: MatDialogRef<AddCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder, protected service: SuperadminService) {
    this.EmpForm = this.formBuilder.group({
      companyId: [data.companyId],
      CourseList: this.formBuilder.array([])
    });
    this.loadAllCourse();
    this.loadAllDepartment();
  }
  public loadCourseByCompany() {
    this.service.getCourseByCompId(this.data.companyId).subscribe((res) => {
      if (res.success) {
        var Course = [];
        for (var i = 0; i < res.data.length; i++) {
          this.addCourse();
          // console.log(res.data[i]);
          Course.push({
            "courseId": res.data[i].courseId,
            'companyId': res.data[i].companyId,
            "departmentId": res.data[i].departmentId,
            'isReadOnly': 1
          });
        }
        this.EmpForm.setValue({
          "companyId": this.data.companyId,
          "CourseList": Course
        });
      }
    });
  }
  public loadAllDepartment() {
    this.service.getAllDepartment(this.data.companyId).subscribe((data) => {
      if (data.success) {
        this.Department = data.data;
      }
    });
  }
  public loadAllCourse() {
    this.service.getAllCourse().subscribe((data) => {
      if (data.success) {
        this.Courses = data.data;
      }
      this.loadCourseByCompany();
    });
  }
  public addCourse() {
    const control = <FormArray>this.EmpForm.controls['CourseList'];
    control.insert(0, this.initChapter());
  }
  initChapter() {
    return this.formBuilder.group({
      'courseId': ['', Validators.required],
      'companyId': [this.data.companyId],
      'departmentId': [0],
      'isReadOnly': [0]
    });
  }
  public removeChapter(i, add) {
    // console.log(add);
    if (add.value.courseId > 0) {
      if (window.confirm('Do you really want to delete the Chapter?"')) {
        const control = <FormArray>this.EmpForm.controls['CourseList'];
        control.removeAt(i);
        this.service.deleteCourse(add.value.courseId).subscribe((data) => {
          if (data.success) {
          }
        });
      }
    } else {
      const control = <FormArray>this.EmpForm.controls['CourseList'];
      control.removeAt(i);
    }
  }
  ngOnInit() {

  }
  closeAddCourseBox() {
    this.dialogRef.close();
  }
  SaveAddCourseBox() {
    this.service.saveMapCourseByComp(this.EmpForm.value).subscribe((data) => {
      if (data.success) {
        alert(data.data);
        this.dialogRef.close(data);
      } else {
        this.dialogRef.close();
      }
    });
  }
}
