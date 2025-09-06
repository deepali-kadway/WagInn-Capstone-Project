import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRegistrationAddressDetails } from './host-registration-address-details';

describe('HostRegistrationAddressDetails', () => {
  let component: HostRegistrationAddressDetails;
  let fixture: ComponentFixture<HostRegistrationAddressDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostRegistrationAddressDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostRegistrationAddressDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
