import { TestBed } from '@angular/core/testing';

import { CookFreeSubordersService } from './cook-free-suborders.service';

describe('CookFreeSubordersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CookFreeSubordersService = TestBed.get(CookFreeSubordersService);
    expect(service).toBeTruthy();
  });
});
