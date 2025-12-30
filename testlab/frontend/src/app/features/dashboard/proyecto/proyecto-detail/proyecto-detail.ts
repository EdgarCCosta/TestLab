import { Component, input, signal, model, effect, untracked } from '@angular/core';
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

import { inject } from '@angular/core';



@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule, Modal, ProyectoNew],
  templateUrl: './proyecto-detail.html',
  styleUrls: ['./proyecto-detail.css']
})
export class ProyectoDetail {

  
  proyectoId = signal<string | null>(null);
  proyecto = signal<Proyecto | null>(null);
  userRol: Usuario["rol"] | null = null;

  usuarios: Usuario[] = [];
  versiones: Version[] = [];
  pruebas: Prueba[] = [];
  ejecuciones: Ejecucion[] = [];

  mostrarTodosUsuarios = false;
  mostrarTodasVersiones = false;
  mostrarTodasPruebas = false;
  mostrarTodasEjecuciones = false;

  proyectoSelId = model<string | null>(null);
  modo = model<'nuevo' | 'editar'>('editar');
  
  private _proyectoService = inject(ProyectoService); // Se puede hacer inject en lugar de añadirlo al constructor

  proyectos = this._proyectoService.proyectos;        // Permite inicializar el signal

  actualizarProyectoEffect = effect(() => { // Actualiza nuestro elemento cada vez que se ha actualizado la lista de proyectos (signal global)
    const id = this.proyectoId();
    if (!id) return;

    const lista = this.proyectos();
    // p.id es number, id es string → comparamos como string
    const actualizado = lista.find(p => p.id.toString() === id);

    if (actualizado) {
      this.proyecto.set(actualizado);
    }
  });





  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _usuarioService: UsuarioService,
    private _versionService: VersionService,
    private _pruebaService: PruebaService,
    private _ejecucionService: EjecucionService,
    private _location: Location,
    private _toastService: ToastService
  ) {
    this.route.paramMap.subscribe(params => {
      this.proyectoId.set(String(params.get('id')));
      const id = this.proyectoId();
  
      if (localStorage.getItem('id') != null) {
        this.userRol = this._usuarioService.getUsuarioRolById(String(localStorage.getItem('id')));
      }
      this.getProyectoById(id!);
      this.getUsuariosByProyecto(id!);
      this.getPruebasByProyecto(id!);
      this.getVersionesByProyecto(id!);
      this.getEjecucionesByProyecto(id!);

      console.log("Proyectos:", this.proyectos());
    });
  }

  ngOnInit() {

    // Proyectos siempre disponibles
    this._proyectoService.getProyectos().subscribe(() => {
        console.log("Proyectos cargados en detalle:", this.proyectos());
    });

  }

  getProyectoById(id: string) {
    this._proyectoService.getProyectoById(id.toString()).subscribe({
      next: (proyecto) => {
        // this.proyecto.set(proyecto);
        console.log("Proyecto recibido:", proyecto);
      },
      error: (err) => console.error('Error cargando proyecto:', err)
    });
  }

  getUsuariosByProyecto(proyectoId: string) {
    // TODO: Falta estructura en backend para asociar usuarios a proyectos, de momento nos llegan todos desde el servicio
    this._proyectoService.getUsersFromProyectoById(proyectoId).subscribe({
      next: (lista) => {
        console.log("Usuarios recibidos:", lista);
        this.usuarios = lista;
      },
      error: (err) => console.error('Error cargando usuarios de proyecto:', err)
    });
  }

  getPruebasByProyecto(proyectoId: string) {
    // TODO: Falta estructura en backend para asociar pruebas a proyectos, de momento nos llegan todas desde el servicio
    this._proyectoService.getPruebasFromProyectoById(proyectoId).subscribe({
      next: (lista) => {
        console.log("Pruebas recibidas:", lista);
        this.pruebas = lista;
      },
      error: (err) => console.error('Error cargando pruebas de proyecto:', err)
    });
  }

  getVersionesByProyecto(proyectoId: string) {
    this._versionService.getVersiones().subscribe({
      next: (lista) => {
        console.log("Versiones:", lista);
        this.versiones = lista.filter((v: Version) => v.project_id.toString() === proyectoId);
        console.log("Versiones filtradas:", this.versiones);
      },
      error: (err) => console.error('Error cargando versiones:', err)
    });
  }

  getEjecucionesByProyecto(proyectoId: string) {
    this._ejecucionService.getEjecuciones().subscribe({
      next: (lista) => {
        console.log("Ejecuciones:", lista);
        this.ejecuciones = lista.filter((e: Ejecucion) => e.version.project_id.toString() === proyectoId);
      },
      error: (err) => console.error('Error cargando test-executions:', err)
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