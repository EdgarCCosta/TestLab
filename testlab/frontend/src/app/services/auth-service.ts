import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/login'; // coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    console.log('login', email, password);
    return this.http.post<any>(this.apiUrl + this.endpoint, { email, password }).pipe(
      tap(response => {
        console.log(response);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.user.email));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}