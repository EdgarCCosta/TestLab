import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/login'; // coincide con proxy.conf.json

  constructor(private http: HttpClient, private _router: Router) {}

  login(email: string, password: string): Observable<any> {
    console.log('login', email, password);
    return this.http.post<any>(this.apiUrl + this.endpoint, { email, password });
  }

  checklogin(): string {
    if (localStorage.getItem('token') != undefined && localStorage.getItem('nombre') != undefined) {
      return String(localStorage.getItem('nombre'));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('nombre');
      localStorage.removeItem('rol');
      this._router.navigate(['/login']); // redirige al login
    }

    return ''
  }

 /* Logout */
  logout(): void {
    const id = localStorage.getItem('id');

    // 1. Intentar cerrar sesión en backend (si hay id)
    if (id) {
      this.http.post<any>(this.apiUrl + '/logout', { id }).subscribe({
        next: () => console.log('Logout backend OK'),
        error: () => console.warn('Logout backend falló (token caducado o inválido)')
      });
    }

    // 2. Limpiar sesión
    this.clearSession();

    // 3. Redirigir
    this._router.navigate(['/login']);
  }

  /* Limpiar localStorage */
  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('nombre');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string {
    return localStorage.getItem('rol') ?? 'tester';
  }

  hasPermission(permiso: string): boolean {
    const rol = this.getRole();

    const permisosPorRol: Record<string, string[]> = {
      admin: ['crear_cliente', 'crear_proyecto', 'editar_proyecto', 'borrar_proyecto'],
      manager: ['crear_proyecto', 'editar_proyecto'],
      tester: []
    };

    return permisosPorRol[rol]?.includes(permiso) ?? false;
  }

}