import { Component, input, model, effect } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProyectoService } from '../../../../services/proyecto-service';
import { CreateProyectoDto } from '../../../../models/proyecto';
import { Modal } from 'bootstrap';
import { ToastService } from '../../../../layout/shared/toast/toast';


@Component({
  selector: 'app-proyecto-new',
  imports: [ReactiveFormsModule],
  templateUrl: './proyecto-new.html',
  styleUrl: './proyecto-new.css',
})
export class ProyectoNew {

  proyectoId = input<string | null>();                 // puede ser string o null
  listado = model<any[]>([]);

  proyecto!: CreateProyectoDto;
  form!: FormGroup;

  constructor(
    private _proyectoService: ProyectoService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private _toastService: ToastService
  ) {

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['', [Validators.required]],
    });

    effect(() => {
      if (this.listado().length) {
        console.log('Nuevo proyecto añadido al listado:', this.listado);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario enviado!!', this.form.value);

      this._proyectoService.createProyecto(this.form.value).subscribe({
        next: (datos) => {
          console.log('Proyecto creado');
          this.listado.update((listado) => ([...listado, datos.data]));
          this._toastService.show('Proyecto creado correctamente', 'success');
        },
        error: (err) => {
          console.error('Error creando proyecto:', err);
          this._toastService.show('Error creando proyecto', 'error');
        }
      });

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
