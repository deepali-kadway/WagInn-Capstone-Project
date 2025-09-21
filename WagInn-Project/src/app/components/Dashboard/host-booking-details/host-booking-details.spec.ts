import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostBookingDetails } from './host-booking-details';

describe('HostBookingDetails', () => {
  let component: HostBookingDetails;
  let fixture: ComponentFixture<HostBookingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostBookingDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostBookingDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
