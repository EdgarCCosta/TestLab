import { Component, signal, model, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

import { ProyectoService } from '../../../../services/proyecto-service';
import { VersionService } from '../../../../services/version-service';
import { EjecucionService } from '../../../../services/ejecucion-service';

import { Proyecto } from '../../../../models/proyecto';
import { Usuario } from '../../../../models/usuario';
import { Version } from '../../../../models/version';
import { Prueba } from '../../../../models/prueba';
import { Ejecucion } from '../../../../models/ejecucion';
import { ToastService } from '../../../../layout/shared/toast/toast';

import { UsuarioService } from '../../../../services/usuario-service';
import { PruebaService } from '../../../../services/prueba-service';

import { Modal } from '../../../../layout/shared/modal/modal';
import { ProyectoNew } from '../proyecto-new/proyecto-new';

// import { LoadingInlineComponent } from '../../../../layout/shared/loading-inline/loading-inline';
import { LoadingComponent } from '../../../../layout/shared/loading/loading';

import { SpinnerService } from '../../../../services/spinner-service';

import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule, Modal, ProyectoNew, LoadingComponent],
  templateUrl: './proyecto-detail.html',
  styleUrls: ['./proyecto-detail.css']
})
export class ProyectoDetail {

  // Signals principales
  proyectoId = signal<string | null>(null);
  proyecto = signal<Proyecto | null>(null);

  usuarios: Usuario[] = [];
  versiones: Version[] = [];
  pruebas: Prueba[] = [];
  ejecuciones: Ejecucion[] = [];

  // Mostrar más/menos
  mostrarTodosUsuarios = false;
  mostrarTodasVersiones = false;
  mostrarTodasPruebas = false;
  mostrarTodasEjecuciones = false;

  // Spinner local
  loadingDetalle = signal(false);
  logingUsuario = signal(false);
  loadingVersiones = signal(false);
  loadingPruebas = signal(false);
  loadingEjecuciones = signal(false);


  // Estado modal
  proyectoSelId = model<string | null>(null);
  modo = model<'nuevo' | 'editar'>('editar');

  // Servicios
  private _proyectoService = inject(ProyectoService);
  private _usuarioService = inject(UsuarioService);
  private _versionService = inject(VersionService);
  private _pruebaService = inject(PruebaService);
  private _ejecucionService = inject(EjecucionService);
  private _toastService = inject(ToastService);
  private _location = inject(Location);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signal global de proyectos
  proyectos = this._proyectoService.proyectos;

  // Efecto para sincronizar el detalle cuando cambia la lista global
  // actualizarProyectoEffect = effect(() => {
  //   const id = this.proyectoId();
  //   if (!id) return;

  //   const lista = this.proyectos();
  //   const actualizado = lista.find(p => p.id.toString() === id);

  //   if (actualizado) {
  //     this.proyecto.set(actualizado);
  //   }
  // });

  constructor(
    public _spinnerService : SpinnerService
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.proyectoId.set(id);

      if (id) {
        this.cargarDetalle(id);
      }
    });
  }

  ngOnInit() {
    // Cargar lista global si no está cargada
    this._proyectoService.getProyectos().subscribe();
  }

  // 🔵 CARGA COMPLETA DEL DETALLE CON forkJoin
  cargarDetalle(id: string) {
    this.loadingDetalle.set(true);

    forkJoin({
      proyecto: this._proyectoService.getProyectoById(id),
      usuarios: this._proyectoService.getUsersFromProyectoById(id),
      pruebas: this._proyectoService.getPruebasFromProyectoById(id),
      versiones: this._versionService.getVersiones(),
      ejecuciones: this._ejecucionService.getEjecuciones()
    })
    .pipe(
      finalize(() => this.loadingDetalle.set(false))
    )
    .subscribe({
      next: ({ proyecto, usuarios, pruebas, versiones, ejecuciones }) => {
        this.proyecto.set(proyecto);
        this.usuarios = usuarios;
        this.pruebas = pruebas;
        this.versiones = versiones.filter(v => v.project_id.toString() === id);
        this.ejecuciones = ejecuciones.filter(e => e.version.project_id.toString() === id);
      },
      error: () => {
        this._toastService.show('No se pudo cargar el proyecto', 'error');
        this.router.navigate(['/proyecto']);
      }
    });
  }


  // editarProyecto() {
  //   this.router.navigate(['/proyectos', this.proyectoId, 'editar']);
  // }

editarProyecto() {
  this.modo.set('editar');

  this.proyectoSelId.set(this.proyectoId()); // el id actual
  document.getElementById('btnAbrirModalProyecto')?.click();
}


  eliminarProyecto() {
    const id = this.proyectoId();
    if (!id) return;


    const ok = confirm("¿Seguro que quieres eliminar este proyecto? Esta acción no se puede deshacer.");

    if (!ok) return; // El usuario canceló

    this._proyectoService.deleteProyecto(id.toString()).subscribe({
      next: () => {
        this._toastService.show('Proyecto eliminado correctamente', 'success');
        this.router.navigate(['/proyecto']);
      },
      error: (err) => {
        console.error('Error eliminando proyecto:', err);
        this._toastService.show('Error eliminando proyecto', 'error');
      }
    });
  }

  abrirAsociarUsuario(proyectoId: string) {
    // TODO: Modal y componente de asociación de usuario a proyecto
  }

  disociarUsuario(idUsuario: string) {
     const id = this.proyectoId();   // leer el signal

  if (!id) return;                // seguridad: evitar null

    this._proyectoService.unlinkUsuarioFromProyecto(id, idUsuario).subscribe({
      next: () => {
        // TODO: Modal o toast informativos
      },
      error: (err) => console.error('Error disociando usuario del proyecto:', err)
    })
  }

  abrirNuevaVersion(proyectoId: string) {
    // TODO: Modal para crear nueva versión
  }


  editarVersion(versionId: string) {
    // TODO: Modal para editar versión
  }

  eliminarVersion(versionId: string) {
    // TODO: Modal para eliminar versión
  }

  abrirAsociarPrueba(proyectoId: string) {
    // TODO: Modal y componente de asociación de prueba a proyecto (desde prueba ya existente o creación de prueba y asociar)
  }

  disociarPrueba(idPrueba: string) {
    const id = this.proyectoId();   // leer el signal

    if (!id) return;                // seguridad: evitar null

    this._proyectoService.unlinkPruebaFromProyecto(id, idPrueba).subscribe({
      next: () => {
        // TODO: Modal o toast informativos
      },
      error: (err) => console.error('Error disociando prueba del proyecto:', err)
    })
  }

  editarEjecucion(idEjecucion: string) {
    // TODO: Modal para editar ejecucion
  }

  eliminarEjecucion(idEjecucion: string) {
    this._ejecucionService.deleteEjecucion(idEjecucion).subscribe({
      next: () => {
        // TODO: Modal o toast informativos
      },
      error: (err) => console.error('Error eliminando ejecución:', err)
    });
  }

  atras() {
    this._location.back();
  }
}