import { TestBed } from '@angular/core/testing';

import { CashierOrdersService } from './cashier-orders.service';

describe('CashierOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashierOrdersService = TestBed.get(CashierOrdersService);
    expect(service).toBeTruthy();
  });
});
