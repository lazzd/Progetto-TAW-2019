import { TestBed } from '@angular/core/testing';

import { CashierStatisticsService } from './cashier-statistics.service';

describe('CashierStatisticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashierStatisticsService = TestBed.get(CashierStatisticsService);
    expect(service).toBeTruthy();
  });
});
