import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usuarios-list',
  imports: [CommonModule],
  templateUrl: './usuarios-list.html',
  
})
export class UsuariosList implements OnInit {

  usuarios: Usuario[] = [];

  constructor(
    private _usuarioService: UsuarioService, private _router: Router
  ) {}

  ngOnInit(): void {
    this._usuarioService.getUsuarios().subscribe({
      next: (lista) => this.usuarios = lista
    });
  }

  detalleUsuario(id: any): void {
    this._router.navigate(['usuario', id],);
  }
}
