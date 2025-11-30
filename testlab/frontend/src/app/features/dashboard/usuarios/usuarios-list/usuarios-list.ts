import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-usuarios-list',
  imports: [CommonModule],
  templateUrl: './usuarios-list.html',
  
})
export class UsuariosList implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });




  }

    ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (lista) => this.usuarios = lista
    });
  }
}
