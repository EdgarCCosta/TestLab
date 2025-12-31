import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/login'; // coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    console.log('login', email, password);
    return this.http.post<any>(this.apiUrl + this.endpoint, { email, password });
  }

  logout(email: string) {
    return this.http.post<any>(this.apiUrl + '/logout', { email });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}