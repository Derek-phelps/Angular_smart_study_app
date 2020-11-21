import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAssignmentComponent } from './course-assignment.component';

describe('CourseAssignmentComponent', () => {
  let component: CourseAssignmentComponent;
  let fixture: ComponentFixture<CourseAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
