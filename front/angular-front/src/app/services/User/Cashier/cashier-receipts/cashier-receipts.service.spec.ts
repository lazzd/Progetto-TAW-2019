import { TestBed } from '@angular/core/testing';

import { CashierReceiptsService } from './cashier-receipts.service';

describe('CashierReceiptsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashierReceiptsService = TestBed.get(CashierReceiptsService);
    expect(service).toBeTruthy();
  });
});
