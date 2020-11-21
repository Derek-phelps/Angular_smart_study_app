import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Globals } from '../../../common/auth-guard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyCoursesService } from '../../../employee/my-courses/my-courses.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, zIndex: 1 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(500))
    ])
  ]
})
export class CertificateListComponent implements OnInit, AfterViewInit {

  @Input() empId = 0;

  displayedColumns: string[] = ['image', 'courseName', 'lastFinished', 'download'];
  isExtendedRow = (index, item) => item.extend;

  bCertificatesFound = false;
  certificateList: any;

  bLoading = true;

  bShowDownloadToolTip = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public globals: Globals, private spinner: NgxSpinnerService, private service: MyCoursesService, private translate: TranslateService,
    public router: Router) {
    if (this.translate.currentLang != this.globals.userInfo.userLang) {
      this.translate.use(this.globals.userInfo.userLang);
    }
    this.globals.currentTranslateService = this.translate;

    this.certificateList = new MatTableDataSource();

    var obj = this;
    this.certificateList.filterPredicate = function (data: any, filter: string): boolean {
      return obj.filterFunction(data.courseName, filter);
    }

    this.spinner.hide();
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadCertificates();
    }, 300);
  }

  getToolTipString(course) {
    //return row.certificaterId ? 'certificate.Download' : 'certificate.NoCerti'
    if (!course.certificaterId) {
      return 'certificate.NoCerti';
    }
    if (Number(course.justPass) == 1) {
      return 'certificate.JustPassed';
    }
    return 'certificate.Download';
  }

  loadCertificates() {
    this.bLoading = true;
    this.service.getMyCertificates(this.empId, this.empId != 0).subscribe(data => {
      //console.log(data);
      if (data.success) {
        this.certificateList.data = data.empCourseInfo;
        this.bCertificatesFound = (this.certificateList.data.length > 0);
        if (!this.bCertificatesFound) {
          var text = [
            { courseName: this.empId == 0 ? this.translate.instant('employees.NoCertiFound') : this.translate.instant('employees.NoCertiFoundGen'), extend: true }
          ];
          this.certificateList.data = text;
        }
        this.bLoading = false;
      }
    }, err => {
      console.error(err);
    });
  }

  ngAfterViewInit() {
    this.certificateList.paginator = this.paginator;
    this.certificateList.sort = this.sort;

    this.certificateList.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'lastFinished': {
          return item.sortLastFinished;
        }
        default: {
          return item[property];
        }
      }
    };
  }

  applyCertificateFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.certificateList.filter = filterValue;

    if (this.certificateList.paginator) {
      this.certificateList.paginator.firstPage();
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
    return bMatch;
  }

  openCertificate(course, finishedDate = undefined) {
    if (!course.certificaterId || (finishedDate == undefined && course.justPass != 0) || (finishedDate != undefined && finishedDate.justPass != 0)) {
      return;
    }
    if (this.globals.currentCertificateDownloadWindow) {
      this.globals.currentCertificateDownloadWindow.close();
    }
    var url = this.globals.WebURL + '/API/index.php/createpdf/view/' + course.courseId + '/' + this.empId;
    if (finishedDate) {
      url += '/' + finishedDate.emp_courseId;
    }
    //console.log(url);
    var width = window.innerHeight > 500 ? window.innerHeight * 3 / 4 : 500;
    var height = window.innerHeight > 600 ? window.innerHeight - 100 : window.innerHeight;
    var strWindowSettings = 'menubar=no,toolbar=no,status=no,channelmode=yes,top=0,left=0';
    strWindowSettings += ',width=' + width + ',height=' + height;
    this.globals.currentCertificateDownloadWindow = window.open(url, "Smart-Study", strWindowSettings);
  }

  showAll(event) {
    event.stopPropagation();
  }

  onHovering() {
    this.bShowDownloadToolTip = false;
  }

  onUnovering() {
    this.bShowDownloadToolTip = true;
  }

}
