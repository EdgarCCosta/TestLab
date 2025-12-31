import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionList } from './ejecucion-list';

describe('EjecucionList', () => {
  let component: EjecucionList;
  let fixture: ComponentFixture<EjecucionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecucionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjecucionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
