import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProyectoService } from '../../../../services/proyecto-service';
import { UsuarioService } from '../../../../services/usuario-service';

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyecto-detail.html',
  styleUrls: ['./proyecto-detail.css']
})
export class ProyectoDetail {
  proyectoId!: string;
  proyecto: any; // tipa con tu modelo ProyectoDto
  usuarioNombre: string | null = null;

  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService,
    private usuarioService: UsuarioService
  ) {
    this.route.paramMap.subscribe(params => {
      this.proyectoId = params.get('id')!;
      this.getProyectoById(this.proyectoId);
    });
  }

  getProyectoById(id: string) {
    this.proyectoService.getProyectoById(id).subscribe({
      next: (p) => {
        this.proyecto = p;

        // 👇 con el usuario_id llamamos al UsuarioService
        if (this.proyecto?.usuario_id) {
          // this.usuarioService.getUsuarioById(this.proyecto.usuario_id.toString()).subscribe({
          this.usuarioService.getUsuarioById(id).subscribe({
            next: (usuario) => this.usuarioNombre = usuario.nombre,
            error: (err) => console.error('Error cargando usuario:', err)
          });
        }
      },
      error: (err) => console.error('Error cargando proyecto:', err)
    });
  }

  editarProyecto() {
    this.router.navigate(['/proyectos', this.proyectoId, 'editar']);
  }

  eliminarProyecto() {
    this.proyectoService.deleteProyecto(this.proyectoId).subscribe({
      next: () => this.router.navigate(['/proyectos']),
      error: (err) => console.error('Error eliminando proyecto:', err)
    });
  }
}