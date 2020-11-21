import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { QuestionService } from './question.service';
import { Globals } from '../common/auth-guard.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadInput, UploadOutput } from 'ngx-uploader';
import { ConfirmationBoxComponent } from '../theme/components/confirmation-box/confirmation-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  displayedColumns: string[] = [];
  fileToUpload: File = null;
  dataSource: any;
  @ViewChild('fileUpload', { static: true }) public _fileUpload: ElementRef;
  @ViewChild('imageFileUpload', { static: true }) public _imageFileUpload: ElementRef;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private renderer: Renderer2, private translate: TranslateService, public router: Router, public dialog: MatDialog, public _service: QuestionService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    this.loadCompany();
  }
  uploadEmp() {
    this._fileUpload.nativeElement.click();
  }
  loadCompany() {
    if (this._globals.getUserType() == "1") {
      this._service.getAllData().subscribe((res) => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.displayedColumns = ['QuestionImg', 'Question', 'courseName', 'chapterName', 'CorrectAnswerOptionNumber', 'actions'];
          this.dataSource.paginator = this.paginator;
        }
      });

    } else if (this._globals.getUserType() == "2") {
      this._service.getData(this._globals.companyInfo.companyId).subscribe((res) => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.displayedColumns = ['QuestionImg', 'Question', 'courseName', 'chapterName', 'CorrectAnswerOptionNumber', 'actions'];
          this.dataSource.paginator = this.paginator;
        }
      });
    } else if (this._globals.getUserType() == "3") {
      if (this._globals.companyInfo.companyId > 0) {
        this._service.getData(this._globals.companyInfo.companyId).subscribe((res) => {
          if (res.success) {
            this.dataSource = new MatTableDataSource(res.data);
            this.displayedColumns = ['QuestionImg', 'Question', 'courseName', 'chapterName', 'CorrectAnswerOptionNumber', 'actions'];
            this.dataSource.paginator = this.paginator;
          }
        });
      } else {
        this._service.getAllData().subscribe((res) => {
          if (res.success) {
            this.dataSource = new MatTableDataSource(res.data);
            this.displayedColumns = ['QuestionImg', 'Question', 'courseName', 'chapterName', 'CorrectAnswerOptionNumber', 'actions'];
            this.dataSource.paginator = this.paginator;
          }
        });
      }
    } else {
      this._service.getByQuestionById(this._globals.companyInfo.companyId).subscribe((res) => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.displayedColumns = ['QuestionImg', 'Question', 'courseName', 'chapterName', 'CorrectAnswerOptionNumber', 'actions'];
          this.dataSource.paginator = this.paginator;
        }
      });
    }

  }
  addCompany() {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/test/add';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/test/add';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/test/add';
    } else {
      path = 'employee/test/add';
    }
    this.router.navigate([path], { skipLocationChange: false });
  }
  editCompany(obj) {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/test/edit/';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/test/edit/';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/test/edit/';
    } else {
      path = 'employee/test/edit/';
    }
    this.router.navigate([path + obj.questionId], { skipLocationChange: false });
  }
  deleteCompany(obj) {
    this.translate.get('dialog.DeleteQuestionSure').subscribe(value => {
      //alert(value);
      const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: '400px',
        data: { companyId: obj.questionId, Action: false, Mes: value },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._service.delete(obj.questionId).subscribe((res) => {
            if (res.success) {
              this.loadCompany();
            }
          });
        }
      });
    });
  }
  imageFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    this._service.postFile(this.fileToUpload).subscribe(data => {
      if (data.success) {
        alert(data.mes);
        this.loadCompany();
      }

    }, error => {
      // console.log(error);
    });
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    this._service.postImage(this.fileToUpload).subscribe(data => {
      this.loadCompany();
    }, error => {
      // console.log(error);
    });
  }
  addImage() {
    this._imageFileUpload.nativeElement.click();
    return false;
  }
}
