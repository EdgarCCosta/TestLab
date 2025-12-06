import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaList } from './prueba-list';

describe('PruebaList', () => {
  let component: PruebaList;
  let fixture: ComponentFixture<PruebaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
