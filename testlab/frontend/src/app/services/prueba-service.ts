import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prueba, CreatePruebaDto, UpdatePruebaDto } from '../models/prueba';

@Injectable({
  providedIn: 'root',
})
export class PruebaService {
  private readonly baseUrl = '/api/prueba'; // 👈 coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  getPruebas(): Observable<Prueba[]> {
    return this.http.get<Prueba[]>(this.baseUrl);
  }

  getPruebaById(id: number): Observable<Prueba> {
    return this.http.get<Prueba>(`${this.baseUrl}/${id}`);
  }

  createPrueba(dto: CreatePruebaDto): Observable<Prueba> {
    return this.http.post<Prueba>(this.baseUrl, dto);
  }

  updatePrueba(id: number, dto: UpdatePruebaDto): Observable<Prueba> {
    return this.http.put<Prueba>(`${this.baseUrl}/${id}`, dto);
  }

  deletePrueba(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}