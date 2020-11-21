import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  companyId: string;
  Action: boolean;
  Mes: string;
}
@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

  }
  openDialog(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    //  {companyId: obj.companyId, Action: false}
  }
}
