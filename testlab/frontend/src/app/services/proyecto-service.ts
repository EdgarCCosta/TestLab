import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Proyecto, CreateProyectoDto, UpdateProyectoDto } from '../models/proyecto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/projects';

  constructor(private http: HttpClient) {}

  /** Obtener todos los proyectos */
  getProyectos(): Observable<Proyecto[]> {
    return this.http
      .get<{ success: boolean; message: string; data: Proyecto[] }>(
        this.apiUrl + this.endpoint
      )
      .pipe(map(response => response.data));
  }

  /** Obtener un proyecto por ID */
  getProyectoById(id: string): Observable<Proyecto> {
    return this.http
      .get<{ success: boolean; message: string; data: Proyecto }>(
        `${this.apiUrl + this.endpoint}/${id}`
      )
      .pipe(map(response => response.data));
  }

  /** Crear proyecto */
  createProyecto(dto: CreateProyectoDto): Observable<any> {
    return this.http.post(this.apiUrl + this.endpoint, dto);
  }

  /** Actualizar proyecto */
  updateProyecto(id: string, dto: UpdateProyectoDto): Observable<any> {
    return this.http.put(`${this.apiUrl + this.endpoint}/${id}`, dto);
  }

  /** Eliminar proyecto */
  deleteProyecto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl + this.endpoint}/${id}`);
  }
}