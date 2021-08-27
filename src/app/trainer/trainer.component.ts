import { Component, OnInit } from '@angular/core';
import { MENU_trainer_employee_ITEM  } from '../menu';
@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit {
  public trainer_Item = MENU_trainer_employee_ITEM;
  constructor() { }

  ngOnInit() {
  }

}
