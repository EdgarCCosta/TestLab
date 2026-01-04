import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Permitir siempre la ruta de login
  if (state.url.startsWith('/login')) {
    return true;
  }

  // Si no está logueado → fuera
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Si la ruta no define roles → permitir
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  if (!allowedRoles) {
    return true;
  }

  // Obtener rol del usuario desde el AuthService
  const userRole = auth.getRole(); // ej: "admin", "manager", "tester"

  // Si el rol está permitido → permitir
  if (allowedRoles.includes(userRole)) {
    return true;
  }

  // Si el rol no está permitido → redirige a la pantalla de "unauthorized"
  if (!allowedRoles.includes(userRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  // Si no tiene permiso → redirigir
  router.navigate(['/unauthorized']);
  return false;
};