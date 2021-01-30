import { TestBed } from '@angular/core/testing';

import { PendingChangesGuardGuard } from './pending-changes-guard.guard';

describe('PendingChangesGuardGuard', () => {
  let guard: PendingChangesGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PendingChangesGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
