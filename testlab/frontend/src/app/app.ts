import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UsuariosList],
  template: `
    <h1>TestLab</h1>
    <app-usuarios-list></app-usuarios-list>
  `,

  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('testlab');
}
