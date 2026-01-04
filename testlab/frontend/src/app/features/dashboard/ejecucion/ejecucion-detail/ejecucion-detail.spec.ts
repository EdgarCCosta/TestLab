import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionDetail } from './ejecucion-detail';

describe('EjecucionDetail', () => {
  let component: EjecucionDetail;
  let fixture: ComponentFixture<EjecucionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecucionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjecucionDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
