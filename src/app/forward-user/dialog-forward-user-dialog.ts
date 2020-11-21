import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
    name: string;
    course: string;
    hasCertificate: boolean;
}

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-forward-user-dialog.html',
    styleUrls: ['./dialog-forward-user-dialog.scss'],
})
export class DialogForwardUserDialog {

    constructor(
        public dialogRef: MatDialogRef<DialogForwardUserDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, public translate: TranslateService) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}