import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'course-test',
  templateUrl: './course-test.component.html',
  styleUrls: ['./course-test.component.scss']
})
export class CourseTestComponent implements OnInit {

  @Input() courseData : any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
