import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-unauthorized',
  imports: [RouterModule],
   template: `
    <div style="text-align:center; margin-top: 50px;">
      <h1>🚫 Acceso denegado</h1>
      <p>No tienes permisos para acceder a esta sección.</p>
      <a routerLink="dashboard">Volver al inicio</a>
    </div>
  `,
  styleUrl: './unauthorized.css',
})
export class Unauthorized {

}
