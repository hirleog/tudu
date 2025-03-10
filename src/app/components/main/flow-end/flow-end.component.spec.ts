import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowEndComponent } from './flow-end.component';

describe('FlowEndComponent', () => {
  let component: FlowEndComponent;
  let fixture: ComponentFixture<FlowEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowEndComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
