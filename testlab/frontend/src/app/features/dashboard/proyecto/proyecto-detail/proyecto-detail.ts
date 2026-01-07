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
import { ProyectoDashboard } from '../../../../models/proyectoDashboard';
import { ToastService } from '../../../../layout/shared/toast/toast';

import { UsuarioService } from '../../../../services/usuario-service';
import { PruebaService } from '../../../../services/prueba-service';

import { ModalDetail } from '../../../../layout/shared/modal/modal-detail/modal-detail';
import { ProyectoNew } from '../proyecto-new/proyecto-new';

// import { LoadingInlineComponent } from '../../../../layout/shared/loading-inline/loading-inline';
import { LoadingComponent } from '../../../../layout/shared/loading/loading';

import { SpinnerService } from '../../../../services/spinner-service';

import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UsuarioDetail } from "../../usuario/usuario-detail/usuario-detail";
import { VersionDetail } from "../../version/version-detail/version-detail";
import { PruebaDetail } from "../../prueba/prueba-detail/prueba-detail";
import { EjecucionDetail } from "../../ejecucion/ejecucion-detail/ejecucion-detail";

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule, ModalDetail, ProyectoNew, LoadingComponent, UsuarioDetail, VersionDetail, PruebaDetail, EjecucionDetail],
  templateUrl: './proyecto-detail.html',
  styleUrls: ['./proyecto-detail.css']
})
export class ProyectoDetail {
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
  modal: 'proyecto' | 'usuario' | 'version' | 'prueba' | 'ejecucion' | null = null;
  proyectoSelId = model<string | null>(null);
  userSelId = model<string | null>(null);
  versionSelId: string | null  = null;
  pruebaSelId = model<string | null>(null);
  ejecucionSelId = model<string | null>(null);
  modo: 'nuevo' | 'editar' = 'editar';
  tituloModalDetail = '';

  // Models para vigilar y actualizar los arrays de los listados
  listadoUsuarios = model<any[]>([]);
  listadoVersiones = model<any[]>([]);
  listadoPruebas = model<any[]>([]);
  listadoEjecuciones = model<any[]>([]);

  public nuevoUser: boolean = false;
  public nuevaVersion: boolean = false;
  public nuevaPrueba: boolean = false;
  public nuevaEjecucion: boolean = false;

  // Servicios
  private _proyectoService = inject(ProyectoService);
  private _usuarioService = inject(UsuarioService);
  private _versionService = inject(VersionService);
  private _pruebaService = inject(PruebaService);
  private _ejecucionService = inject(EjecucionService);
  private _toastService = inject(ToastService);
  private _location = inject(Location);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  // Signal global de proyectos
  proyectos = this._proyectoService.proyectos;

  // Efecto para sincronizar el detalle cuando cambia la lista global
  actualizarProyectoEffect = effect(() => {
    const id = this.proyectoId();
    if (!id) return;

    const lista = this.proyectos();
    const actualizado = lista.find(p => p.id.toString() === id);

    if (actualizado) {
      this.proyecto.set(actualizado);
    }
  });

