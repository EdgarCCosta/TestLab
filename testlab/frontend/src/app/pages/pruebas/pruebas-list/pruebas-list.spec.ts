import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasList } from './pruebas-list';

describe('PruebasList', () => {
  let component: PruebasList;
  let fixture: ComponentFixture<PruebasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebasList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebasList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
