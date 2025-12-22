import { Component, OnInit, signal, effect } from '@angular/core';
import { Proyecto } from '../../../../models/proyecto';
import { ProyectoService } from '../../../../services/proyecto-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Listado } from '../../../../layout/shared/listado/listado';

@Component({
  selector: 'app-proyecto-list',
  imports: [CommonModule, Listado],
  templateUrl: './proyecto-list.html',
  styleUrl: './proyecto-list.css',
})
export class ProyectoList implements OnInit {

  proyectoSelId = signal<string | null>(null);
  proyectos: Proyecto[] = [];

  constructor(
    private _proyectoService: ProyectoService,
    private router: Router
  ) {
    // Cada vez que cambia proyectoSelId → navegar al detalle
    effect(() => {
      const id = this.proyectoSelId();
      if (id) {
        this.detalleProyecto(id);
      }
    });
  }

  ngOnInit(): void {
    this._proyectoService.getProyectos().subscribe({
      next: (lista) => {
        // lista es directamente Proyecto[] gracias al map() del servicio
        this.proyectos = lista.map(p => {
          return {
            ...p,
            // Adaptación para tu componente Listado:
            Proyecto: p.name,
            Descripción: p.description,   // backend usa "description"
            Estado: p.status // ejemplo: true si está activo
          };
        });

        console.log("Tenemos los proyectos: ", this.proyectos);
      }
    });
  }

  detalleProyecto(id: string) {
    this.router.navigate(['/proyecto', id]);
  }
}