import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHelpComponent } from './order-help.component';

describe('OrderHelpComponent', () => {
  let component: OrderHelpComponent;
  let fixture: ComponentFixture<OrderHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
