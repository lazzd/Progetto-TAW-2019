import { TestBed } from '@angular/core/testing';

import { BarmanFreeSubordersService } from './barman-free-suborders.service';

describe('BarmanFreeSubordersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BarmanFreeSubordersService = TestBed.get(BarmanFreeSubordersService);
    expect(service).toBeTruthy();
  });
});
