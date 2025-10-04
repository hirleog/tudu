import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishHireButtonComponent } from './finish-hire-button.component';

describe('FinishHireButtonComponent', () => {
  let component: FinishHireButtonComponent;
  let fixture: ComponentFixture<FinishHireButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishHireButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishHireButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
