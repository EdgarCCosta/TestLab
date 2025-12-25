import { Component, input, model, effect } from '@angular/core';
import { UpdatePruebaDto } from '../../../../models/prueba';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PruebaService } from '../../../../services/prueba-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { Location } from '@angular/common';

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
    private _location: Location
  ) {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      objective: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
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
          name: '',
          email: '',
          password: '',
          rol: ''
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
      },
      error: (err) => {
        console.error('Error obteniendo el ítem:', err);
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
      },
      error: error => {
        console.log("Error: ", error);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario enviado!!', this.form.value);

      if (this.modo() === 'detalle' && this.itemId()) {
        this._itemService.updatePrueba(this.itemId()!, this.form.value).subscribe({
          next: () => console.log('Ítem actualizado'),
          error: (err) => console.error('Error actualizando ítem:', err)
        });
      } else if (this.modo() === 'nuevo') {
        this._itemService.createPrueba(this.form.value).subscribe({
          next: (datos) => {
            console.log('Ítem creado');
            // console.log('Listado antes de añadir:', this.listado());
            this.listado.update((listado) => ([...listado, datos.data]));
            // console.log('Listado tras añadir:', this.listado());
          },
          error: (err) => console.error('Error creando ítem:', err)
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
