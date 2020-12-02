import { Component, HostListener, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';
import { Globals } from './common/auth-guard.service';
import { Router, RouterEvent, NavigationStart } from '@angular/router';
import { GlobalService, RoutingState } from './theme/services/global.service';
import { routing } from './app.routing';
import { ConnectionService } from 'ng-connection-service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 0.9, zIndex: 1200 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('* => *', animate(300))
    ])
  ]
})

export class AppComponent implements OnInit {
  @HostListener("window:beforeunload", ["$event"])
  clearLocalStorage(event) {
    localStorage.clear();
    //this.globals.removedUser();
  }

  title = 'Smart-Study';
  errorMessage: string;

  //bIsOffline = false;

  private swipeCoord?: [number, number];
  private swipeTime?: number;

  constructor(public _service: LoginService, public globals: Globals, private router: Router, private _globalService: GlobalService,
    routingState: RoutingState, private connectionService: ConnectionService, private translate: TranslateService) {

    // var obj = this;
    // setTimeout(() => {

    // }, 500);

    this.connectionService.monitor().subscribe(isConnected => {
      this.globals.bIsAppOffline = !isConnected;
    });
  }
  ngOnInit() {
    var obj = this;
    obj._service.getConfig().subscribe(cmp => {
      obj.globals.setServerInfo(cmp);
      //console.log(cmp);
      if (cmp.companyId != "0") {
        if (localStorage.getItem('companyInfo') && localStorage.getItem('defaultLang')) {
          obj.globals.setCompany(JSON.parse(localStorage.getItem('companyInfo')));
          obj.globals.companyInfo.defaultLang = localStorage.getItem('defaultLang');
        }
        obj._service.getCompany(cmp.WebURL, cmp.companyId).subscribe(user => {
          if (user && user.success) {
            obj.globals.setCompany(user.data[0]);
            localStorage.setItem('companyInfo', JSON.stringify(user.data[0]));
          } else {
            obj.globals.incrementAndCheckOfflineError();
          }
        }, error => { obj.errorMessage = <any>error; obj.globals.incrementAndCheckOfflineError(); });
      }
    }, error => { obj.errorMessage = <any>error; obj.globals.incrementAndCheckOfflineError(); });
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'close' : 'open';
        switch (swipe) {
          case 'open':
            if (this.swipeCoord[0] < 15) {
              this._globalService.dataBusChanged('sidebarToggle', true);
            }
            break;
          case 'close':
            if (this.swipeCoord[0] < 250) {
              this._globalService.dataBusChanged('sidebarToggle', false);
            }
            break;
        }
      }
    }
  }
}
