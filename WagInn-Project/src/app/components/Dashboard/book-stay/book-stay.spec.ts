import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookStay } from './book-stay';

describe('BookStay', () => {
  let component: BookStay;
  let fixture: ComponentFixture<BookStay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookStay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookStay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
