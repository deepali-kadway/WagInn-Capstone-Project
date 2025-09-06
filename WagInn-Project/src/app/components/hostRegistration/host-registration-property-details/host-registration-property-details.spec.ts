import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRegistrationPropertyDetails } from './host-registration-property-details';

describe('HostRegistrationPropertyDetails', () => {
  let component: HostRegistrationPropertyDetails;
  let fixture: ComponentFixture<HostRegistrationPropertyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostRegistrationPropertyDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostRegistrationPropertyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
