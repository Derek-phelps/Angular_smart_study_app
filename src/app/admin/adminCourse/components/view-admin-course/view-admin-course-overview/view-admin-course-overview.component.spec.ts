import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdminCourseOverviewComponent } from './view-admin-course-overview.component';

describe('ViewAdminCourseOverviewComponent', () => {
  let component: ViewAdminCourseOverviewComponent;
  let fixture: ComponentFixture<ViewAdminCourseOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAdminCourseOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAdminCourseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
