import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUserBookings } from './my-user-bookings';

describe('MyUserBookings', () => {
  let component: MyUserBookings;
  let fixture: ComponentFixture<MyUserBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyUserBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyUserBookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
