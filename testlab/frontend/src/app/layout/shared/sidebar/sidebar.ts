import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service';
import { UsuarioService } from '../../../services/usuario-service';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
   usuarioNombre: string | null = null;


  constructor (public router: Router, private _authService: AuthService, private _usuarioService: UsuarioService) {

    this.usuarioNombre = this._authService.checklogin()
  }

  logout() {
    const confirmado = window.confirm('¿Seguro que quieres cerrar sesión?');
    if (confirmado) {
      this._authService.logout(); // El servicio de autenticación se encarga de cerrar sesión y de borrar el token
      // const id = localStorage.getItem('id');
      // if (id) {
      //   this._authService.logout(id).subscribe({
      //     next: (response) => {
      //       console.log("Respuesta:", response);
      //       // borra token y usuario
      //       localStorage.removeItem('token');
      //       localStorage.removeItem('id');
      //       localStorage.removeItem('nombre');
      //       this.router.navigate(['/login']); // redirige al login
          }
      };
}
