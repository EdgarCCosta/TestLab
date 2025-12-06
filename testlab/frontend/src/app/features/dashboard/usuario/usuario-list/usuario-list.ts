import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usuario-list',
  imports: [CommonModule],
  templateUrl: './usuario-list.html',
  
})
export class UsuarioList implements OnInit {

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
