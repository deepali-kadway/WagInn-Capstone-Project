import { TestBed } from '@angular/core/testing';

import { UserFetchProperties } from './user-fetch-properties';

describe('UserFetchProperties', () => {
  let service: UserFetchProperties;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFetchProperties);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
