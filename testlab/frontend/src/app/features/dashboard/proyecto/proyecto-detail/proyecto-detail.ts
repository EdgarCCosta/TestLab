import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

import { ProyectoService } from '../../../../services/proyecto-service';
import { VersionService } from '../../../../services/version-service';
import { EjecucionService } from '../../../../services/ejecucion-service';

import { Proyecto } from '../../../../models/proyecto';
import { Version } from '../../../../models/version';
import { Ejecucion } from '../../../../models/ejecucion';
import { ToastService } from '../../../../layout/shared/toast/toast';


@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyecto-detail.html',
  styleUrls: ['./proyecto-detail.css']
})
export class ProyectoDetail {

  proyectoId!: number;
  proyecto: Proyecto | null = null;

  versiones: Version[] = [];
  ejecuciones: Ejecucion[] = [];

  mostrarTodasVersiones = false;
  mostrarTodasEjecuciones = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _proyectoService: ProyectoService,
    private _versionService: VersionService,
    private _ejecucionService: EjecucionService,
    private _location: Location,
    private _toastService: ToastService
  ) {
    this.route.paramMap.subscribe(params => {
      this.proyectoId = Number(params.get('id'));
      this.getProyectoById(this.proyectoId);
      this.getVersionesByProyecto(this.proyectoId);
      this.getEjecucionesByProyecto(this.proyectoId);
    });
  }

  getProyectoById(id: number) {
    this._proyectoService.getProyectoById(id.toString()).subscribe({
      next: (proyecto) => {
        this.proyecto = proyecto;
        console.log("Proyecto recibido:", proyecto);
      },
      error: (err) => console.error('Error cargando proyecto:', err)
    });
  }

  getVersionesByProyecto(proyectoId: number) {
    this._versionService.getVersiones().subscribe({
      next: (lista) => {
        this.versiones = lista.data.filter((v: Version) => v.project_id === proyectoId);
        console.log("Versiones filtradas:", this.versiones);
      },
      error: (err) => console.error('Error cargando versiones:', err)
    });
  }

  getEjecucionesByProyecto(proyectoId: number) {
    this._ejecucionService.getEjecuciones().subscribe({
      next: (lista) => {
        this.ejecuciones = lista.data.filter((exec: Ejecucion) => exec.version.project_id === proyectoId);
        console.log("Ejecuciones filtradas:", this.ejecuciones);
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

  atras() {
    this._location.back();
  }
}