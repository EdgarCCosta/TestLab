import { Component, input, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../../layout/shared/toast/toast';
import { Prueba } from '../../../../models/prueba';
import { Version } from '../../../../models/version';
import { PruebaService } from '../../../../services/prueba-service';
import { VersionService } from '../../../../services/version-service';

@Component({
  selector: 'app-proyecto-link-testcase',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './proyecto-link-testcase.html',
  styleUrl: './proyecto-link-testcase.css',
})
export class ProyectoLinkTestcase {

  // Bidireccional → actualiza el padre
  listado = model<any[]>([]);

  // Pruebas cargadas desde BD
  pruebas: Prueba[] = [];

  // Versiones recibidas del padre
  versiones = input<Version[]>([]);

  // ID del proyecto (si lo necesitas para algo más adelante)
  proyectoId = input<string | null>(null);

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _toastService: ToastService,
    private _pruebaService: PruebaService,
    private _versionService: VersionService
  ) {

    this.form = this.fb.group({
      testCaseId: ['', Validators.required],
      versionId: ['', Validators.required],
    });

    // Cargar TODAS las pruebas existentes
    this._pruebaService.getPruebas().subscribe({
      next: (datos) => {
        this.pruebas = datos;
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { testCaseId, versionId } = this.form.value;
      

      this._versionService.linkPruebaToVersion(versionId, testCaseId).subscribe({
      next: (res) => {

        const { version, test_case } = res.data;

        this.listado.update(lista => [
          ...lista,
          {
            ...test_case,
            version_id: version.id,
            version_number: version.version_number
          }
        ]);

      // Volver a "Selecciona una versión"
      this.form.get('versionId')?.setValue('');

      // Si también quieres resetear el testCaseId:
      this.form.get('testCaseId')?.setValue('');

        this._toastService.show('Prueba asociada correctamente', 'success');
      },
        error: (err) => {
          console.error('Error asociando prueba:', err);
          this._toastService.show('Error asociando prueba', 'error');
        }
      });
    }
  }

  get formControls() {
    return this.form.controls;
  }
}