import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalgaComponent } from './malga.component';

describe('MalgaComponent', () => {
  let component: MalgaComponent;
  let fixture: ComponentFixture<MalgaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MalgaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MalgaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
