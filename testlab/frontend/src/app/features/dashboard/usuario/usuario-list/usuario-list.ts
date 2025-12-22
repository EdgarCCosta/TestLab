import { Component,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario-service';
import { UsuarioDetail } from '../usuario-detail/usuario-detail';
import { Modal } from '../../../../layout/shared/modal/modal';
import { Listado } from '../../../../layout/shared/listado/listado';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-list',
  imports: [CommonModule, UsuarioDetail, Modal, Listado, FormsModule],
  templateUrl: './usuario-list.html',
  standalone: true,
})
export class UsuarioList {

  public usuarios: any[] = [];
  public usuarioSelId: string | null = null;
  public usuariosFiltrados: Usuario[] = [];
  public nuevoUser: boolean = false;
  public _filtro: string = '';

  constructor(
    private _usuarioService: UsuarioService, private _router: Router
  ) {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this._usuarioService.getUsuarios().subscribe({
      next: (response) => {
        console.log('Response:', response);
        let data = response;
        for (let u of data) {
          this.usuarios.push(u);
          this.usuariosFiltrados.push(u)
        }
      },
    });

    // 👇 Enganchar evento de Bootstrap para resetear al cerrar modal
    const modalEl = document.getElementById('detalleModal');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.usuarioSelId = null; // reset automático
        this.nuevoUser = false;
      });
    }

  }

  seleccionarUsuario(id: string): void {
    this.usuarioSelId = id;
  }

  set filtro(valor: string) {
    this._filtro = valor;
    this.usuariosFiltrados = [];
    for (const u of this.usuarios) {
      if (
        u.name.toLowerCase().includes(valor.toLowerCase()) ||
        u.email.toLowerCase().includes(valor.toLowerCase()) ||
        u.rol.toLowerCase().includes(valor.toLowerCase())
      ) {
        this.usuariosFiltrados.push(u);
      }
    }
  }

  abrirNuevoUsuario() {
    this.usuarioSelId = null;   // no hay id
    this.nuevoUser = true;      // activar modo creación
  }


  listadoChange($e: any) {
    console.log('Listado ha cambiado:', this.usuarios);
    this.usuariosFiltrados = [];
    for (const u of this.usuarios) {
      if (this._filtro !== '') {
        console.log("El filtro es:", this._filtro);
        if (
          u.name.toLowerCase().includes(this._filtro.toLowerCase()) ||
          u.email.toLowerCase().includes(this._filtro.toLowerCase()) ||
          u.rol.toLowerCase().includes(this._filtro.toLowerCase())
        ) {
          this.usuariosFiltrados.push(u);
        }
      } else {
          this.usuariosFiltrados.push(u);
      }
    }
  }
}
