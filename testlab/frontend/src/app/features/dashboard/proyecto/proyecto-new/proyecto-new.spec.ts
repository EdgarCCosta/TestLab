import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoNew } from './proyecto-new';

describe('ProyectoNew', () => {
  let component: ProyectoNew;
  let fixture: ComponentFixture<ProyectoNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
