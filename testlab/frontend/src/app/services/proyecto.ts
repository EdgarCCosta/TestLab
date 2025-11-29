import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto, CreateProyectoDto, UpdateProyectoDto } from '../models/proyecto';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  private readonly baseUrl = '/proyecto'; // 👈 coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.baseUrl);
  }

  getProyectoById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.baseUrl}/${id}`);
  }

  createProyecto(dto: CreateProyectoDto): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.baseUrl, dto);
  }

  updateProyecto(id: number, dto: UpdateProyectoDto): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.baseUrl}/${id}`, dto);
  }

  deleteProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}