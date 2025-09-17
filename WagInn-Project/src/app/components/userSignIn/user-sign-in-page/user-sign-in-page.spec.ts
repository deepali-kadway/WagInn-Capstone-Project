import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignInPage } from './user-sign-in-page';

describe('UserSignInPage', () => {
  let component: UserSignInPage;
  let fixture: ComponentFixture<UserSignInPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSignInPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
