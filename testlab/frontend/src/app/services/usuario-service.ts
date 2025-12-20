import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '../models/usuario';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly baseUrl = '/api/users';

  constructor(private http: HttpClient) {}

  /** Obtener todos los usuarios */
  getUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<{ success: boolean; message: string; data: Usuario[] }>(this.baseUrl)
      .pipe(map(response => response.data));
  }

  /** Obtener un usuario por ID */
  getUsuarioById(id: string): Observable<Usuario> {
    return this.http
      .get<{ success: boolean; message: string; data: Usuario }>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  /** Crear un usuario */
  createUsuario(dto: CreateUsuarioDto): Observable<Usuario> {
    return this.http
      .post<{ success: boolean; message: string; data: Usuario }>(this.baseUrl, dto)
      .pipe(map(response => response.data));
  }

  /** Actualizar un usuario */
  updateUsuario(id: string, dto: UpdateUsuarioDto): Observable<Usuario> {
    return this.http
      .put<{ success: boolean; message: string; data: Usuario }>(`${this.baseUrl}/${id}`, dto)
      .pipe(map(response => response.data));
  }

  /** Eliminar un usuario */
  deleteUsuario(id: string): Observable<void> {
    return this.http
      .delete<{ success: boolean; message: string; data: null }>(`${this.baseUrl}/${id}`)
      .pipe(map(() => void 0));
  }
}