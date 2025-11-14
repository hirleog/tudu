import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNegotiationBarComponent } from './mobile-negotiation-bar.component';

describe('MobileNegotiationBarComponent', () => {
  let component: MobileNegotiationBarComponent;
  let fixture: ComponentFixture<MobileNegotiationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileNegotiationBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileNegotiationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
