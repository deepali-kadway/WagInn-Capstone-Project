import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRegistrationIDVerification } from './host-registration-idverification';

describe('HostRegistrationIDVerification', () => {
  let component: HostRegistrationIDVerification;
  let fixture: ComponentFixture<HostRegistrationIDVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostRegistrationIDVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostRegistrationIDVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
