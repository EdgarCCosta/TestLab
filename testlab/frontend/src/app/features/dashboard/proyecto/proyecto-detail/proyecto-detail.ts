import { Component } from '@angular/core';
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

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyecto-detail.html',
  styleUrls: ['./proyecto-detail.css']
})
export class ProyectoDetail {

  
  proyectoId!: string;
  proyecto: Proyecto | null = null;
  userRol: Usuario["rol"] | null = null;

  usuarios: Usuario[] = [];
  versiones: Version[] = [];
  pruebas: Prueba[] = [];
  ejecuciones: Ejecucion[] = [];

  mostrarTodosUsuarios = false;
  mostrarTodasVersiones = false;
  mostrarTodasPruebas = false;
  mostrarTodasEjecuciones = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _proyectoService: ProyectoService,
    private _usuarioService: UsuarioService,
    private _versionService: VersionService,
    private _pruebaService: PruebaService,
    private _ejecucionService: EjecucionService,
    private _location: Location,
    private _toastService: ToastService
  ) {
    this.route.paramMap.subscribe(params => {
      this.proyectoId = String(params.get('id'));
      if (localStorage.getItem('id') != null) {
        this.userRol = this._usuarioService.getUsuarioRolById(String(localStorage.getItem('id')));
      }
      this.getProyectoById(this.proyectoId);
      this.getUsuariosByProyecto(this.proyectoId);
      this.getPruebasByProyecto(this.proyectoId);
      this.getVersionesByProyecto(this.proyectoId);
      this.getEjecucionesByProyecto(this.proyectoId);
    });
  }

  getProyectoById(id: string) {
    this._proyectoService.getProyectoById(id.toString()).subscribe({
      next: (proyecto) => {
        this.proyecto = proyecto;
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

  editarProyecto() {
    this.router.navigate(['/proyectos', this.proyectoId, 'editar']);
  }

  eliminarProyecto() {
    this._proyectoService.deleteProyecto(this.proyectoId.toString()).subscribe({
      next: () => {
        this._toastService.show('Proyecto eliminado correctamente', 'success');
        this.router.navigate(['/proyectos']);
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
    this._proyectoService.unlinkUsuarioFromProyecto(this.proyectoId, idUsuario).subscribe({
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
    this._proyectoService.unlinkPruebaFromProyecto(this.proyectoId, idPrueba).subscribe({
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