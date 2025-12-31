import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProyectoService } from '../../../../services/proyecto-service';
import { UsuarioService } from '../../../../services/usuario-service';
import { PruebaService } from '../../../../services/prueba-service';
import { VersionService } from '../../../../services/version-service';
import { Prueba } from '../../../../models/prueba';
import { Version } from '../../../../models/version';
import { Proyecto } from '../../../../models/proyecto';




@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyecto-detail.html',
  styleUrls: ['./proyecto-detail.css']
})
export class ProyectoDetail {
  proyectoId!: number;
  proyecto: Proyecto | null = null;
  usuarioNombre: string | null = null;


  pruebas: Prueba[] = [];    
  versiones: Version[] = [];  

  estadoProyecto = '';

  mostrarTodasVersiones = false;
  mostrarTodasPruebas = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _proyectoService: ProyectoService,
    private _usuarioService: UsuarioService,
    private _pruebaService: PruebaService,
    private _versionService: VersionService
  ) {
    this.route.paramMap.subscribe(params => {
      this.proyectoId = Number(params.get('id'));
      this.getProyectoById(this.proyectoId);
      this.getPruebasByProyecto(this.proyectoId);
      this.getVersionesByProyecto(this.proyectoId);
    });
  }

  getProyectoById(id: number) {
    let idStr = id.toString();
    this._proyectoService.getProyectoById(idStr).subscribe({
      next: (response) => {
        this.proyecto = response;
        console.log("Proyecto recibido:", this.proyecto);
        // if (this.proyecto?.usuario_id) {
        //   this._usuarioService.getUsuarioById(this.proyecto.usuario_id).subscribe({
        //     next: (usuario) => this.usuarioNombre = usuario?.name,
        //     error: (err) => console.error('Error cargando usuario:', err)
        //   });
        // }
              // 👇 recalcular solo si ya tenemos proyecto y pruebas
      if (this.proyecto && this.pruebas.length > 0) {
        this.estadoProyecto = this.calcularEstado(this.proyecto, this.pruebas);
      }

      },
      error: (err) => console.error('Error cargando proyecto:', err)
    });
  }

  getPruebasByProyecto(proyectoId: number) {
    this._pruebaService.getPruebas().subscribe({
      next: (response) => {
        // this.pruebas = response.data.filter(pr => pr.proyecto_id === proyectoId);
        if (this.proyecto) {
          this.estadoProyecto = this.calcularEstado(this.proyecto, this.pruebas);
        }

      },
      error: (err) => console.error('Error cargando pruebas:', err)
    });
  }

  getVersionesByProyecto(proyectoId: number) {
    this._versionService.getVersiones().subscribe({
      next: (response) => {
        let lista = response.data;
        // this.versiones = lista.filter(v => v.proyecto_id === proyectoId);
      },
      error: (err) => console.error('Error cargando versiones:', err)
    });
  }

  calcularEstado(proyecto: Proyecto, pruebas: Prueba[]): string {
    const hoy = new Date();
    const entrega = new Date();

    console.log(hoy)
    console.log(entrega)
    console.log(entrega < hoy);

    // 1. Si la fecha de entrega ya pasó → error
    if (entrega < hoy) return 'error';

    // 2. Calcular días restantes
    const diff = entrega.getTime() - hoy.getTime();
    const dias = diff / (1000 * 60 * 60 * 24);

    // 3. Validar número mínimo de pruebas
    if (!pruebas || pruebas.length < 3) {
      return 'pendiente'; // o incluso 'error' si quieres ser más estricto
    }

    // 4. Estado según proximidad de entrega
    if (dias <= 7) return 'pendiente';

    return 'ok';
  }


  editarProyecto() {
    this.router.navigate(['/proyectos', this.proyectoId, 'editar']);
  }

  eliminarProyecto() {
    this._proyectoService.deleteProyecto(this.proyectoId.toString()).subscribe({
      next: () => this.router.navigate(['/proyectos']),
      error: (err) => console.error('Error eliminando proyecto:', err)
    });
  }
}