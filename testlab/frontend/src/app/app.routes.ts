// app.routes.ts
import { Routes } from '@angular/router';

import { AppLayout } from './layout/app-layout/app-layout';
import { Login } from './features/login/login';
import { UsuarioList } from './features/dashboard/usuario/usuario-list/usuario-list';
import { ProyectoList } from './features/dashboard/proyecto/proyecto-list/proyecto-list';
import { PruebaList } from './features/dashboard/prueba/prueba-list/prueba-list';
import { EjecucionList } from './features/dashboard/ejecucion/ejecucion-list/ejecucion-list';
import { VersionList } from './features/dashboard/version/version-list/version-list';
import { UsuarioDetail } from './features/dashboard/usuario/usuario-detail/usuario-detail';
import { ProyectoDetalle } from './features/dashboard/proyectos/proyecto-detalle/proyecto-detalle';


export const routes: Routes = [
  { 
    path: '', 
    component: AppLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'usuarios', component: UsuarioList },
      { path: 'usuario/:id', component: UsuarioDetail},
      { path: 'proyectos', component: ProyectoList },
      { path: 'proyecto/:id', component: ProyectoDetalle },
      { path: 'pruebas', component: PruebaList },
      { path: 'ejecuciones', component: EjecucionList },
      { path: 'versiones', component: VersionList },
    ]
  },
];