import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaDetail } from './prueba-detail';

describe('PruebaDetail', () => {
  let component: PruebaDetail;
  let fixture: ComponentFixture<PruebaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
