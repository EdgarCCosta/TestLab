import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-footer-menu',
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './footer-menu.html',
  styleUrl: './footer-menu.css',
})
export class FooterMenu {
  usuarioNombre: string | null = null;
  usuarioGravatar: string | null = null;

  role = inject(AuthService).role;

  constructor (public router: Router, private _authService: AuthService) {
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
