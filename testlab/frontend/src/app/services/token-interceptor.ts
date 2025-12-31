import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';
import { ToastService } from '../layout/shared/toast/toast';
import { SpinnerService } from './spinner-service';
import { finalize } from 'rxjs/operators';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private spinner: SpinnerService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.auth.getToken();

    // Activar spinner
    this.spinner.show();



    // Añadir token si existe
    let cloned = req;
    if (token) {
      cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {

        // 401 → No autenticado (token inválido o caducado)
        // 403 → No autorizado
        if (error.status === 401 || error.status === 403) {
          this.toast.show('Sesión expirada o no autorizado', 'error');
          // this.auth.logout();
          this.router.navigate(['/login']);
        }

        // 419 → Sesión expirada (CSRF o Sanctum)
        if (error.status === 419) {
          this.toast.show('Sesión expirada. Vuelve a iniciar sesión.', 'error');
          // this.auth.logout();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      }),
      // Se ejecuta SIEMPRE: éxito o error
      finalize(() => {
        this.spinner.hide();
      })

    );
  }
}