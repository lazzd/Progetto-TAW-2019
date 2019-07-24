import { TestBed } from '@angular/core/testing';

import { WaiterTablesService } from './waiter-tables.service';

describe('WaiterTablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WaiterTablesService = TestBed.get(WaiterTablesService);
    expect(service).toBeTruthy();
  });
});
