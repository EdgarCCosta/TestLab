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
import { AuthService } from '../../../../services/auth-service';

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
import { ProyectoLinkUser } from '../proyecto-link-user/proyecto-link-user';

import { Img } from '../../../../layout/shared/img/img/img';
import { ProyectoLinkTestcase } from "../proyecto-link-testcase/proyecto-link-testcase";
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule, ModalDetail, ProyectoNew, LoadingComponent, ProyectoLinkUser, UsuarioDetail, VersionDetail, PruebaDetail, EjecucionDetail, Img, ProyectoLinkTestcase],
  templateUrl: './proyecto-detail.html',
  styleUrls: ['./proyecto-detail.css']
})
export class ProyectoDetail {

  auth = inject(AuthService);
  // Acceso directo al rol reactivo
  role = this.auth.role;
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
  ejecucionSelId: string | null  = null;
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
          console.log('usuarios', this.usuarios);

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
          console.log("las pruebitas", this.pruebas);
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
        console.log('Proyecto cargado EDITADO:', proyecto);
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
    // this.nuevoUser = true;
    this.modal = 'usuario';
    // this.modo = 'nuevo';
    // this.userSelId.set(null);

    this.proyectoSelId.set(proyectoId);
    this.tituloModalDetail = 'Asociar usuario al proyecto';

    document.getElementById('btnAbrirModalProyecto')?.click();
  }

  listadoUsuariosChange($e: any) {
    console.log('Listado de usuarios ha cambiado:', this.usuarios);
  }

  disociarUsuario(idUsuario: string) {
    const id = this.proyectoId();   // leer el signal

    if (!id) return;                // seguridad: evitar null

    console.log('Disociando usuario', id, idUsuario);
    console.log('usuarios pre', this.usuarios);

    this._proyectoService.unlinkUsuarioFromProyecto(id, idUsuario).subscribe({
    next: () => {
        this._toastService.show('Usuario eliminado del proyecto', 'success');
      // 🔥 Recargar SOLO los usuarios
      this.usuarios = this.usuarios.filter(u => u.id !== idUsuario);
      console.log('usuarios post', this.usuarios);
      },
      error: (err) => {
        console.error('Error disociando usuario del proyecto:', err);
        this._toastService.show('No se pudo eliminar el usuario', 'error');
      }
    });

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
    this.versionSelId = versionId;
    // TODO: Modal para eliminar versión
    const ok = confirm('¿Estás seguro de eliminar esta versión?');
    if (!ok) return;
    this._versionService.deleteVersion(this.versionSelId!).subscribe({
      next: () => {
        this._toastService.show('Versión eliminada correctamente', 'success');
        this.versiones = this.versiones.filter(v => v.id !== this.versionSelId);
      },
      error: (err) => {
        console.error('Error eliminando versión:', err);
        this._toastService.show('No se pudo eliminar la versión', 'error');
      }
    });
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
    this.tituloModalDetail = 'Asociar prueba al proyecto';
    this.modal = 'prueba';
    this.proyectoSelId.set(proyectoId);

    // cargar pruebas y versiones si no las tienes ya
    this.loadingPruebas.set(true);
    // this.loadingVersiones.set(true);

    this._pruebaService. getPruebas().subscribe(pruebas => {
      this.listadoPruebas.set(pruebas);
      this.loadingPruebas.set(false);
    });

    // Ya tenemos las versiones cargadas
    this.listadoVersiones.set(this.versiones);
    document.getElementById('btnAbrirModalProyecto')?.click();

  }

  asociarPrueba(event: { versionId: string; testCaseId: string }) {
    const { versionId, testCaseId } = event;

    this._versionService.linkPruebaToVersion(versionId, testCaseId).subscribe({
      next: () => {
        this._toastService.show('Prueba asociada correctamente', 'success');

        // Obtener prueba seleccionada
        const prueba = this.listadoPruebas().find(p => p.id === testCaseId);
        const version = this.listadoVersiones().find(v => v.id === versionId);

        if (prueba && version) {
          // Añadir nueva relación prueba–versión
          this.pruebas = [
            ...this.pruebas,
            {
              ...prueba,
              version_id: version.id,
              version_number: version.version_number
            }
          ];
        }

      },
      error: (err) => {
        console.error('Error asociando prueba:', err);
        this._toastService.show('No se pudo asociar la prueba', 'error');
      }
    });
  }

  disociarPruebaDeVersion(versionId: string, testCaseId: string) {
    this._versionService.unlinkPruebaFromVersion(versionId.toString(), testCaseId).subscribe({
      next: () => {
        this._toastService.show('Prueba eliminada de la versión', 'success');

        // Actualizar listado local para prueba y version determinadas
        this.pruebas = this.pruebas.filter(
          p => !(p.id === testCaseId && p.version_id === versionId)
        );
      },
      error: (err) => {
        console.error('Error disociando prueba:', err);
        this._toastService.show('No se pudo eliminar la prueba', 'error');
      }
    });
  }

  

  listadoPruebasChange($e: any){
    console.log('Listado de pruebas ha cambiado:', this.pruebas);
    for (const p of this.pruebas) {
      //
    }
  }

  /************************ EJECUCIONES ********************************/

  abrirNuevaEjecucion() {
    this.modal = 'ejecucion';
    this.modo = 'nuevo';
    this.nuevaEjecucion = true;
    this.tituloModalDetail = 'Nueva ejecución';
  }

  editarEjecucion(versionId: string) {
    this.modal = 'ejecucion';
    this.modo = 'editar';
    this.ejecucionSelId = versionId;
    this.nuevaVersion = false;
    this.tituloModalDetail = 'Editar ejecución';
    document.getElementById('btnAbrirModalEjecucion')?.click();

  }

  eliminarEjecucion(versionId: string) {
    this.ejecucionSelId = versionId;
    // TODO: Modal para eliminar versión
    const ok = confirm('¿Estás seguro de eliminar esta ejecución?');
    if (!ok) return;
    this._ejecucionService.deleteEjecucion(this.ejecucionSelId!).subscribe({
      next: () => {
        this._toastService.show('Ejecución eliminada correctamente', 'success');
        this.ejecuciones = this.ejecuciones.filter(e => e.id !== this.ejecucionSelId);
      },
      error: (err) => {
        console.error('Error eliminando ejecución:', err);
        this._toastService.show('No se pudo eliminar la ejecución', 'error');
      }
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