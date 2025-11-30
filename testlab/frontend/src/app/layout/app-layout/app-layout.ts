import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Sidebar } from '../shared/sidebar/sidebar';

@Component({
  selector: 'app-app-layout',
  imports: [Sidebar],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {

  constructor(private router: Router) {}

  esLogin(): boolean {
    // Comprueba si estamos en el Login para no mostrar el menú
    return this.router.url === '/login';
  }

}
