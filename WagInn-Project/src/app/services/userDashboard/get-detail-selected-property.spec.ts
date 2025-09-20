import { TestBed } from '@angular/core/testing';

import { GetDetailSelectedProperty } from './get-detail-selected-property';

describe('GetDetailSelectedProperty', () => {
  let service: GetDetailSelectedProperty;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetDetailSelectedProperty);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
