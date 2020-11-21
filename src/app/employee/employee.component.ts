import { Component, OnInit } from '@angular/core';
import { MENU_employee_ITEM   } from '../menu';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown' , style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate(1000))
    ])
  ]
})
export class EmployeeComponent implements OnInit {
  public emp_Item  :Array<any>; 
  fadeIn = false;
  constructor() {
    setTimeout(() => {
      this.fadeIn = true;
    }, 500);
  }

  ngOnInit() {
    this.emp_Item = MENU_employee_ITEM;
  }

}
