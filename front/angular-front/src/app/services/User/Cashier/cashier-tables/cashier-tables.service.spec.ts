import { TestBed } from '@angular/core/testing';

import { CashierTablesService } from './cashier-tables.service';

describe('CashierTablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashierTablesService = TestBed.get(CashierTablesService);
    expect(service).toBeTruthy();
  });
});
