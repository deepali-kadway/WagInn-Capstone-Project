import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostHeader } from './host-header';

describe('HostHeader', () => {
  let component: HostHeader;
  let fixture: ComponentFixture<HostHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
