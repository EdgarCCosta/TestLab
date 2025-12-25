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
    if (localStorage.getItem('nombre') != undefined) {
      this.usuarioNombre = localStorage.getItem('nombre');
    }
  }

  logout() {
    const confirmado = window.confirm('¿Seguro que quieres cerrar sesión?');
    if (confirmado) {
      const email = localStorage.getItem('usuario');
      if (email) {
        this.authService.logout(email).subscribe({
          next: (response) => {
            console.log("Respuesta:", response);
            // borra token y usuario
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            localStorage.removeItem('nombre');
            this.router.navigate(['/login']); // redirige al login
          }
        });
      }
    }
  }

}
