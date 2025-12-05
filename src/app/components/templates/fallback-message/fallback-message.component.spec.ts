import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallbackMessageComponent } from './fallback-message.component';

describe('FallbackMessageComponent', () => {
  let component: FallbackMessageComponent;
  let fixture: ComponentFixture<FallbackMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FallbackMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FallbackMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
