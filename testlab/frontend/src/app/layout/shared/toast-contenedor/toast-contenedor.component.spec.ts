import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastContenedorComponent } from './toast-contenedor.component';

describe('ToastContenedorComponent', () => {
  let component: ToastContenedorComponent;
  let fixture: ComponentFixture<ToastContenedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastContenedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
