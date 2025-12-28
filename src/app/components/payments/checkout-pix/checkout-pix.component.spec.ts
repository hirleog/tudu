import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPixComponent } from './checkout-pix.component';

describe('CheckoutPixComponent', () => {
  let component: CheckoutPixComponent;
  let fixture: ComponentFixture<CheckoutPixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutPixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutPixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
