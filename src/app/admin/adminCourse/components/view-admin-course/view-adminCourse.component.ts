import { Component, OnInit, ElementRef, Inject, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminCourseService } from '../../adminCourse.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Globals } from '../../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ConfirmationBoxComponent } from '../../../../theme/components/confirmation-box/confirmation-box.component';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { VACUtils } from './view-admin-course-utils';
import { take, tap } from 'rxjs/operators';

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
  animations: VACUtils.componentAnimations
})
export class ViewAdminCourseComponent implements OnInit {

  private _courseData$ : Subject<any> = null;
  private _hasParticipants : boolean = false;
  private _courseId : number= 0;
  private _selectedIndex: number = 0;

  private _swipeCoord? : [number, number];
  private _swipeTime? : number;

  constructor(
    public dialog: MatDialog, 
    public router: Router, 
    private route: ActivatedRoute,
    private translate: TranslateService, 
    private location: Location, 
    protected service: AdminCourseService, 
    private globals: Globals
    ) {
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;
  }

  ngOnInit() {
    this._courseId = this.route.snapshot.params.id;
    this.updateData();
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this._swipeCoord = coord;
      this._swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this._swipeCoord[0], coord[1] - this._swipeCoord[1]];
      const duration = time - this._swipeTime;
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        switch (swipe) {
          case 'previous':
            if (this._selectedIndex > 0) { this._selectedIndex--; }
            break;
          case 'next':
            if (this._selectedIndex < 4) { this._selectedIndex++; }
            break;
        }
      }
    }
  }
 
  updateData() {
    this.loadCourseData(this._courseId);
  }

  tabChanged(event: MatTabChangeEvent) {
    var result = /([A-Za-z/]*[/][0-9]*[/])[0-9]*$/.exec(this.location.path())[1] + event.index;
    this.location.replaceState(result);
  }

  openPartList() {
    this._selectedIndex = 1;
  }

  loadCourseData(CourseId) {
    this._courseData$ = this.service.getCourseData(CourseId).pipe(
      tap((data : any) => {
        if(data.success) {
          this._hasParticipants = data.userStatus.length != 0;
        }
      })
    );
  }

  editCourse() {
    let path : string = "";
    if (this.userType == "1") { path = 'superadmin/course/edit/'; }
    else if (this.userType == "2") { path = 'admin/course/edit/'; } 
    else if (this.userType == "3") { path = 'trainer/course/edit/'; }
    else { path = 'employee/course/edit/'; }
    this.router.navigate([path + this._courseId], { skipLocationChange: false });
  }

  deleteCourse() {
    let description : string = this.translate.instant('dialog.DeleteCourseSure');
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '400px',
      data: { companyId: this._courseId, Action: false, Mes: description },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      this.service.delete(this._courseId).pipe(take(1)).subscribe(data => {
        if (data.success) {
          if (this.userType == "1") { this.router.navigate(['superadmin/course'], { skipLocationChange: false }); }
          else if (this.userType == "2") { this.router.navigate(['admin/course'], { skipLocationChange: false }); } 
          else if (this.userType == "3") { this.router.navigate(['trainer/course'], { skipLocationChange: false }); }
          else { this.router.navigate(['employee/course'], { skipLocationChange: false }); }
        } 
      });
    });
  }

  get userInfo() : any { return this.globals.userInfo; }
  get userType() : string { return this.globals.getUserType(); }
  get courseData$() : Observable<any> { return this._courseData$; }
  get hasParticipants() : boolean { return this._hasParticipants; }
  get selectedIndex() : number { return this._selectedIndex; }
  set selectedIndex(index : number) { this._selectedIndex = index; }
}

export interface DialogData {
  items : any;
  chapterId : string;
  fun : any;
  name : string;
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
