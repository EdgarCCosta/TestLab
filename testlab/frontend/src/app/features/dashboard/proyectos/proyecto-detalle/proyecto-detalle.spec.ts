import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoDetalle } from './proyecto-detalle';

describe('ProyectoDetalle', () => {
  let component: ProyectoDetalle;
  let fixture: ComponentFixture<ProyectoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
