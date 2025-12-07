import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, LanguageSwitcher, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
   usuarioNombre: string | null = null;


  constructor (public router: Router) {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      this.usuarioNombre = usuario.nombre;

    }
  }
  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/loginuser']);
    //  this.router.navigate(['/login']); // redirige al login

  }

}
