import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
  companyId: string;
  Action: boolean;
  Mes: string;
  UserInput: string;
  TextType: string;
}
@Component({
  selector: 'app-prompt-box',
  templateUrl: './prompt-box.component.html',
  styleUrls: ['./prompt-box.component.scss']
})
export class PromptBoxComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PromptBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

  }
  ngOnInit() {
    //  {companyId: obj.companyId, Action: false}
  }
  closeDialog() {
    this.dialogRef.close(this.data.UserInput);
  }
}
