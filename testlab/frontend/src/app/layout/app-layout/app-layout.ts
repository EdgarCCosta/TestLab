import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';


import { Sidebar } from '../shared/sidebar/sidebar';
import { FooterMenu } from "../shared/footer-menu/footer-menu";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Sidebar, RouterOutlet, FooterMenu],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {

  constructor(private router: Router) {}

  esLogin(): boolean {
    // Comprueba si estamos en el Login para no mostrar el menú
    return this.router.url === '/login';
    console.log(this.router.url);
  }

}
