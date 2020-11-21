import { TestBed } from '@angular/core/testing';

import { CourseAssignmentService } from './course-assignment.service';

describe('CourseAssignmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CourseAssignmentService = TestBed.get(CourseAssignmentService);
    expect(service).toBeTruthy();
  });
});
