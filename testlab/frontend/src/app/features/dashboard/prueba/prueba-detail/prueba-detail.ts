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


@Component({
  selector: 'app-prueba-detail',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingInlineComponent],
  templateUrl: './prueba-detail.html',
  styleUrl: './prueba-detail.css',
})


export class PruebaDetail {

  loading: boolean = true;

  itemId = input<string | null>();                 // puede ser string o null
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
      steps: ['', [Validators.required, Validators.minLength(10)]],
      expected_result: ['', [Validators.required, Validators.minLength(10)]],
      rol: ['', [Validators.required, Validators.minLength(10)]],
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
        this.form.patchValue({ version_id: '' });
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
            steps: this.item.steps,
            expected_result: this.item.expected_result,
            rol: this.item.user_profile,
            project_id: projectId,               // ✔ obtenido desde la versión
            version_id: this.item.version_id     // ✔ selecciona la versión correcta
          });
          this.loading = false; // ✔ Todo listo

        });
      });
    },
    error: () => {
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
