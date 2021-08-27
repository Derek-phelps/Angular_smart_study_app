import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseParticipantsComponent } from './course-participants.component';

describe('ParticipantListComponent', () => {
  let component: CourseParticipantsComponent;
  let fixture: ComponentFixture<CourseParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseParticipantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
