import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseTestComponent } from './course-test.component';

describe('CourseTestComponent', () => {
  let component: CourseTestComponent;
  let fixture: ComponentFixture<CourseTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
