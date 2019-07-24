import { TestBed } from '@angular/core/testing';

import { WaiterOrdersService } from './waiter-orders.service';

describe('WaiterOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WaiterOrdersService = TestBed.get(WaiterOrdersService);
    expect(service).toBeTruthy();
  });
});
