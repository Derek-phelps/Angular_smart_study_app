import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../trainer.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public Courses=0;
  public Contents=0;
  public Certificates=0;
  constructor(public _service:TrainerService, private spinner: NgxSpinnerService) { 

  }
  loadTrainerDashnoard(){
    this._service.getTrainerDashnoard().subscribe((res) => {
      if(res.success){
        this.Certificates = res.data.Certificates;
        this.Contents = res.data.Contents;
        this.Courses = res.data.courses;
      }
      this.spinner.hide();
    });
  }
  ngOnInit() {
    var obj = this;
    setTimeout(function(){
      obj.loadTrainerDashnoard();
    },100)
   
  }

}
