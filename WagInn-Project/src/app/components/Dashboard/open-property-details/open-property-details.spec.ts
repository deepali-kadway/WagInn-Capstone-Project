import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPropertyDetails } from './open-property-details';

describe('OpenPropertyDetails', () => {
  let component: OpenPropertyDetails;
  let fixture: ComponentFixture<OpenPropertyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenPropertyDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenPropertyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
