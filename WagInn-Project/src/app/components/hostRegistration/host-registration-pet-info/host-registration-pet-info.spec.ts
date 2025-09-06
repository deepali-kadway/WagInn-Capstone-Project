import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRegistrationPetInfo } from './host-registration-pet-info';

describe('HostRegistrationPetInfo', () => {
  let component: HostRegistrationPetInfo;
  let fixture: ComponentFixture<HostRegistrationPetInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostRegistrationPetInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostRegistrationPetInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
