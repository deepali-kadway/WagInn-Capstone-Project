import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRegistration } from './host-registration';

describe('HostRegistration', () => {
  let component: HostRegistration;
  let fixture: ComponentFixture<HostRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
