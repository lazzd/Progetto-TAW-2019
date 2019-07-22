import { TestBed } from '@angular/core/testing';

import { RefreshTokenService } from './refresh-token.service';

describe('RefreshTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefreshTokenService = TestBed.get(RefreshTokenService);
    expect(service).toBeTruthy();
  });
});
