import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { ConfirmationBoxComponent } from 'src/app/theme/components/confirmation-box/confirmation-box.component';
import { AdminCourseService } from '../../../adminCourse.service';
import { VACUtils } from '../view-admin-course-utils';

@Component({
  selector: 'course-certificate',
  templateUrl: './course-certificate.component.html',
  styleUrls: ['./course-certificate.component.scss'],
  animations: VACUtils.componentAnimations
})
export class CourseCertificateComponent implements OnInit {

  @Input() courseData : any;
  @Output() updateData : EventEmitter<void> = new EventEmitter<void>();

  private _certificateURL : string = '';
  
  constructor(
    private globals : Globals,
    private translate: TranslateService,
    private router: Router,
    private service: AdminCourseService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChanges) {
    if(changes.courseData) {
      if (this.courseInfo.hasCertificate) {
        this._certificateURL = this.globals.WebURL + '/API/index.php/createpdf/view/' + this.courseInfo.courseId + '/preview';
      }
    }
    
  }

  addCertificate() {
    var path = "";
    if (this.globals.getUserType() == "1") { path = 'superadmin/certificater/add/'; } 
    else if (this.globals.getUserType() == "2") { path = 'admin/certificater/add/'; }
    else if (this.globals.getUserType() == "3") { path = 'trainer/certificater/add/'; } 
    else { path = 'employee/certificater/add/'; }
    this.router.navigate([path + this.courseInfo.courseId], { skipLocationChange: false });
  }

  editCertificate() {
    var path = "";
    if (this.globals.getUserType() == "1") { path = 'superadmin/certificater/edit/'; } 
    else if (this.globals.getUserType() == "2") { path = 'admin/certificater/edit/'; } 
    else if (this.globals.getUserType() == "3") { path = 'trainer/certificater/edit/'; } 
    else { path = 'employee/certificater/edit/'; }
    this.router.navigate([path + this.courseInfo.hasCertificate], { skipLocationChange: false });
  }

  deleteCertificate() {
    let strHead : string = this.translate.instant('certificate.DeleteCerti');
    let strMessage : string = this.translate.instant('certificate.DeleteCertiSure', { course: this.courseInfo.courseName });

    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this.globals.companyInfo.companyId, Action: false, Mes: strMessage, Head: strHead },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (this.courseInfo.hasCertificate) {
        this.service.deleteCertificate(this.courseInfo.hasCertificate).subscribe(data => {
          if (data.success) {
            this.snackbar.open(this.translate.instant('certificate.DelSuccess'), '', { duration: 3000 });
            this.updateData.next();
            window.scroll(0, 0);
          } 
          else {
            this.snackbar.open(this.translate.instant('certificate.DelFail'), '', { duration: 3000 });
          }
        }, err => {
          this.snackbar.open(this.translate.instant('certificate.DelFail'), '', { duration: 3000 });
        });
      }
    });
  }

  get courseInfo() { return this.courseData.courseInfo; }
  get certificateURL() { return this._certificateURL; }

}
