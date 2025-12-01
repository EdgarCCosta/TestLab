import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjemploList } from './ejemplo-list';

describe('EjemploList', () => {
  let component: EjemploList;
  let fixture: ComponentFixture<EjemploList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjemploList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjemploList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
