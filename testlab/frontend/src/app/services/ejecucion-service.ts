import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ejecucion, CreateEjecucionDto, UpdateEjecucionDto } from '../models/ejecucion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EjecucionService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/test-executions';

  constructor(private http: HttpClient) {}

  getEjecuciones(): Observable<any> {
    return this.http.get(this.apiUrl + this.endpoint);
  }

  getEjecucionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl + this.endpoint}/${id}`);
  }

  createEjecucion(dto: CreateEjecucionDto): Observable<any> {
    return this.http.post(this.apiUrl + this.endpoint, dto);
  }

  updateEjecucion(id: number, dto: UpdateEjecucionDto): Observable<any> {
    return this.http.put(`${this.apiUrl + this.endpoint}/${id}`, dto);
  }

  deleteEjecucion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl + this.endpoint}/${id}`);
  }
}