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


  if (auth.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};