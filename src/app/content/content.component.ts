import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ContentService } from './content.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../theme/components/confirmation-box/confirmation-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

export interface DialogData {
  items: any;
  chapterId: string;
  fun: any;
  name: string;
}
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  displayedColumns: string[] = [];
  //ImageURL = this._globals.IMAGEURL;
  dataSource: any;
  selectCourse: any;
  formFieldVisibility = "visible";
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private route: ActivatedRoute, public router: Router, private translate: TranslateService, public dialog: MatDialog, public _service: ContentService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    this.loadContent();
  }
  loadContent() {
    if (this._globals.getUserType() == "1") {
      this._service.getAllChapters().subscribe((res) => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.displayedColumns = ['chapterId', 'chapterName', 'courseName', 'companyName', 'actions'];
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource = new MatTableDataSource([]);
        }
        this.filterByCourse();
      });
    } else if (this._globals.getUserType() == "2") {
      this._service.getChapter().subscribe((res) => {
        //console.log(res);
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.displayedColumns = ['chapterId', 'chapterName', 'courseName', 'companyName', 'actions'];
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource = new MatTableDataSource([]);
        }
        this.filterByCourse();
      });
    } else if (this._globals.getUserType() == "3") {
      this._service.getChaptersByUser().subscribe((res) => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.displayedColumns = ['chapterId', 'chapterName', 'courseName', 'companyName', 'actions'];
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource = new MatTableDataSource([]);
        }
        this.filterByCourse();
      });
    } else {
      // this._service.getChaptersByUser(this._globals.getUserId()).subscribe((res) => {
      //   if (res.success) {
      //     this.dataSource = new MatTableDataSource(res.data);
      //     this.displayedColumns = ['chapterId', 'chapterName', 'courseName', 'companyName', 'actions'];
      //     this.dataSource.paginator = this.paginator;
      //   } else {
      //     this.dataSource = new MatTableDataSource([]);
      //   }
      //   this.filterByCourse();
      // });
    }
  }
  filterByCourse() {
    this.route.params.subscribe(params => {
      if (params.id != undefined) {
        this.formFieldVisibility = "hidden";
        this.dataSource.filter = params.id;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return (data.courseId == filter);
        };
      }
    });
  }
  addCompany() {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/content/add';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/content/add';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/content/add';
    } else {
      path = 'employee/content/add';
    }
    this.router.navigate([path], { skipLocationChange: false });
  }
  editCompany(obj) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/content/edit';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/content/edit';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/content/edit';
    } else {
      path = 'employee/content/edit';
    }
    this.router.navigate([path, obj.chapterId], { skipLocationChange: false });
  }
  deleteCompany(obj) {
    this.translate.get('dialog.DeleteContentSure').subscribe(value => {
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: obj.chapterId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._service.delete(obj.chapterId).subscribe((res) => {
            if (res.success) {
              this.loadContent();
            }
          });
        }
      });
    });
  }
  downloadQRCodeFile(me, obj) {
    // // console.log(me);
    // me.selectCourse = obj;
    // // console.log(obj);
    // setTimeout(function () {
    //   var data = document.getElementById('QRCodeId');
    //   // console.log(data);
    //   html2canvas(data).then(canvas => {
    //     // Few necessary setting options  
    //     var imgWidth = 208;
    //     var pageHeight = 295;
    //     var imgHeight = canvas.height * imgWidth / canvas.width;
    //     var heightLeft = imgHeight;

    //     const contentDataURL = canvas.toDataURL('image/png')
    //     let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
    //     pdf.addFont('arialregular');
    //     var position = 0;
    //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    //     pdf.save('Doc_' + obj.subChapterId + '.pdf'); // Generated PDF 

    //     setTimeout(function () {
    //       me.selectCourse = null;
    //     }, 200);
    //   });

    // }, 100);
  }
  downloadCompany(obj) {

    this._service.getSubChapterByChapter(obj.chapterId).subscribe((res) => {
      if (res.success) {
        const dialogRef = this.dialog.open(SubChapterOverviewDialog, {
          width: '400px',
          data: { items: res.data, name: obj.courseName, fun: this, chapterId: obj.chapterId }
        });

        dialogRef.afterClosed().subscribe(result => {
          // console.log('The dialog was closed');
        });
      } else {
        alert("No Offline subChapter in this code");
      }
    });


  }
  convertImgToBase64URL(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'), dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.onerror = function () {
      callback("");
    };
    img.src = url;
  }
}
@Component({
  selector: 'SubChapterOverviewDialog',
  templateUrl: 'SubChapterOverviewDialog.html',
})
export class SubChapterOverviewDialog {

  constructor(
    public dialogRef: MatDialogRef<SubChapterOverviewDialog>, public _service1: ContentService,
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