import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '../models/usuario';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/users'; // 👈 coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  /** Obtener todos los usuarios */
  getUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<{ success: boolean; message: string; data: Usuario[] }>(this.apiUrl + this.endpoint)
      .pipe(map(response => response.data));
  }

  getUsuarioById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl + this.endpoint}/${id}`);
  }

  createUsuario(dto: CreateUsuarioDto): Observable<any> {
    console.log('DTO Usuario: ', dto);
    return this.http.post(this.apiUrl + this.endpoint, dto);
  }

  updateUsuario(id: string, dto: UpdateUsuarioDto): Observable<any> {
    return this.http.put(`${this.apiUrl + this.endpoint}/${id}`, dto);
  }

  deleteUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl + this.endpoint}/${id}`);
  }
}