import { TestBed } from '@angular/core/testing';

import { HostFetchDetails } from './host-fetch-details';

describe('HostFetchDetails', () => {
  let service: HostFetchDetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostFetchDetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
