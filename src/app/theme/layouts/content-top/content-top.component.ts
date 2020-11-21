import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Globals } from '../../../common/auth-guard.service';

@Component({
  selector: 'content-top',
  templateUrl: './content-top.component.html',
  styleUrls: ['./content-top.component.scss']
})
export class ContentTopComponent {
  routeTitle: any;
  dashboardRouterLink: any;
  homeRouteTitle = "menu.Dashboard";
  constructor(public _globalService: GlobalService,public _globals:Globals) {
    this.getRouteTitle();

    if(this._globals.getUserType()=="1"){
      this.dashboardRouterLink = "../superadmin";
    }else if(this._globals.getUserType()=="2"){
      this.dashboardRouterLink = "../admin";
    }else if(this._globals.getUserType()=="3"){
      this.dashboardRouterLink = "../trainer";
    }else{
      this.dashboardRouterLink = "../employee";
    }
    // if (this._globals.isEmpReading) {
    //   this.dashboardRouterLink = "../" + this.dashboardRouterLink + "/course";
    // }
  }

  private getRouteTitle() {
     
     this._globalService.isActived$.subscribe(isActived => { 
       
      this.routeTitle = isActived.title;
    }, error => { 
      console.log('Error: ' + error);
    }); 

    this._globalService.data$.subscribe(data => {
      
      if (data.ev === 'isActived') {
        this.routeTitle = data.value.title;
      }
    }, error => { 
      console.log('Error: ' + error);
    });
  }

  returnHome() {
    //    this._globalService._isActived({ title: 'Dashboard' });
    this._globalService.dataBusChanged('isActived', { title: this.homeRouteTitle });
  }
}
