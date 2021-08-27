// import { Component, OnInit, ViewChild } from '@angular/core';
// import { CertificaterService } from './certificater.service';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { ConfirmationBoxComponent } from '../theme/components/confirmation-box/confirmation-box.component';
// import { MatPaginator, MatTableDataSource } from '@angular/material';
// import { Router } from '@angular/router';
// import { Globals } from '../common/auth-guard.service';
// import { TranslateService } from '@ngx-translate/core';

// @Component({
//   selector: 'app-certificater',
//   templateUrl: './certificater.component.html',
//   styleUrls: ['./certificater.component.scss']
// })
// export class CertificaterComponent implements OnInit {

//   displayedColumns: string[] = [];
//   dataSource: any;
//   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
//   constructor(public router: Router, private translate: TranslateService, public dialog: MatDialog, public _service: CertificaterService, public _globals: Globals) {
//     if (this.translate.currentLang != this._globals.userInfo.userLang) {
//       this.translate.use(this._globals.userInfo.userLang);
//     }
//     this._globals.currentTranslateService = this.translate;
//   }
//   applyFilter(filterValue: string) {
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }
//   ngOnInit() {
//     this.loadCertificater();
//   }
//   loadCertificater() {
//     if (this._globals.getUserType() == "1") {
//       this._service.getAllCertificate().subscribe((res) => {
//         if (res.success) {
//           this.dataSource = new MatTableDataSource(res.data);
//           this.displayedColumns = ['SignatureimgPath', 'CertificateName', 'courseName', 'companyName', 'Trainer', 'actions'];
//           this.dataSource.paginator = this.paginator;
//         }
//       });
//     } else if (this._globals.getUserType() == "2") {
//       this._service.getCertificateByCompany().subscribe((res) => {
//         if (res.success) {
//           this.dataSource = new MatTableDataSource(res.data);
//           this.displayedColumns = ['SignatureimgPath', 'CertificateName', 'courseName', 'companyName', 'Trainer', 'actions'];
//           this.dataSource.paginator = this.paginator;
//         }
//       });
//     } else if (this._globals.getUserType() == "3") {
//       if (this._globals.companyInfo.companyId > 0) {
//         this._service.getCertificateByUserId().subscribe((res) => {
//           if (res.success) {
//             this.dataSource = new MatTableDataSource(res.data);
//             this.displayedColumns = ['SignatureimgPath', 'CertificateName', 'courseName', 'companyName', 'actions'];
//             this.dataSource.paginator = this.paginator;
//           }
//         });
//       } else {
//         this._service.getAllCertificate().subscribe((res) => {
//           if (res.success) {
//             this.dataSource = new MatTableDataSource(res.data);
//             this.displayedColumns = ['SignatureimgPath', 'CertificateName', 'courseName', 'companyName', 'Trainer', 'actions'];
//             this.dataSource.paginator = this.paginator;
//           }
//         });
//       }
//     } else {
//       this._service.getCertificateByUserId().subscribe((res) => {
//         if (res.success) {
//           this.dataSource = new MatTableDataSource(res.data);
//           this.displayedColumns = ['SignatureimgPath', 'CertificateName', 'courseName', 'companyName', 'Trainer', 'actions'];
//           this.dataSource.paginator = this.paginator;
//         }
//       });
//     }
//   }
//   addCompany() {
//     if (this._globals.getUserType() == "1") {
//       this.router.navigate(['superadmin/certificater/add'], { skipLocationChange: false });
//     } else {
//       this.router.navigate(['trainer/certificater/add'], { skipLocationChange: false });
//     }
//   }
//   editCompany(obj) {
//     if (this._globals.getUserType() == "1") {
//       this.router.navigate(['superadmin/certificater/edit/' + obj.certificaterId], { skipLocationChange: false });
//     } else {
//       this.router.navigate(['trainer/certificater/edit/' + obj.certificaterId], { skipLocationChange: false });
//     }

//   }
//   deleteCompany(obj) {
//     this.translate.get('dialog.DeleteCertSure').subscribe(value => {
//       const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
//         width: '400px',
//         data: { companyId: obj.certificaterId, Action: false, Mes: value }
//       });
//       dialogRef.afterClosed().subscribe(result => {
//         if (result) {
//           this._service.deleteCertificate(obj.certificaterId).subscribe((res) => {
//             if (res.success) {
//               this.loadCertificater();
//             }
//           });
//         }
//       });
//     });
//   }
// }
