import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Globals } from '../../common/auth-guard.service';
import { Router, NavigationEnd, RouterEvent, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgbDatepickerNavigationSelect } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';


@Injectable()
export class GlobalService {

    private isActivedSource = new Subject<any>();
    isActived$ = this.isActivedSource.asObservable();
    private dataSource = new Subject<DataSourceClass>();
    data$ = this.dataSource.asObservable();

    constructor(public globals: Globals) { }

    _isActived(isActived) {
        this.isActivedSource.next(isActived);
    }

    public dataBusChanged(ev, value) {
        if (ev == 'sidebarToggle') {
            this.globals.sidebarToggle = value;
        }
        this.dataSource.next({
            ev: ev,
            value: value
        })
    }
}


export class DataSourceClass {
    ev: string;
    value: any
}


@Injectable()
export class RoutingState {
    private history = [];
    private bAlreadyInitialized = false;

    constructor(
        private router: Router
    ) { }

    public loadRouting(): void {
        // if (!this.bAlreadyInitialized) {
        //     this.bAlreadyInitialized = true;
        //     this.deleteHistory();
        //     // this.router.events
        //     //     .pipe(filter(event => event instanceof NavigationEnd))
        //     //     .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        //     //         this.history = [...this.history, urlAfterRedirects];
        //     //         console.log("Navigation to URL " + urlAfterRedirects);
        //     //     });
        //     this.router.events
        //         .pipe(filter(event => event instanceof NavigationStart))
        //         .subscribe(({ navigationTrigger, id, url, restoredState }: NavigationStart) => {
        //             console.warn("===");
        //             console.log(navigationTrigger);
        //             console.log(id);
        //             console.log(url);
        //             console.log(restoredState);
        //             console.warn("===");
        //         });

        // }
    }
    public deleteHistory() {
        this.history = [];
    }
    public getHistory(): string[] {
        return this.history;
    }
    public getPreviousUrl(): string {
        return this.history[this.history.length - 2] || '';
    }
}