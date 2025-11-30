// app.routes.ts
import { Routes } from '@angular/router';

import { AppLayout } from './layout/app-layout/app-layout';
import { Login } from './features/login/login';
import { UsuariosList } from './features/dashboard/usuarios/usuarios-list/usuarios-list';
import { ProyectosList } from './features/dashboard/proyectos/proyectos-list/proyectos-list';
import { PruebasList } from './features/dashboard/pruebas/pruebas-list/pruebas-list';
import { EjecucionesList } from './features/dashboard/ejecuciones/ejecuciones-list/ejecuciones-list';
import { VersionesList } from './features/dashboard/versiones/versiones-list/versiones-list';

export const routes: Routes = [
  { 
    path: '', 
    component: AppLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'usuarios', component: UsuariosList },
      { path: 'proyectos', component: ProyectosList },
      { path: 'pruebas', component: PruebasList },
      { path: 'ejecuciones', component: EjecucionesList },
      { path: 'versiones', component: VersionesList },
    ]
  },
];