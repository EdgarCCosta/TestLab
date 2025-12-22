import { Component, OnInit, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../../../models/proyecto';
import { ProyectoService } from '../../../../services/proyecto-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Listado } from '../../../../layout/shared/listado/listado';
import { Modal } from '../../../../layout/shared/modal/modal';
import { ProyectoNew } from '../proyecto-new/proyecto-new';
@Component({
  selector: 'app-proyecto-list',
  imports: [CommonModule, FormsModule, Listado, Modal, ProyectoNew],
  templateUrl: './proyecto-list.html',
  styleUrl: './proyecto-list.css',
})
export class ProyectoList implements OnInit {

  public proyectos: any[] = [];
  public proyectoSelId: string | null = null;
  public proyectosFiltrados: Proyecto[] = [];
  public nuevoProject: boolean = false;
  public _filtro: string = '';

  constructor(
    private _proyectoService: ProyectoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._proyectoService.getProyectos().subscribe({
      next: (lista) => {
        // lista es directamente Proyecto[] gracias al map() del servicio
        this.proyectos = lista.map(p => { // Mapeamos con los atributos a enviar al componente de listar
          return {
            ...p,
            Proyecto: p.name,
            Descripción: p.description,   // backend usa "description"
            Estado: p.status
          };
        });

        console.log("Tenemos los proyectos: ", this.proyectos);
      }
    });
  }

  set filtro(valor: string) {
    this._filtro = valor;
    this.proyectosFiltrados = [];
    for (const u of this.proyectos) {
      if (
        u.name.toLowerCase().includes(valor.toLowerCase()) ||
        u.email.toLowerCase().includes(valor.toLowerCase()) ||
        u.rol.toLowerCase().includes(valor.toLowerCase())
      ) {
        this.proyectosFiltrados.push(u);
      }
    }
  }

  abrirNuevoProyecto() {
    this.proyectoSelId = null;   // no hay id
    this.nuevoProject = true;      // activar modo creación
  }

  detalleProyecto(id: string) {
    this.router.navigate(['/proyecto', id]);
  }

   listadoChange($e: any) {
    console.log('Listado ha cambiado:', this.proyectos);
    this.proyectosFiltrados = [];
    for (const p of this.proyectos) {
      if (this._filtro !== '') {
        console.log("El filtro es:", this._filtro);
        if (
          p.name.toLowerCase().includes(this._filtro.toLowerCase()) ||
          p.description.toLowerCase().includes(this._filtro.toLowerCase()) ||
          p.status.toLowerCase().includes(this._filtro.toLowerCase())
        ) {
          this.proyectosFiltrados.push(p);
        }
      } else {
          this.proyectosFiltrados.push(p);
      }
    }
  }
}