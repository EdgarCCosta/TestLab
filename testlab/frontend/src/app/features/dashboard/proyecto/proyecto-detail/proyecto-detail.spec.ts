import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoDetail } from './proyecto-detail';

describe('ProyectoDetail', () => {
  let component: ProyectoDetail;
  let fixture: ComponentFixture<ProyectoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
