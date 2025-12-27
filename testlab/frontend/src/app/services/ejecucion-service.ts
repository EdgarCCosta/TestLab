import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ejecucion, CreateEjecucionDto, UpdateEjecucionDto } from '../models/ejecucion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EjecucionService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/test-executions';

  constructor(private http: HttpClient) {}

  getEjecuciones(): Observable<Ejecucion[]> {
    return this.http
      .get<{ success: boolean; message: string; data: Ejecucion[] }>(
        this.apiUrl + this.endpoint
      )
      .pipe(map(response => response.data));
  }

  getEjecucionById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl + this.endpoint}/${id}`);
  }

  createEjecucion(dto: CreateEjecucionDto): Observable<any> {
    return this.http.post(this.apiUrl + this.endpoint, dto);
  }

  updateEjecucion(id: string, dto: UpdateEjecucionDto): Observable<any> {
    return this.http.put(`${this.apiUrl + this.endpoint}/${id}`, dto);
  }

  deleteEjecucion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl + this.endpoint}/${id}`);
  }
}