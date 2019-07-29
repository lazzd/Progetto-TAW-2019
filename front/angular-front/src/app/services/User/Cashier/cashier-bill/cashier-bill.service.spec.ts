import { TestBed } from '@angular/core/testing';

import { CashierBillService } from './cashier-bill.service';

describe('CashierBillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashierBillService = TestBed.get(CashierBillService);
    expect(service).toBeTruthy();
  });
});
