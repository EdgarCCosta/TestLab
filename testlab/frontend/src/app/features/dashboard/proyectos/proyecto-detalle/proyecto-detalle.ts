import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProyectoService } from '../../../../services/proyecto';
import { UsuarioService } from '../../../../services/usuario';

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyecto-detalle.html',
  styleUrls: ['./proyecto-detalle.css']
})
export class ProyectoDetalle {
  proyectoId!: number;
  proyecto: any; // tipa con tu modelo ProyectoDto
  usuarioNombre: string | null = null;

  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService,
    private usuarioService: UsuarioService
  ) {
    this.route.paramMap.subscribe(params => {
      this.proyectoId = parseInt(params.get('id')!);
      this.getProyectoById(this.proyectoId);
    });
  }

  getProyectoById(id: number) {
    this.proyectoService.getProyectoById(id).subscribe({
      next: (p) => {
        this.proyecto = p;

        // 👇 con el usuario_id llamamos al UsuarioService
        if (this.proyecto?.usuario_id) {
          // this.usuarioService.getUsuarioById(this.proyecto.usuario_id.toString()).subscribe({
          this.usuarioService.getUsuarioById("1").subscribe({
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