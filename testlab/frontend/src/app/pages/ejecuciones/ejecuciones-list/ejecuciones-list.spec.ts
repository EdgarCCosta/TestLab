import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionesList } from './ejecuciones-list';

describe('EjecucionesList', () => {
  let component: EjecucionesList;
  let fixture: ComponentFixture<EjecucionesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecucionesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjecucionesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
