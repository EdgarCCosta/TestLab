import { Component, OnInit } from '@angular/core';
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
export class UsuarioList implements OnInit {

  usuarios: Usuario[] = [];
  usuarioSelId: string = '';
  usuariosFiltrados: Usuario[] = [];

  constructor(
    private _usuarioService: UsuarioService, private _router: Router
  ) {
    this.filtro = '';
  }

  ngOnInit(): void {
    this._usuarioService.getUsuarios().subscribe({
      next: (lista) => {
        this.usuarios = lista;
        this.usuariosFiltrados = lista;
      },
    });
  }

  seleccionarUsuario(id: string): void {
    this.usuarioSelId = id;
  }

  set filtro(valor: string) {
    console.log("Filtro cambiado: ", valor);
    console.log('Usuarios filtrados previo el cambio: ', this.usuariosFiltrados);
    this.usuariosFiltrados = [];

    for (const u of this.usuarios) {
      if (u.nombre.includes(valor) || u.email.includes(valor)|| u.rol.includes(valor)) {
        this.usuariosFiltrados.push(u);
      }
    }

    console.log('Usuarios filtrados tras el cambio: ', this.usuariosFiltrados);
  }
}
