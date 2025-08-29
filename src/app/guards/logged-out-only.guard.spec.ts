import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedOutOnlyGuard } from './logged-out-only.guard';

describe('loggedOutOnlyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggedOutOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
