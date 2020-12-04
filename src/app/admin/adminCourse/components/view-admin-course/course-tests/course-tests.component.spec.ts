import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseTestsComponent } from './course-tests.component';

describe('CourseTestsComponent', () => {
  let component: CourseTestsComponent;
  let fixture: ComponentFixture<CourseTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
