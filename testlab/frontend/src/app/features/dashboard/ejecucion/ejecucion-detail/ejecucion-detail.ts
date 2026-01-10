import { Component, effect, input, model } from '@angular/core';
import { UpdateEjecucionDto } from '../../../../models/ejecucion';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EjecucionService } from '../../../../services/ejecucion-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../layout/shared/toast/toast';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-ejecucion-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './ejecucion-detail.html',
  styleUrl: './ejecucion-detail.css',
})
export class EjecucionDetail {
  userId = input<string | null>();
  versionId = input<string | null>();
  pruebaId = input<string | null>();
  ejecucionId = input<string | null>();
  modo = input<'nuevo' | 'editar'>('editar');       // valor por defecto: 'editar'
  listado = model<any[]>([]);

  ejecucion!: UpdateEjecucionDto;
  form!: FormGroup;

  constructor(
    private _ejecucionService: EjecucionService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private _toastService: ToastService
  ) {
    // console.log('ID proyecto inicial: ', this.projectId());
    this.form = this.fb.group({
      result: ['', [Validators.required, Validators.pattern('passed|failed')]],
      comment: ['', [Validators.required]],
      test_data: [[]],
      error_status: ['', [Validators.required, Validators.pattern('critical|high|medium|low|none')]],
      correction_notes: [''],
      observations: [''],
      executed_at: [''],
    });

    effect(() => {
      if (this.ejecucionId() != null) {
        console.log('Cambia la ejecucion', this.ejecucionId());
        this.getEjecucionById(this.ejecucionId()!);
      }
    });
  }

  /*** Recuperación de versión ***/
  getEjecucionById(id: string): void {
    console.log('En propiedad getVersionById');
    this._ejecucionService.getEjecucionById(id).subscribe({
      next: (datos) => {

        console.log(datos);
        this.ejecucion = datos;

        this.form.patchValue({
          result: this.ejecucion?.result,
          comment: this.ejecucion?.comment,
          descrtest_dataiption: this.ejecucion?.test_data,
          error_status: this.ejecucion?.error_status,
          correction_notes: this.ejecucion?.correction_notes,
          observations: this.ejecucion?.observations,
          executed_at: this.ejecucion?.executed_at,
        });

        this.form.updateValueAndValidity();
        Object.entries(this.form.controls).forEach(([key, control]) => {
          control.markAsTouched();
          control.markAsDirty();
        });
      },
      error: (err) => {
        console.error('Error obteniendo la ejecucion:', err);
      }
    });
  }

  borrar(id: string | null | undefined): void {
    if (!id) {
      this._toastService.show('No hay ejecucionId válido para borrar', 'error');
      console.warn('No hay ejecucionId válido para borrar');
      return;
    }

    this._ejecucionService.deleteEjecucion(id).subscribe({
      next: data => {
        console.log("OK: ", data);
        this.listado.update(list =>
          list.filter(e => e.id !== id)
        );
        this._toastService.show('Ejecución eliminada correctamente', 'success');
      },
      error: error => {
        console.log("Error: ", error);
        this._toastService.show('Error eliminando ejecución', 'error');
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {

      console.log('Valores formulario', this.form.value);

      if (this.modo() === 'editar' && this.versionId()) {
        this._ejecucionService.updateEjecucion(this.ejecucionId()!, this.form.value).subscribe({
          next: () => {
            this.listado.update(list =>
              list.map(e =>
                e.id === this.ejecucionId()
                  ? { ...this.form.value, id: this.ejecucionId() }
                  : e
              )
            );
            this._toastService.show('Ejecución actualizada correctamente', 'success');
          },
          error: (err) => {
            console.error('Error actualizando ejecución:', err);
            this._toastService.show('Error actualizando ejecución', 'error');
          }
        });
      } else if (this.modo() === 'nuevo') {
        this._ejecucionService.createEjecucion(this.form.value).subscribe({
          next: (datos) => {
            this.listado.update((listado) => ([...listado, datos.data]));
            this._toastService.show('Ejeución creada correctamente', 'success');
          },
          error: (err) => {
            console.error('Error creando ejecución:', err);
            this._toastService.show('Error creando ejecución', 'error');
          }
        });
      }

      const modalEl = document.getElementById('detalleEjecucionModal');
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
