import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRegistrationPersonalInfo } from './host-registration-personal-info';

describe('HostRegistrationPersonalInfo', () => {
  let component: HostRegistrationPersonalInfo;
  let fixture: ComponentFixture<HostRegistrationPersonalInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostRegistrationPersonalInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostRegistrationPersonalInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