  constructor(
    public _spinnerService : SpinnerService
  ) {

    this._route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.proyectoId.set(id);
      console.log('proyecto-detail - proyectoId: ', this.proyectoId());

      if (id) {
        this.cargarDetalle(id);
      }
    });

  }

  ngOnInit() {
    // Cargar lista global si no está cargada
    this._proyectoService.getProyectos().subscribe(); // PARA QUÉ??

  }

  // 🔵 CARGA COMPLETA DEL DETALLE CON forkJoin
  cargarDetalle(id: string) {
    this.loadingDetalle.set(true);

  //   forkJoin({
  //     proyecto: this._proyectoService.getProyectoById(id),
  //     usuarios: this._proyectoService.getUsersFromProyectoById(id),
  //     pruebas: this._proyectoService.getPruebasFromProyectoById(id),
  //     versiones: this._versionService.getVersionesByProject(id),
  //     ejecuciones: this._ejecucionService.getEjecuciones()
  //   })
  //   .pipe(
  //     finalize(() => this.loadingDetalle.set(false))
  //   )
  //   .subscribe({
  //     next: ({ proyecto, usuarios, pruebas, versiones, ejecuciones }) => {
  //       this.proyecto.set(proyecto)
  //       this.usuarios = usuarios;
  //       this.pruebas = pruebas;
  //       this.versiones = versiones;
  //       this.ejecuciones = ejecuciones.filter(e => e.version.project_id.toString() === id);
  //     },
  //     error: (error) => {
  //       console.log('Error: ', error);
  //       this._toastService.show('No se pudo cargar el proyecto', 'error');
  //       this._router.navigate(['/proyecto']);
  //     }
  //   });
  // }

  
    this._proyectoService.getProyectoDashboard(id)
      .pipe(finalize(() => this.loadingDetalle.set(false)))
      .subscribe({
        next: (dashboard) => {
          // Proyecto completo
          this.proyecto.set(dashboard.project);

          // Usuarios del proyecto
          this.usuarios = dashboard.users;

          // Pruebas → vienen dentro de test cases de cada versión
          // Si quieres mantener pruebas como entidad separada:
          this.pruebas = dashboard.versions_summary
            .flatMap((v: any) => v.test_cases || []);

          // Versiones del proyecto
          // this.versiones = dashboard.versions_summary.map((v: any) => ({
          //   id: v.id,
          //   version_number: v.version_number,
          //   test_cases_count: v.test_cases_count,
          //   executions_count: v.executions_count
          // }));
          this.versiones = dashboard.project.versions;
          console.log("versiones",this.versiones);

          // Ejecuciones del proyecto
          this.ejecuciones = dashboard.latest_executions;
          console.log(dashboard);
        },
        error: () => {
          this._toastService.show('No se pudo cargar el proyecto', 'error');
          this._router.navigate(['/proyecto']);
        }
      });
  }

    // CARGA de proyecto (para actualizaciones tras editar)
  cargarProyecto(id: string) {
    this.loadingDetalle.set(true);

    this._proyectoService.getProyectoById(id)
    .pipe(
      finalize(() => this.loadingDetalle.set(false))
    )
    .subscribe({
      next: (proyecto) => {
        this.proyecto.set(proyecto);
      },
      error: (error) => {
        console.log('Error: ', error);
        this._toastService.show('No se pudo cargar el proyecto', 'error');
        this._router.navigate(['/proyecto']);
      }
    });
  }



  /*********************** PROYECTO *************************************/

  // editarProyecto() {
  //   this.router.navigate(['/proyectos', this.proyectoId, 'editar']);
  // }

  editarProyecto() {
    this.modal = 'proyecto';
    this.modo = 'editar';
    this.proyectoSelId.set(this.proyectoId()); // el id actual
    this.tituloModalDetail = 'Editar proyecto';
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
        this._router.navigate(['/proyecto']);
      },
      error: (err) => {
        console.error('Error eliminando proyecto:', err);
        this._toastService.show('Error eliminando proyecto', 'error');
      }
    });
  }

  proyectoChange($e: any) {
    console.log('Proyecto editado en proyecto-detail.ts:', this.proyecto);
    this.cargarProyecto(this.proyectoId()!);
  }


  /************************ USUARIOS ********************************/

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

  /************************ VERSIONES ********************************/

  abrirNuevaVersion() {
    this.modal = 'version';
    this.modo = 'nuevo';
    this.versionSelId = null;
    this.nuevaVersion = true;
    this.tituloModalDetail = 'Nueva version';
  }

  editarVersion(versionId: string) {
    this.modal = 'version';
    this.modo = 'editar';
    this.versionSelId = versionId;
    this.nuevaVersion = false;
    this.tituloModalDetail = 'Editar version';
    document.getElementById('btnAbrirModalVersion')?.click();

  }

  eliminarVersion(versionId: string) {
    // TODO: Modal para eliminar versión
  }

  listadoVersionesChange($e: any){
    console.log('Listado de versiones ha cambiado:', this.versiones);
    for (const v of this.versiones) {
      //
    }
  }

  /************************ PRUEBAS ********************************/

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

  listadoPruebasChange($e: any){
    console.log('Listado de pruebas ha cambiado:', this.pruebas);
    for (const p of this.pruebas) {
      //
    }
  }

  /************************ EJECUCIONES ********************************/

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

  listadoEjecucionesChange($e: any){
    console.log('Listado de ejecuciones ha cambiado:', this.ejecuciones);
    for (const e of this.ejecuciones) {
      //
    }
  }

  atras() {
    this._location.back();
  }
}