import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuduProfessionalComponent } from './tudu-professional.component';

describe('TuduProfessionalComponent', () => {
  let component: TuduProfessionalComponent;
  let fixture: ComponentFixture<TuduProfessionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TuduProfessionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuduProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
