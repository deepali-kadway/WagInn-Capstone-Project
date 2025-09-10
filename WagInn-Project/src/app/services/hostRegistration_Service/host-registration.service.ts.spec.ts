import { TestBed } from '@angular/core/testing';

import { HostRegistrationServiceTs } from './host-registration.service.ts';

describe('HostRegistrationServiceTs', () => {
  let service: HostRegistrationServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostRegistrationServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
