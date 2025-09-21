import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookingsUser } from './my-bookings-user';

describe('MyBookingsUser', () => {
  let component: MyBookingsUser;
  let fixture: ComponentFixture<MyBookingsUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyBookingsUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBookingsUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
