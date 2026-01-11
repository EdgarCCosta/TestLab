import { Component, inject } from '@angular/core';
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
  usuarioGravatar: string | null = null;
  auth = inject(AuthService);
  // Acceso directo al rol reactivo
  role = this.auth.role;

  constructor (public router: Router, private _authService: AuthService, private _usuarioService: UsuarioService) {

    this.usuarioNombre = this._authService.checklogin();
    this.usuarioGravatar = localStorage.getItem('gravatar');
  }

  logout() {
    const confirmado = window.confirm('¿Seguro que quieres cerrar sesión?');
    if (confirmado) {
      this._authService.logout(); // El servicio de autenticación se encarga de cerrar sesión y de borrar el token
    }
  }
}
