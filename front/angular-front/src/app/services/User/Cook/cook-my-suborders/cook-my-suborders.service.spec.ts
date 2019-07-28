import { TestBed } from '@angular/core/testing';

import { CookMySubordersService } from './cook-my-suborders.service';

describe('CookMySubordersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CookMySubordersService = TestBed.get(CookMySubordersService);
    expect(service).toBeTruthy();
  });
});
