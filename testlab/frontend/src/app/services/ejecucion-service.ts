import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ejecucion, CreateEjecucionDto, UpdateEjecucionDto } from '../models/ejecucion';

@Injectable({
  providedIn: 'root',
})
export class EjecucionService {
  private readonly baseUrl = '/api/ejecucion'; // 👈 coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  getEjecuciones(): Observable<Ejecucion[]> {
    return this.http.get<Ejecucion[]>(this.baseUrl);
  }

  getEjecucionById(id: number): Observable<Ejecucion> {
    return this.http.get<Ejecucion>(`${this.baseUrl}/${id}`);
  }

  createEjecucion(dto: CreateEjecucionDto): Observable<Ejecucion> {
    return this.http.post<Ejecucion>(this.baseUrl, dto);
  }

  updateEjecucion(id: number, dto: UpdateEjecucionDto): Observable<Ejecucion> {
    return this.http.put<Ejecucion>(`${this.baseUrl}/${id}`, dto);
  }

  deleteEjecucion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}