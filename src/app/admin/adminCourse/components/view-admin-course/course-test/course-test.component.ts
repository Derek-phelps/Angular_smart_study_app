import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'course-test',
  templateUrl: './course-test.component.html',
  styleUrls: ['./course-test.component.scss']
})
export class CourseTestComponent implements OnInit {

  private _courseData : any = null;

  @Input() set courseData(data : any) { this._courseData = data['courseInfo']};
  
  constructor() { }

  ngOnInit(): void {
  }

  get courseData() : any { return this._courseData; }

}
