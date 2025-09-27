import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestadorInstitucionalComponent } from './prestador-institucional.component';

describe('PrestadorInstitucionalComponent', () => {
  let component: PrestadorInstitucionalComponent;
  let fixture: ComponentFixture<PrestadorInstitucionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestadorInstitucionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestadorInstitucionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
