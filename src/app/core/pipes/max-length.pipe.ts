import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxlength'
})
export class MaxLengthPipe implements PipeTransform {

  transform(value: string, max: number = 50): string {
    if(value.length > max) { return value.slice(0, 47) + '...'; }
    else { return value; }
  }

}
