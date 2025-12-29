import { Component, input, model, effect } from '@angular/core';
import { UpdatePruebaDto } from '../../../../models/prueba';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PruebaService } from '../../../../services/prueba-service';
import { ProyectoService } from '../../../../services/proyecto-service';
import { VersionService } from '../../../../services/version-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { Location } from '@angular/common';
import { ToastService } from '../../../../layout/shared/toast/toast';
import { Version } from '../../../../models/version';
import { LoadingInlineComponent } from '../../../../layout/shared/loading-inline/loading-inline';
import { atLeastOneStep } from '../../../../layout/shared/validators/at-least-one-step.validator';


@Component({
  selector: 'app-prueba-detail',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingInlineComponent],
  templateUrl: './prueba-detail.html',
  styleUrl: './prueba-detail.css',
})


export class PruebaDetail {

  loading: boolean = true;

  itemId = model<string | null>();                 // puede ser string o null
  modo = input<'nuevo' | 'detalle'>('detalle');       // valor por defecto: 'detalle'
  listado = model<any[]>([]);

  item!: UpdatePruebaDto;
  form!: FormGroup;

  projects: any[] = [];
  versions: Version[] = [];


  constructor(
    private _itemService: PruebaService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private _location: Location,
    private _toastService: ToastService,
    private _projectService: ProyectoService,
    private _versionService: VersionService
  ) {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      objective: ['', [Validators.required, Validators.minLength(5)]],
      preconditions: ['', [Validators.required, Validators.minLength(5)]],
      steps: ['', [Validators.required, Validators.minLength(10), atLeastOneStep]],
      expected_result: ['', [Validators.required, Validators.minLength(10)]],
      rol: ['', [Validators.required]],
      project_id: ['', Validators.required],
      version_id: ['', Validators.required]


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
        this.loading = false;
        this.form.reset({
          title: '',
          objective: '',
          preconditions: '',
          steps: '',
          expected_result: '',
          rol: '',
          project_id: '',
          version_id: ''

        });
      }
    });
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this._projectService.getProyectos().subscribe({
      next: (res) => {
        this.projects = res;
        console.log("PROYECTOS CARGADOS: ", this.projects);
      },
      error: () => this._toastService.show('Error cargando proyectos', 'error')
    });
  }

    onProjectChange(event: any) {
    const projectId = event.target.value;

    if (!projectId) {
      this.versions = [];
      this.form.patchValue({ version_id: '' });
      return;
    }

    this._versionService.getByProject(projectId).subscribe({
      next: (res) => {
        this.versions = res.data;
        console.log('VERSIONES CARGADAS: ', this.versions);
        this.form.patchValue({ version_id: '' }); // Actualiza solo este campo a vacío
      },
      error: () => this._toastService.show('Error cargando versiones', 'error')
    });
  }


  /*** Recuperación de Prueba ***/
  getItemById(id: string): void {
    this.loading = true;
  this._itemService.getPruebaById(id).subscribe({
    next: (datos) => {
      this.item = datos.data;

      // 1. Obtener el project_id desde la versión

      const versionId = Number(this.item.version_id);

      if (!versionId) {
        console.error('version_id inválido');
        return;
      }

      this._versionService.getVersionById(versionId).subscribe(version => {
        const projectId = Number(version.project_id);

        // 2. Cargar las versiones del proyecto
        this._versionService.getByProject(projectId).subscribe(res => {
          this.versions = res.data;

          // 3. Rellenar el formulario
          this.form.setValue({
            title: this.item.title,
            objective: this.item.objective,
            preconditions: this.item.preconditions,
            steps: Array.isArray(this.item.steps) // Si es array crea un string que separa cada paso con comas ", ". Sino 1 solo paso.
                // ? this.item.steps.join(', ')
                ? this.item.steps.join('\n')
                : this.item.steps,
            expected_result: this.item.expected_result,
            rol: this.item.user_profile,
            project_id: projectId,               // ✔ obtenido desde la versión
            version_id: this.item.version_id     // ✔ selecciona la versión correcta
          });

          // Campos del formulario marcados como touched y dirty para que muestre si son válidos al cargarlos
          Object.values(this.form.controls).forEach(control => {
            control.markAsTouched();
            control.markAsDirty();
          });

          this.loading = false; // ✔ Todo listo

        });
      });
    },
    error: (err) => {
  console.error('Error creando ítem:', err.error);

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
        this.listado.update(list => list.filter(item => item.id !== id));

        this._toastService.show('Prueba eliminada correctamente', 'success');
        this.itemId.set(null);
      },
      error: error => {
        this._toastService.show('Error eliminando la prueba', 'error');
        console.log("Error: ", error);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {

        // Convertir steps (string) → array
    const stepsArray = this.form.value.steps
      // .split(',')   // Separar por comas exclusivamente
      .split(/[\n,\.]+/)   // Separar por coma, punto o salto de línea
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    // Construir payload final
    const payload = {
      ...this.form.value,
      user_profile: this.form.value.rol,
      steps: stepsArray
    };

    console.log('Payload final:', payload); // Datos a introducir ***MODIFICAR***

      if (this.modo() === 'detalle' && this.itemId()) {
        this._itemService.updatePrueba(this.itemId()!, payload).subscribe({
          next: () => {
            console.log('Ítem actualizado');
              this.listado.update((listado) =>
                listado.map(item =>
                  item.id === this.itemId() ? { ...item, ...payload } : item
                )
              );

            this._toastService.show('Prueba actualizada correctamente', 'success');
          },
          error: (err) => {
            console.error('Error actualizando ítem:', err);
            this._toastService.show('Error actualizando la prueba', 'error');
          }
        });
      } else if (this.modo() === 'nuevo') {
        console.log('Payload final:', payload);
        this._itemService.createPrueba(payload).subscribe({
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
