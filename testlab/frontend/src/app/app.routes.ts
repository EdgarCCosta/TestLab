// app.routes.ts
import { Routes } from '@angular/router';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { ProyectosList } from './pages/proyectos/proyectos-list/proyectos-list';
import { PruebasList } from './pages/pruebas/pruebas-list/pruebas-list';
import { EjecucionesList } from './pages/ejecuciones/ejecuciones-list/ejecuciones-list';
import { VersionesList } from './pages/versiones/versiones-list/versiones-list';

export const routes: Routes = [
  { path: 'usuarios', component: UsuariosList },
  { path: 'proyectos', component: ProyectosList },
  { path: 'pruebas', component: PruebasList },
  { path: 'ejecuciones', component: EjecucionesList },
  { path: 'versiones', component: VersionesList },
  { path: '', redirectTo: '', pathMatch: 'full' }
];