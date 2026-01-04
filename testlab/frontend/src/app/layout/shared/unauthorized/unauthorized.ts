import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  imports: [],
   template: `
    <div style="text-align:center; margin-top: 50px;">
      <h1>🚫 Acceso denegado</h1>
      <p>No tienes permisos para acceder a esta sección.</p>
      <a routerLink="/">Volver al inicio</a>
    </div>
  `,
  styleUrl: './unauthorized.css',
})
export class Unauthorized {

}
