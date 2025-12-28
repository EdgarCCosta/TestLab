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
      this._router.navigate(['/login']); // redirige al login
    }

    return ''
  }

  logout(id: string) {
    return this.http.post<any>(this.apiUrl + '/logout', { id });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}