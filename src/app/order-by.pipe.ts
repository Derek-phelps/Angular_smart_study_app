import {Pipe, PipeTransform} from '@angular/core';
//import { resolveTiming } from '@angular/animations/browser/src/util';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(values: number[]|string[]|object[], key?: string, serachTxt?: String) {
    if (!Array.isArray(values) || values.length <= 0) {
      return null;
    }
    //console.log("111");
    var DataInfo = this.sort(values, key, serachTxt);

    if(serachTxt){
      return DataInfo.filter( it => {
        return it.courseName.toLowerCase().includes(serachTxt.toLowerCase());
      });
    }else{
      return DataInfo;
    }
   
  }

  private sort(value: any[], key?: any, serachTxt?: String): any[] {
    const isInside = key && key.indexOf('.') !== -1;
    //console.log(isInside);
    if (isInside) {
      key = key.split('.');
    }
    
    const array: any[] = value.sort((a: any, b: any): number => {
      var daate =new Date(a[key]);
      if(daate.toString() === "Invalid Date"){
        if (!key) {
          return a > b ? 1 : -1;
        }
        if (!isInside) {
          return a[key] > b[key] ? 1 : -1;
        }
        
        return this.getValue(a, key) > this.getValue(b, key) ? 1 : -1;
  
      }else{
        var dt1 = new Date(a[key]);
        var dt2 = new Date(b[key]);
        var diffDays = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));

        return diffDays > -1 ? -1 : 1 ;
      }
    });

    return array;
  }

  private getValue(object: any, key: string[]) {
    for (let i = 0, n = key.length; i < n; ++i) {
      const k = key[i];
      if (!(k in object)) {
        return;
      }

      object = object[k];
    }

    return object;
  }

}