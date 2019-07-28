import { TestBed } from '@angular/core/testing';

import { WaiterArrivalService } from './waiter-arrival.service';

describe('WaiterArrivalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WaiterArrivalService = TestBed.get(WaiterArrivalService);
    expect(service).toBeTruthy();
  });
});
