import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrationPetInfo } from './user-registration-pet-info';

describe('UserRegistrationPetInfo', () => {
  let component: UserRegistrationPetInfo;
  let fixture: ComponentFixture<UserRegistrationPetInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRegistrationPetInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRegistrationPetInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
