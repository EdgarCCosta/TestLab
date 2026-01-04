import { Component } from '@angular/core';
import { Prueba } from '../../../../models/prueba';
import { PruebaService } from '../../../../services/prueba-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Listado } from '../../../../layout/shared/listado/listado';
import { ModalDetail } from '../../../../layout/shared/modal/modal-detail/modal-detail';
import { PruebaDetail } from '../prueba-detail/prueba-detail';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../../../services/spinner-service';
import { LoadingComponent } from '../../../../layout/shared/loading/loading';
import { AuthService } from '../../../../services/auth-service';


@Component({
  selector: 'app-prueba-list',
  imports: [CommonModule, FormsModule, Listado, PruebaDetail, LoadingComponent, ModalDetail],
  templateUrl: './prueba-list.html',
  standalone: true,
})
export class PruebaList {
  public pruebas: any[] = [];
  public pruebaSelId: string | null = null;
  public pruebasFiltradas: Prueba[] = [];
  public nuevaPrueba: boolean = false;
  public _filtro: string = '';
  public loading: boolean = true;
  public role = localStorage.getItem('rol');
  public puedeCrearProyecto: boolean = false;
  
  constructor(
    private _pruebaservice: PruebaService, private _router: Router, public _spinnerService: SpinnerService
  ) {
    this.obtenerPruebas();
    // this.puedeCrearProyecto = this._authService.hasPermission('crear_proyecto');
  }

  obtenerPruebas(): void {
    this._pruebaservice.getPruebas().subscribe({
      next: (response) => {
        console.log('Response:', response);
        // let data = response;
        // for (let i of data) {
        //   this.pruebas.push(i);
        //   this.pruebasFiltradas.push(i);
        // }
      this.pruebas = response.map(i => {
            return {
              ...i,
              Título: i.title,
              Objetivo: i.objective,
              'Resultado esperado': i.expected_result
            };
          });
      this.pruebasFiltradas = this.pruebas;
      this.loading = false;

      },
      
    });

    // Enganchar evento de Bootstrap para resetear al cerrar modal
    const modalEl = document.getElementById('detalleModal');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.pruebaSelId = null; // reset automático
        this.nuevaPrueba = false;
      });
    }

  }

  seleccionarPrueba(id: string): void {
    this.loading = false;
    this.pruebaSelId = id;
  }

  set filtro(valor: string) {
    this._filtro = valor;
    this.pruebasFiltradas = [];
    for (const i of this.pruebas) {
      if (
        i.title.toLowerCase().includes(valor.toLowerCase()) ||
        i.objective.toLowerCase().includes(valor.toLowerCase()) ||
        i.expected_result.toLowerCase().includes(valor.toLowerCase())
      ) {
        this.pruebasFiltradas.push(i);
      }
    }
  }

  abrirNuevaPrueba() {
    this.pruebaSelId = null;   // no hay id
    this.nuevaPrueba = true;      // activar modo creación
  }


  listadoChange($e: any) {
    console.log('Listado ha cambiado:', this.pruebas);
    this.pruebasFiltradas = [];
    for (const i of this.pruebas) {
      if (this._filtro !== '') {
        console.log("El filtro es:", this._filtro);
        if (
          i.name.toLowerCase().includes(this._filtro.toLowerCase()) ||
          i.email.toLowerCase().includes(this._filtro.toLowerCase()) ||
          i.rol.toLowerCase().includes(this._filtro.toLowerCase())
        ) {
          this.pruebasFiltradas.push(i);
        }
      } else {
          this.pruebasFiltradas.push(i);
      }
    }
  }
}