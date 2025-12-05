import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly baseUrl = '/usuario'; // 👈 coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  createUsuario(dto: CreateUsuarioDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, dto);
  }

  updateUsuario(id: number, dto: UpdateUsuarioDto): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, dto);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
