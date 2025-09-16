import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrationPersonalInfo } from './user-registration-personal-info';

describe('UserRegistrationPersonalInfo', () => {
  let component: UserRegistrationPersonalInfo;
  let fixture: ComponentFixture<UserRegistrationPersonalInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRegistrationPersonalInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRegistrationPersonalInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
