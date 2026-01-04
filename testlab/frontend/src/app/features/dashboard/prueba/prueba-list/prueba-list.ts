import { Component } from '@angular/core';
import { Prueba } from '../../../../models/prueba';
import { PruebaService } from '../../../../services/prueba-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Listado } from '../../../../layout/shared/listado/listado';
import { Modal } from '../../../../layout/shared/modal/modal';
import { PruebaDetail } from '../prueba-detail/prueba-detail';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../../../services/spinner-service';
import { LoadingComponent } from '../../../../layout/shared/loading/loading';
import { AuthService } from '../../../../services/auth-service';


@Component({
  selector: 'app-prueba-list',
  imports: [CommonModule, FormsModule, Listado, Modal, PruebaDetail, LoadingComponent],
  templateUrl: './prueba-list.html',
  standalone: true,
})
export class PruebaList {
  public items: any[] = [];
  public itemSelId: string | null = null;
  public itemsFiltrados: Prueba[] = [];
  public nuevoItem: boolean = false;
  public _filtro: string = '';
  public loading: boolean = true;
  public role = localStorage.getItem('rol');
  public puedeCrearProyecto: boolean = false;
  
  constructor(
    private _itemService: PruebaService, private _router: Router, public _spinnerService: SpinnerService,
    private _authService: AuthService
  ) {
    this.obtenerPruebas();
    this.puedeCrearProyecto = this._authService.hasPermission('crear_proyecto');
  }

  obtenerPruebas(): void {
    this._itemService.getPruebas().subscribe({
      next: (response) => {
        console.log('Response:', response);
        // let data = response;
        // for (let i of data) {
        //   this.items.push(i);
        //   this.itemsFiltrados.push(i);
        // }
      this.items = response.map(i => {
            return {
              ...i,
              Título: i.title,
              Objetivo: i.objective,
              'Resultado esperado': i.expected_result
            };
          });
      this.itemsFiltrados = this.items;
      this.loading = false;

      },
      
    });

    // Enganchar evento de Bootstrap para resetear al cerrar modal
    const modalEl = document.getElementById('detalleModal');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.itemSelId = null; // reset automático
        this.nuevoItem = false;
      });
    }

  }

  seleccionarPrueba(id: string): void {
    this.loading = false;
    this.itemSelId = id;
  }

  set filtro(valor: string) {
    this._filtro = valor;
    this.itemsFiltrados = [];
    for (const i of this.items) {
      if (
        i.title.toLowerCase().includes(valor.toLowerCase()) ||
        i.objective.toLowerCase().includes(valor.toLowerCase()) ||
        i.expected_result.toLowerCase().includes(valor.toLowerCase())
      ) {
        this.itemsFiltrados.push(i);
      }
    }
  }

  abrirNuevoItem() {
    this.itemSelId = null;   // no hay id
    this.nuevoItem = true;      // activar modo creación
  }


  listadoChange($e: any) {
    console.log('Listado ha cambiado:', this.items);
    this.itemsFiltrados = [];
    for (const i of this.items) {
      if (this._filtro !== '') {
        console.log("El filtro es:", this._filtro);
        if (
          i.name.toLowerCase().includes(this._filtro.toLowerCase()) ||
          i.email.toLowerCase().includes(this._filtro.toLowerCase()) ||
          i.rol.toLowerCase().includes(this._filtro.toLowerCase())
        ) {
          this.itemsFiltrados.push(i);
        }
      } else {
          this.itemsFiltrados.push(i);
      }
    }
  }
}