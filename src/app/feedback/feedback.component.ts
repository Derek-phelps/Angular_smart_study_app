import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedbackService } from './feedback.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  displayedColumns: string[] = [];

  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(protected service: FeedbackService, private spinner: NgxSpinnerService) {
    var obj = this;
    setTimeout(function () {
      obj.loadfeedBack();
    }, 100);

  }
  loadfeedBack() {
    this.service.get().subscribe((res) => {
      if (res.success) {
        this.dataSource = new MatTableDataSource(res.data);
        this.displayedColumns = ['subject', 'senderName', 'Message'];
        this.dataSource.paginator = this.paginator;

      }
      this.spinner.hide();
    });
  }
  ngOnInit() {
  }

}
