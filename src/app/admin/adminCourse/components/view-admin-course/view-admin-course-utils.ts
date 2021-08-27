import { animate, state, style, transition, trigger } from "@angular/animations";

export class VACUtils {
  
  static calcCourseUsersOverdue(userStatus : any) : number {  
    return userStatus.filter( stat => stat.courseStatus == -1 ).length;
  }

  static calcCourseUsersOpen(userStatus : any) : number {  
    return userStatus.filter( stat => stat.courseStatus == 0 ).length;
  }

  static calcCourseUsersDone(userStatus : any) : number {  
    return userStatus.filter( stat => stat.courseStatus == 1 ).length;
  }
  
  static get componentAnimations() {
      return [ trigger('headerAnimation', [
        state('shown', style({ opacity: 1, height: '*' })),
        state('hidden', style({ opacity: 0, height: 0 })),
        transition('* => *', animate(200))
      ]),
      trigger('visibilityChanged', [
        state('shown', style({ opacity: 1 })),
        state('hidden', style({ opacity: 0 })),
        transition('* => *', animate(500))
      ]),
      trigger('openedChanged', [
        state('shown', style({ opacity: 1 })),
        state('hidden', style({ opacity: 0 })),
        transition('* => *', animate(1000))
      ])
    ];
  }
}