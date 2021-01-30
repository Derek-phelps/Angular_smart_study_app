import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';



export interface ComponentCanDeactivate {
  canDeactivate : () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuardGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate( component : ComponentCanDeactivate ) : boolean | Observable<boolean> {
    return component.canDeactivate();
  }
  
}
