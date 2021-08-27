import { TestBed } from '@angular/core/testing';

import { MyCoursesService } from './my-courses.service';

describe('MyCoursesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyCoursesService = TestBed.get(MyCoursesService);
    expect(service).toBeTruthy();
  });
});
