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
import { ProyectoDetail } from './features/dashboard/proyecto/proyecto-detail/proyecto-detail';


export const routes: Routes = [
  { 
    path: '', 
    component: AppLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'usuario', component: UsuarioList },
      { path: 'usuario/:id', component: UsuarioDetail},
      { path: 'proyecto', component: ProyectoList },
      { path: 'proyecto/:id', component: ProyectoDetail },
      { path: 'prueba', component: PruebaList },
      { path: 'ejecucion', component: EjecucionList },
      { path: 'version', component: VersionList },
    ]
  },
];