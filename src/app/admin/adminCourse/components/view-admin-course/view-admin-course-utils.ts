
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
}