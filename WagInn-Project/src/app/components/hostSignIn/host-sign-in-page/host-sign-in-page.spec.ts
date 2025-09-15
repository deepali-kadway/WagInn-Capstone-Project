import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostSignInPage } from './host-sign-in-page';

describe('HostSignInPage', () => {
  let component: HostSignInPage;
  let fixture: ComponentFixture<HostSignInPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostSignInPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostSignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
