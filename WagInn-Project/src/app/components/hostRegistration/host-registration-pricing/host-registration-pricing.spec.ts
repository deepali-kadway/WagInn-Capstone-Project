import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRegistrationPricing } from './host-registration-pricing';

describe('HostRegistrationPricing', () => {
  let component: HostRegistrationPricing;
  let fixture: ComponentFixture<HostRegistrationPricing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostRegistrationPricing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostRegistrationPricing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
