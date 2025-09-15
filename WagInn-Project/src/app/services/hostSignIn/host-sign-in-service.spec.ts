import { TestBed } from '@angular/core/testing';

import { HostSignInService } from './host-sign-in-service';

describe('HostSignInService', () => {
  let service: HostSignInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostSignInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
