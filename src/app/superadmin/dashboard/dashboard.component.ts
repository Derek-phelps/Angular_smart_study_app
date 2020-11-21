import { Component, OnInit } from '@angular/core';
import { SuperadminService } from '../superadmin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public Companies:number = 0;
  public Trainers:number = 0;
  public Employees:number = 0;
  public Courses:number = 0;

  constructor(public _service:SuperadminService) { 

  }
  loadSuperAdminDashnoard(){
    this._service.getSuperAdminDashnoard().subscribe((res) => {
      if(res.success){
        this.Companies = res.data.company;
        this.Trainers = res.data.trainers;
        this.Employees = res.data.employees;
        this.Courses = res.data.courses;
      }
    });
  }
  ngOnInit() {
    var obj = this;
    setTimeout(function(){
      obj.loadSuperAdminDashnoard();
    },100)
   
  }

}
