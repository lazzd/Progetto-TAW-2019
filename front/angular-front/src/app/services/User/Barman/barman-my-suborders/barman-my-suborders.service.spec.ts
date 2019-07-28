import { TestBed } from '@angular/core/testing';

import { BarmanMySubordersService } from './barman-my-suborders.service';

describe('BarmanMySubordersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BarmanMySubordersService = TestBed.get(BarmanMySubordersService);
    expect(service).toBeTruthy();
  });
});
