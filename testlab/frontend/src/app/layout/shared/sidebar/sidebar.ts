import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
   usuarioNombre: string | null = null;


  constructor (public router: Router, public authService: AuthService) {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      this.usuarioNombre = usuario.nombre;

    }
  }

  logout(event: Event) {
    event.preventDefault();
    const confirmado = window.confirm('¿Seguro que quieres cerrar sesión?');
    if (confirmado) {
      this.authService.logout();              // borra token y usuario
      this.router.navigate(['/login']); // redirige al login
    }

  }

}
