import { Component, OnInit } from '@angular/core';
import { Proyecto } from '../../../../models/proyecto';
import { ProyectoService } from '../../../../services/proyecto-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { Modal } from '../../../../layout/shared/modal/modal';
import { Listado } from '../../../../layout/shared/listado/listado';
import { signal, effect } from '@angular/core';




@Component({
  selector: 'app-proyecto-list',
  imports: [CommonModule, Listado],
  templateUrl: './proyecto-list.html',
  styleUrl: './proyecto-list.css',
})
export class ProyectoList implements OnInit {

 proyectoSelId = signal<string | null>(null);

  proyectos: Proyecto[] = [];

  constructor(private _proyectoService: ProyectoService, private router: Router) {
       // efecto: cada vez que cambia proyectoSelId, navega
    effect(() => {
      const id = this.proyectoSelId();
      if (id) {
        this.detalleProyecto(id);
      }
    });

  }

ngOnInit(): void {
  this._proyectoService.getProyectos().subscribe({
    next: (response) => {
      let lista = response.data;
      // this.proyectos = lista.map(p => {
      //   // usa la fecha_entrega del modelo Proyecto pero habrá que hablar qué criterios seguimos
      //   const vencida = new Date(p.fecha_entrega) > new Date();
      //   return {
      //     ...p,
      //     Proyecto: p.nombre,
      //     Descripción: p.descripcion,
      //     Estado: vencida
      //   };
      // });
      console.log("Tenemos los proyectos: ", this.proyectos);
    }
  });
}

  detalleProyecto(id: string) {
    this.router.navigate(['/proyecto', id]);
  }
}
