import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'course-certificate',
  templateUrl: './course-certificate.component.html',
  styleUrls: ['./course-certificate.component.css']
})
export class CourseCertificateComponent implements OnInit {

  @Input() courseData : any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
