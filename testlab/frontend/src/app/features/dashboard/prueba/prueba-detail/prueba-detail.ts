import { Component, input, model, effect } from '@angular/core';
import { UpdatePruebaDto } from '../../../../models/prueba';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PruebaService } from '../../../../services/prueba-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { Location } from '@angular/common';
import { ToastService } from '../../../../layout/shared/toast/toast';


@Component({
  selector: 'app-prueba-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './prueba-detail.html',
  styleUrl: './prueba-detail.css',
})
export class PruebaDetail {


  itemId = input<string | null>();                 // puede ser string o null
  modo = input<'nuevo' | 'detalle'>('detalle');       // valor por defecto: 'detalle'
  listado = model<any[]>([]);

  item!: UpdatePruebaDto;
  form!: FormGroup;

  constructor(
    private _itemService: PruebaService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private _location: Location,
    private _toastService: ToastService
  ) {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      objective: ['', [Validators.required, Validators.minLength(5)]],
      preconditions: ['', [Validators.required, Validators.minLength(5)]],
      steps: ['', [Validators.required, Validators.minLength(10)]],
      expected_result: ['', [Validators.required, Validators.minLength(10)]],
    });

    effect(() => {
      if (this.itemId() != null) {
        console.log('Cambia el item');
        this.getItemById(this.itemId()!);
      }

      if (this.listado().length) {
        console.log('Nuevo usuario añadido al listado:', this.listado);
      }

      if (this.modo() === 'nuevo') {
        this.form.reset({
          title: '',
          objective: '',
          preconditions: '',
          steps: '',
          expected_result: ''
        });
      }
    });
  }

  /*** Recuperación de Usuario ***/
  getItemById(id: string): void {
    console.log('En propiedad getItemById');
    this._itemService.getPruebaById(id).subscribe({
      next: (datos) => {
        console.log(datos);
        this.item = datos.data;
        this.form.setValue({
          title: this.item?.title,
          objective: this.item?.objective,
          preconditions: this.item?.preconditions,
          steps: this.item?.steps,
          expected_result: this.item?.expected_result,
        });

        this.form.updateValueAndValidity();
        // this._toastService.show('Prueba cargada correctamente', 'success');
      },
      error: (err) => {
        console.error('Error obteniendo el ítem:', err);
        this._toastService.show('Error obteniendo la prueba', 'error');
      }
    });
  }

  borrar(id: string | null | undefined): void {
    if (!id) {
      console.warn('No hay itemId válido para borrar');
      return;
    }

    this._itemService.deletePrueba(id).subscribe({
      next: data => {
        console.log("OK: ", data);
        this._toastService.show('Prueba eliminada correctamente', 'success');
      },
      error: error => {
        console.log("Error: ", error);
        this._toastService.show('Error eliminando la prueba', 'error');
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {

        // Convertir steps (string) → array
    const stepsArray = this.form.value.steps
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    // Construir payload final
    const payload = {
      ...this.form.value,
      steps: stepsArray
    };

    console.log('Payload final:', payload); // Datos a introducir ***MODIFICAR***

      if (this.modo() === 'detalle' && this.itemId()) {
        this._itemService.updatePrueba(this.itemId()!, this.form.value).subscribe({
          next: () => {
            console.log('Ítem actualizado');
            this._toastService.show('Prueba actualizada correctamente', 'success');
          },
          error: (err) => {
            console.error('Error actualizando ítem:', err);
            this._toastService.show('Error actualizando la prueba', 'error');
          }
        });
      } else if (this.modo() === 'nuevo') {
        console.log('Formulario válido para crear', this.form.value)
        this._itemService.createPrueba(this.form.value).subscribe({
          next: (datos) => {
            console.log('Ítem creado');
            // console.log('Listado antes de añadir:', this.listado());
            this.listado.update((listado) => ([...listado, datos.data]));
            this._toastService.show('Prueba creada correctamente', 'success');
            // console.log('Listado tras añadir:', this.listado());
          },
          error: (err) => {
            console.error('Error creando ítem:', err);
            this._toastService.show('Error creando la prueba', 'error');
          }
        });
      }

      const modalEl = document.getElementById('detalleModal');
      if (modalEl) {
        const modal = Modal.getInstance(modalEl);
        modal?.hide();
      }
    }
  }

  get formControls() {
    return this.form.controls;
  }

}
