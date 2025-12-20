import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '../models/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;
  private readonly endpoint = '/users'; // 👈 coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any> {
    return this.http.get(this.apiUrl + this.endpoint);
  }

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.endpoint}/${id}`);
  }

  createUsuario(dto: CreateUsuarioDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.endpoint, dto);
  }

  updateUsuario(id: string, dto: UpdateUsuarioDto): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.endpoint}/${id}`, dto);
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
