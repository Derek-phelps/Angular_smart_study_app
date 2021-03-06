import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Globals } from 'src/app/common/auth-guard.service';
import { VACUtils } from '../view-admin-course-utils';

@Component({
  selector: 'course-data',
  templateUrl: './course-data.component.html',
  styleUrls: ['./course-data.component.scss'],
  animations: VACUtils.componentAnimations
})
export class CourseDataComponent implements OnInit {

  @Input() data : any;

  constructor(
    private globals : Globals,
  ) { }

  ngOnInit(): void {
  }

  get userInfo() { return this.globals.userInfo; };
  get webURL() { return this.globals.WebURL; }

}
